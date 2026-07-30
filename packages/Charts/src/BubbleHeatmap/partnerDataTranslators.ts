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

class ADSPFunGenXQTLTranslator {
    private formatScientific(value: number): string {
        return value.toExponential(2).replace("e-0", "e-").replace("e+0", "e+");
    }

    private getFdr(datum: ADSPFunGenXQTLRecord): number {
        return datum.FDR > 0 ? datum.FDR : 10 ** -datum.logFDR;
    }

    translate(source: readonly ADSPFunGenXQTLRecord[]) {
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

        const xLabels = Array.from(
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

        const yLabels = Array.from(new Set(source.map((datum) => datum.xQTLtype)));

        return { data, xLabels, yLabels };
    }
}

export const BubbleHeatmapTranslators = {
    ADSPFunGenXQTL: ADSPFunGenXQTLTranslator,
};
