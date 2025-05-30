import { FEATURE_INFO_BASE_URL } from "../common/_constants";

const _geneSubFeaturePopoverData = (fields: string[], info: any, pData: any[]) => {
    // type
    // name
    // biotype - most
    // ends with _id    / some may have transcript or exon id plus another id
    // location
    // number -- catch outside
    pData.push({
        name: "Feature Type:",
        value: info[fields.indexOf("type")].value.replace(/_/g, " "),
    });
    if (fields.includes("name")) {
        pData.push({ name: "Name:", value: info[fields.indexOf("name")].value });
    }
    if (fields.includes("biotype")) {
        pData.push({
            name: "Biotype:",
            value: info[fields.indexOf("biotype")].value.replace(/_/g, " "),
        });
    }

    // find IDs for this feature
    // next feature starts at the next <hr>
    // so stop looking when field === "hr"
    const idIndices = fields
        .slice(0, fields.indexOf("hr"))
        .map((elem: string, index: number) => (elem.endsWith("id") ? index : ""))
        .filter(String);

    idIndices.forEach((index: any) => {
        let idName = info[index].name.replace(":", "");
        idName = idName.includes("_")
            ? idName.charAt(0).toUpperCase() + idName.slice(1).replace("_id", " ID:")
            : idName.toUpperCase().replace("ID", " ID:");

        pData.push({ name: idName, value: info[index].value });
    });

    pData.push({
        name: "Location: ",
        value: info[fields.indexOf("location")].value,
    });

    return pData;
};

const _geneTrackPopoverData = (info: any) => {
    const regexp = / \[.+\]/i;

    let fields = info.map((elem: any) => {
        return elem.hasOwnProperty("name") ? elem.name.toLowerCase().replace(":", "").replace(" ", "_") : "hr";
    });
    let pData: any = [];

    const featureType = info[fields.indexOf("type")].value.replace("_", " ");
    if (featureType === "gene" || featureType.endsWith("gene")) {
        const geneSymbol = info[fields.indexOf("name")].value;
        pData.push({ name: "Feature Type:", value: featureType });
        pData.push({ name: "Name:", value: geneSymbol });

        if (fields.includes("gene_id")) {
            const geneId = info[fields.indexOf("gene_id")].value;
            const recHref = FEATURE_INFO_BASE_URL + "/gene/" + geneId;

            pData.push({
                name: "More Info:",
                html: '<a target="_blank" href="' + recHref + '" title="">' + geneId + "</a>",
                title: "View NIAGADS GenomicsDB report for gene: " + geneSymbol,
            });
        }

        if (fields.includes("description")) {
            const product = info[fields.indexOf("description")].value.replace(regexp, "");
            pData.push({ name: "Product:", value: product });
        }

        const biotype = info[fields.indexOf("biotype")];
        if (biotype.hasOwnProperty("color")) {
            pData.push({
                name: "Biotype:",
                value: biotype.value.replace(/_/g, " "),
                color: biotype.color,
            });
        } else {
            pData.push({ name: "Biotype:", value: biotype.value.replace(/_/g, " ") });
        }

        pData.push({
            name: "Location:",
            value: info[fields.indexOf("location")].value,
        });
    } else {
        pData = _geneSubFeaturePopoverData(fields, info, pData); // floating transcript
    }

    // find first divider and take everything from that point as a component feature of the gene
    let infoSlice = info;
    while (fields.includes("hr")) {
        const dividerIndex = fields.indexOf("hr"); // find next divider
        pData.push("<hr>"); // push the divider
        fields = fields.splice(dividerIndex + 1);
        infoSlice = infoSlice.splice(dividerIndex + 1);
        if (fields.length > 1) {
            pData = _geneSubFeaturePopoverData(fields, infoSlice, pData);
        } else {
            // should be Exon Number
            if (fields[0] === "exon_number") {
                pData.push({ name: "Exon Number:", value: infoSlice[0].value });
            }
        }
    }
    return pData;
};

const formatPopoverData = (data: any) => {
    for (const row of data) {
        if (row.hasOwnProperty("value")) {
            let value = row.value;
            if (value !== null && !isNaN(value)) {
                // if the number is in scientific notation or greater than 1, round to two decimal places plus the exponent
                if (value.toString().includes("e") || value > 1) {
                    if (value.toString().includes("e")) {
                        const [number, exponent] = value.toString().split("e");
                        value = parseFloat(number).toFixed(2) + "e" + exponent;
                    } else {
                        value = parseFloat(value).toFixed(2);
                    }
                }
                //If the number is more than 5 digits, round to 5.
                else if (value.toString().length > 6) {
                    value = parseFloat(value).toFixed(5);
                }
                row.value = value;
            }
        }
    }
    return data;
};

const trackPopover = (track: any, popoverData: any) => {
    // Don't show a pop-over when there's no data.
    if (!popoverData || !popoverData.length) {
        return false;
    }

    popoverData = track.id === "ENSEMBL_GENE" ? _geneTrackPopoverData(popoverData) : popoverData;
    popoverData = formatPopoverData(popoverData);
    const tableStartMarkup = '<table style="background: transparent; position: relative; border-spacing: 0">';

    let markup = tableStartMarkup;
    popoverData.forEach(function (item: any) {
        if (item === "<hr>" || item === "<hr/>" || item === "<HR>" || item === "<HR/>") {
            markup += "</table>" + " <hr> " + tableStartMarkup;
        } else {
            let value = item.html ? item.html : item.value ? item.value : item.toString();
            const color = item.color ? item.color : null;

            if (color !== null) {
                value = '<span style="padding-left: 8px; border-left: 4px solid ' + color + '">' + value + "</span>";
            }

            const title = item.title ? item.title : null;
            const label = item.name ? item.name : null;

            if (title) {
                value = `<div title="${title}">${value}</div>`;
            }

            if (label) {
                const hoverCSS = `onMouseOver='this.style.backgroundColor="#EEE"'; onMouseOut='this.style.backgroundColor="#FFF"'`;
                markup +=
                    `<tr ${hoverCSS}><td style='padding-left: 5px'>` +
                    label +
                    "</td><td style='padding-left: 5px'>" +
                    value +
                    "</td></tr>";
            } else {
                // not a name/value pair
                if (value === "<hr/>") {
                    value = "<hr color='#7F7F7F' noshade size='1px'/>";
                    markup +=
                        "<tr><td style='padding: 0'>" + value + "</td><td style='padding: 0'>" + value + "</td></tr>";
                } else {
                    markup += "<tr><td>" + value + "</td><td>" + value + "</td></tr>";
                }
            }
        }
    });

    markup += "</table>";

    // By returning a string from the trackclick handler we're asking IGV to use our custom HTML in its pop-over.
    return markup;
};

export default trackPopover;
