import { BubbleHeatmapDataPoint } from "./BubbleHeatmap";

export interface ADSPFunGenXQTLRecord {
    context: string;
    context_long: string;
    xQTLtype: string;
    Z: number;
    FDR: number;
    logFDR: number;
    rsID: string;
}

export interface ADSPFunGenVariantXQTLRecord extends ADSPFunGenXQTLRecord {
    targetGene: string;
}

const formatScientific = (value: number): string => value.toExponential(2).replace("e-0", "e-").replace("e+0", "e+");

const getFdr = (datum: ADSPFunGenXQTLRecord): number => (datum.FDR > 0 ? datum.FDR : 10 ** -datum.logFDR);

const getContextLabels = (source: readonly ADSPFunGenXQTLRecord[]) =>
    Array.from(
        new Map(
            source.map((datum) => [
                datum.context,
                {
                    value: datum.context,
                    secondaryLabel: datum.context_long.replace(/\s*\([^)]*\)\s*$/, ""),
                },
            ])
        ).values()
    );

class ADSPFunGenXQTLTranslator {
    constructor(private resultType: "gene" | "variant") {}

    private translateGene(source: readonly ADSPFunGenXQTLRecord[]) {
        const data: BubbleHeatmapDataPoint[] = source.map((datum) => ({
            x: datum.context,
            y: datum.xQTLtype,
            value: datum.Z,
            size: datum.logFDR,
            feature_id: datum.rsID,
            details: [
                { label: "FDR", value: formatScientific(getFdr(datum)) },
                { label: "−log10(FDR)", value: datum.logFDR.toFixed(1) },
            ],
        }));

        const xLabels = getContextLabels(source);
        const yLabels = Array.from(new Set(source.map((datum) => datum.xQTLtype)));

        return { data, xLabels, yLabels };
    }

    private translateVariant(source: readonly ADSPFunGenVariantXQTLRecord[]) {
        const translated = this.translateGene(source);

        return {
            ...translated,
            data: translated.data.map((datum, index) => ({
                ...datum,
                y: source[index].targetGene,
                details: [{ label: "xQTL type", value: source[index].xQTLtype }, ...(datum.details ?? [])],
            })),
            yLabels: Array.from(new Set(source.map((datum) => datum.targetGene))),
        };
    }

    translate(source: readonly ADSPFunGenXQTLRecord[] | readonly ADSPFunGenVariantXQTLRecord[]) {
        return this.resultType === "variant"
            ? this.translateVariant(source as readonly ADSPFunGenVariantXQTLRecord[])
            : this.translateGene(source);
    }
}

export const BubbleHeatmapTranslators = {
    ADSPFunGenXQTL: ADSPFunGenXQTLTranslator,
};
