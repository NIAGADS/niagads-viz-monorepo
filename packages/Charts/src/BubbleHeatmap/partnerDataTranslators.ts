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
        ).sort((left, right) => left.secondaryLabel.localeCompare(right.secondaryLabel));
    }

    private translateDataPoint(datum: ADSPFunGenXQTLRecord): BubbleHeatmapDataPoint {
        return {
            x: datum.context,
            y: datum.xQTLtype,
            value: datum.Z,
            size: datum.logFDR,
            feature_id: datum.rsID,
            details: [
                { label: "FDR", value: this.formatScientific(this.getFdr(datum)) },
                { label: "−log10(FDR)", value: datum.logFDR.toFixed(1) },
            ],
        };
    }

    private translateGene(source: readonly ADSPFunGenXQTLRecord[]) {
        const data = source.map((datum) => this.translateDataPoint(datum));

        const xLabels = this.getContextLabels(source);
        const yLabels = Array.from(new Set(source.map((datum) => datum.xQTLtype)));

        return { data, xLabels, yLabels };
    }

    private translateVariant(source: readonly ADSPFunGenVariantXQTLRecord[]) {
        return {
            data: source.map((datum) => {
                const dataPoint = this.translateDataPoint(datum);
                return {
                    ...dataPoint,
                    y: datum.targetGene,
                    details: [{ label: "xQTL type", value: datum.xQTLtype }, ...(dataPoint.details ?? [])],
                };
            }),
            xLabels: this.getContextLabels(source),
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
