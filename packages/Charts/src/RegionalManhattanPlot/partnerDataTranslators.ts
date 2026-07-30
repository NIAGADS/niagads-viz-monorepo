import { RegionalManhattanPlotDataPoint } from "./RegionalManhattanPlot";

export interface ADSPFunGenRegionalXQTLRecord {
    rsID: string;
    xQTLtype: string;
    context: string;
    study: string;
    FDR: number;
    chr: string;
    pos: number;
    ref: string;
    alt: string;
    cisOrTad: string;
    "p-value": number;
    Z: number;
    "distance to target": number;
    targetGene: string;
    target: string;
    context_long: string;
    logFDR: number;
    sig: boolean;
    z_dir: string;
    label: string;
}

class ADSPFunGenXQTLTranslator {
    constructor(private resultType: "gene") {}

    private formatScientific(value: number): string {
        return value.toExponential(2).replace("e-0", "e-").replace("e+0", "e+");
    }

    private getFdr(datum: ADSPFunGenRegionalXQTLRecord): number {
        return datum.FDR > 0 ? datum.FDR : 10 ** -datum.logFDR;
    }

    private translateGene(source: readonly ADSPFunGenRegionalXQTLRecord[]) {
        const data: RegionalManhattanPlotDataPoint[] = source.map((datum) => ({
            position: datum.pos / 1_000_000,
            score: datum.logFDR,
            colorCategory: datum.context_long,
            symbolCategory: datum.xQTLtype,
            feature_id: datum.rsID,
            details: [
                { label: "FDR", value: this.formatScientific(this.getFdr(datum)) },
                { label: "Z-score", value: datum.Z.toFixed(2) },
                { label: "Study", value: datum.study },
                { label: "Target gene", value: datum.targetGene },
                { label: "Relationship", value: datum.cisOrTad },
                { label: "Distance to target", value: datum["distance to target"].toLocaleString() },
            ],
        }));

        const colorLabels = Array.from(new Set(source.map((datum) => datum.context_long)));
        const symbolLabels = Array.from(new Set(source.map((datum) => datum.xQTLtype)));

        return { data: { points: data }, colorLabels, symbolLabels };
    }

    translate(source: readonly ADSPFunGenRegionalXQTLRecord[]) {
        return this.resultType === "gene"
            ? this.translateGene(source)
            : { data: { points: [] }, colorLabels: [], symbolLabels: [] };
    }
}

export const RegionalManhattanPlotTranslators = {
    ADSPFunGenXQTL: ADSPFunGenXQTLTranslator,
};
