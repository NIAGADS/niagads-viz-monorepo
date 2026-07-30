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

class ADSPFunGenXQTLTranslator {
    constructor(private resultType: "gene" | "variant") {}

    private formatScientific(value: number): string {
        return value.toExponential(2).replace("e-0", "e-").replace("e+0", "e+");
    }

    private getFdr(datum: ADSPFunGenXQTLRecord): number {
        return datum.FDR > 0 ? datum.FDR : 10 ** -datum.logFDR;
    }

    private getContextLabels(source: readonly ADSPFunGenXQTLRecord[]) {
        return Array.from(
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
    }

    private translateGene(source: readonly ADSPFunGenXQTLRecord[]) {
        const data: BubbleHeatmapDataPoint[] = source.map((datum) => ({
            x: datum.context,
            y: datum.xQTLtype,
            value: datum.Z,
            size: datum.logFDR,
            feature_id: datum.rsID,
            details: [
                { label: "FDR", value: this.formatScientific(this.getFdr(datum)) },
                { label: "−log10(FDR)", value: datum.logFDR.toFixed(1) },
            ],
        }));

        const xLabels = this.getContextLabels(source);
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
