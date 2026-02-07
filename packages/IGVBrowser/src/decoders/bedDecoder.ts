import { capitalize, numberFormatter } from "./utils";

import igv from "igv/dist/igv.esm";

const EXPECTED_BED_FIELDS = [
    "chr",
    "start",
    "end",
    "name",
    "score",
    "strand",
    "cdStart",
    "cdEnd",
    "color",
    "blockCount",
    "blockSizes",
    "blockStarts",
];

// make column name lower then comapare
const P_VALUE_FIELDS = ["pvalue", "p-value", "pval", "p_value"]; //TODO: check nominal pvalue
const TARGET_GENE_SYMBOL_FIELD = "target_gene_symbol";
const TARGET_GENE_ID_FIELD = "target_ensembl_id";
const VARIANT_ID_FIELD = "variant_id";
const IGNORE_OPTIONAL_FIELDS = new Set(["user_input", "target_info"]);
//const NEG_LOG10_P_CAP = 50;

interface Popup {
    name: string;
    value: any;
}

function decodeBedXY(tokens: any, header: any) {
    // Get X (number of standard BED fields) and Y (number of optional BED fields) out of format
    const match = header.format.match(/bed(\d{1,2})\+(\d+)/);
    const X = parseInt(match[1]);
    const Y = parseInt(match[2]);

    if (tokens.length < 3) return undefined;

    const chr = tokens[0];
    const start = parseInt(tokens[1]);
    const end = tokens.length > 2 ? parseInt(tokens[2]) : start + 1;
    if (isNaN(start) || isNaN(end)) {
        return new igv.DecodeError(`Unparsable bed record.`);
    }

    let feature = new BedXYFeature(chr, start, end);

    // lazy popupData: compute on first access to avoid work for every feature
    Object.defineProperty(feature, "popupData", {
        configurable: true,
        enumerable: false,
        get() {
            const data = extractPopupData(this);
            Object.defineProperty(this, "popupData", { value: data, writable: false });
            return data;
        },
    });

    // build a lowercase field->index map once per header for O(1) lookups
    const fieldIndexMap: Record<string, number> = Object.create(null);
    for (let i = 0; i < header.columnNames.length; i++) {
        const key = String(header.columnNames[i]).toLowerCase();
        fieldIndexMap[key] = i;
    }

    if (X > 3) {
        // parse additional standard BED (beyond chr, start, end) columns
        parseStandardFields(feature, X, tokens);
    }

    // parse optional columns (pass the fieldIndexMap and IGNORE_OPTIONAL_FIELDS set)
    parseOptionalFields(feature, tokens, X, header.columnNames, IGNORE_OPTIONAL_FIELDS);

    feature.setP(tokens, fieldIndexMap);
    feature.setTarget(tokens, fieldIndexMap);
    feature.setVariant(tokens, fieldIndexMap);

    return feature;
}

function extractPopupData(feature: BedXYFeature) {
    const filteredProperties = new Set(["row", "color", "chr", "start", "end", "cdStart", "cdEnd", "strand", "alpha"]);
    const data: Popup[] = [];

    for (const property in feature) {
        //If it's the info object
        if (property === "info") {
            //iterate over info and add it to data
            for (const infoProp of Object.keys(feature)) {
                const value = feature[property][infoProp];
                if (value) {
                    data.push({ name: formatInfoKey(infoProp), value: value });
                }
            }
        } else {
            if (!filteredProperties.has(property)) {
                const value = feature[property];
                data.push({ name: capitalize(property), value: value });
            }
        }
    }

    // final chr position
    let posString = `${feature.chr}:${numberFormatter(feature.start + 1)}-${numberFormatter(feature.end)}`;
    if (feature.strand) {
        posString += ` (${feature.strand})`;
    }

    data.push({ name: "Location", value: posString });

    return data;
}

function formatInfoKey(key: string) {
    let result = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    result = result
        .replace(/FDR_/gi, "FDR_")
        .replace(/QC_/gi, "QC_")
        .replace(/qtl_/gi, "QTL_")
        .replace(/_/g, " ")
        .replace("non ref", "(non ref)");
    return result;
}

function parseBedToken(field: string, token: string) {
    switch (field) {
        case "name":
            return token === "." ? "" : token;
        case "score":
            if (token === ".") return 0;
            return Number(token);
        case "strand":
            return [".", "+", "-"].includes(token) ? token : null;
        case "cdStart":
        case "cdEnd":
            return parseInt(token);
        case "color":
            if (token === "." || token === "0") return null;
            return igv.IGVColor.createColorString(token);
        default:
            return token;
    }
}

function parseStandardFields(feature: BedXYFeature, X: number, tokens: any) {
    const attributes: any = {};
    for (let index = 3; index < X; index++) {
        const field: string = EXPECTED_BED_FIELDS[index];
        const value = parseBedToken(field, tokens[index]);
        if (value === null) continue;
        if (typeof value === "number" && isNaN(value)) {
            continue;
        }
        attributes[field] = value;
    }

    // add to the feature and return
    feature.setAdditionalAttributes(attributes);
}

function parseOptionalFields(
    feature: BedXYFeature,
    tokens: any,
    X: number,
    fields: any,
    ignoreOptionalFields: Set<string>
) {
    // go through tokens and perform minimal parsing add optional columns to feature.info
    const infoProps: any = {};
    for (let i = X; i < fields.length; i++) {
        const propKey = fields[i];
        if (!ignoreOptionalFields.has(propKey)) {
            let value = tokens[i];
            // check to see if the feature is a number in a string and convert it
            if (!isNaN(value) && typeof value !== "number") {
                value = value * 1;
            }
            if (value === ".") value = null;
            infoProps[propKey] = value;
        }
    }
    feature.setAdditionalAttributes({ info: infoProps });
}

class BedXYFeature {
    chr: string;
    start: number;
    end: number;
    score: number;
    info: any;
    [key: string]: any;

    constructor(chr: string, start: number, end: number, score = 1000) {
        this.start = start;
        this.end = end;
        this.chr = chr;
        this.score = score;
    }

    setAdditionalAttributes(attributes: any) {
        Object.assign(this, attributes);
    }

    removeAttributes(attributes: string[]) {
        for (const attr of attributes) {
            delete this[attr];
        }
    }

    getAttributeValue(attributeName: string): any {
        const key = attributeName as keyof BedXYFeature;
        if (this.hasOwnProperty(key)) {
            return this[key];
        } else if (this.info.hasOwnProperty(key)) {
            return this.info[key];
        } else {
            return null;
        }
    }

    setVariant(tokens: any, fieldIndexMap: Record<string, number>) {
        const index = fieldIndexMap[VARIANT_ID_FIELD] ?? -1;
        if (index === -1 || !tokens[index]) return;

        const val = String(tokens[index]).replace("chr", "");
        this.setAdditionalAttributes({
            variant: val,
            record_pk: val,
        });

        if (!this.name) {
            this.setAdditionalAttributes({ name: tokens[index] });
        }

        this.removeAttributes([VARIANT_ID_FIELD]);
    }

    setP(tokens: any, fieldIndexMap: Record<string, number>) {
        for (const field of P_VALUE_FIELDS) {
            const index = fieldIndexMap[field];
            if (index !== undefined) {
                const pValue = parseFloat(tokens[index]);
                if (isNaN(pValue)) continue;
                const neg_log10_pvalue = -1 * Math.log10(pValue);

                this.setAdditionalAttributes({
                    pvalue: pValue.toExponential(2),
                    neg_log10_pvalue: neg_log10_pvalue,
                });

                this.removeAttributes([field]);
                break;
            }
        }
    }

    setTarget(tokens: any, fieldIndexMap: Record<string, number>) {
        const indexSymbol = fieldIndexMap[TARGET_GENE_SYMBOL_FIELD];
        const targetGeneSymbol = indexSymbol !== undefined ? tokens[indexSymbol] : undefined;

        const indexId = fieldIndexMap[TARGET_GENE_ID_FIELD];
        const targetGeneId = indexId !== undefined ? tokens[indexId] : targetGeneSymbol;

        this.setAdditionalAttributes({
            gene_symbol: targetGeneSymbol,
            gene_id: targetGeneId,
        });
        this.removeAttributes([TARGET_GENE_ID_FIELD, TARGET_GENE_SYMBOL_FIELD]);
    }
}

export default decodeBedXY;
