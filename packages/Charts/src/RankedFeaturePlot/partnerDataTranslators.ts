import { RankedFeaturePlotDataPoint } from "./RankedFeaturePlot";

export interface ADSPFunGenRankedGeneXQTLRecord {
    targetGene: string;
    minP: number;
    n: number;
    mlog10: number;
    xQTLtype: string;
    context: string;
    context_long: string;
    "Z-score": number;
    cisOrTad: string;
    "distance to target": number;
    target: string;
}

class ADSPFunGenXQTLTranslator {
    constructor(private resultType: "gene") {}

    private translateGene(source: readonly ADSPFunGenRankedGeneXQTLRecord[]): RankedFeaturePlotDataPoint[] {
        return source.map((datum) => ({
            feature_id: datum.targetGene,
            score: datum.mlog10,
            tooltipInfo: [
                { label: "Associations", value: datum.n },
                { label: "xQTL type", value: datum.xQTLtype },
                { label: "Context", value: datum.context_long },
                { label: "Z-score", value: datum["Z-score"].toFixed(2) },
                { label: "Relationship", value: datum.cisOrTad },
                { label: "Distance to target", value: datum["distance to target"].toLocaleString() },
            ],
        }));
    }

    translate(source: readonly ADSPFunGenRankedGeneXQTLRecord[]): RankedFeaturePlotDataPoint[] {
        return this.resultType === "gene" ? this.translateGene(source) : [];
    }
}

export const RankedFeaturePlotTranslators = {
    ADSPFunGenXQTL: ADSPFunGenXQTLTranslator,
};
