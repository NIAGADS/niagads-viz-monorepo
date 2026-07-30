import type { Meta, StoryObj } from "@storybook/react";

import { RegionalManhattanPlot, RegionalManhattanPlotDataPoint } from "@niagads/charts";

const contexts = [
    "Anterior caudate (AC)",
    "Dorsolateral prefrontal cortex (DLPFC)",
    "Excitatory neurons (exc)",
    "Microglia (mic)",
    "Parahippocampal gyrus (PHG)",
    "Parietal cortex (PC)",
    "Posterior cingulate cortex (PCC)",
];

const types = ["eQTL", "haQTL", "mQTL", "pQTL", "sQTL", "snuc-eQTL"];

const random = (() => {
    let state = 2147;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
})();

const uniform = (min: number, max: number): number => min + random() * (max - min);

const normal = (mean = 0, deviation = 1): number => {
    const u = Math.max(random(), Number.EPSILON);
    const v = random();
    return mean + deviation * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const makePoint = (position: number, score: number): RegionalManhattanPlotDataPoint => {
    const context = contexts[Math.floor(uniform(0, contexts.length))];
    const type = types[Math.floor(uniform(0, types.length))];
    return {
        position,
        score,
        colorCategory: context,
        symbolCategory: type,
        feature_id: `rs${Math.floor(uniform(1_000_000, 999_999_999))}`,
        details: [
            { label: "FDR", value: (10 ** -score).toExponential(2) },
            { label: "Context", value: context },
            { label: "Type", value: type },
        ],
    };
};

const idealizedData: RegionalManhattanPlotDataPoint[] = [];
const locusCenter = 127.08;

for (let index = 0; index < 245; index += 1) {
    idealizedData.push(
        makePoint(
            uniform(123.8, 130.8),
            Math.max(1.2, Math.min(7, 1.5 + Math.abs(normal(0, 1.2)))),
        )
    );
}

for (let index = 0; index < 170; index += 1) {
    const distance = normal(0, 0.045);
    const score = Math.min(
        94,
        6 + 82 * Math.exp(-Math.abs(distance) * 26) * uniform(0.45, 1.05)
    );
    idealizedData.push(makePoint(locusCenter + distance, score));
}

idealizedData.push({
    position: 127.102,
    score: 94,
    colorCategory: "Dorsolateral prefrontal cortex (DLPFC)",
    symbolCategory: "mQTL",
    feature_id: "rs11679418",
    details: [
        { label: "FDR", value: (10 ** -94).toExponential(2) },
        { label: "Context", value: "Dorsolateral prefrontal cortex (DLPFC)" },
        { label: "Type", value: "mQTL" },
    ],
});

const meta = {
    title: "Charts/RegionalManhattanPlot",
    component: RegionalManhattanPlot,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof RegionalManhattanPlot>;

export default meta;
type Story = StoryObj<typeof RegionalManhattanPlot>;

export const BIN1Region: Story = {
    args: {
        data: idealizedData,
        colorLabels: contexts,
        symbolLabels: types,
        threshold: -Math.log10(0.05),
        thresholdLabel: "FDR = 0.05",
        xAxis: {
            min: 123.5,
            max: 131,
            label: "Position on chromosome 2 (Mb)",
        },
        yAxis: {
            min: 0,
            max: 98,
            label: "−log10(FDR)",
        },
        legend: {
            colorLabel: "Context",
            symbolLabel: "xQTL type",
        },
        visualizationInfo: {
            description:
                "This regional Manhattan plot shows association strength across a genomic interval.",
            encodings: [
                { label: "Position", description: "Horizontal location is genomic position in megabases." },
                { label: "Height", description: "Vertical position is −log10(FDR); higher points are stronger associations." },
                { label: "Color", description: "Color identifies the biological context." },
                { label: "Shape", description: "Symbol shape identifies the xQTL type." },
                { label: "Size", description: "Points with scores above 30 are slightly larger." },
            ],
            interactions: [
                "Hover or focus a point to inspect its values.",
                "Drag the overview brush to zoom the genomic interval.",
                "Use the selectors to filter context and xQTL type.",
                "Raise the minimum score to filter points and zoom the y-axis.",
                "Use Reset to restore all filters and the full genomic interval.",
            ],
            rules: [
                "Summary cards describe only points visible after filters and zoom are applied.",
                "The overview retains the full data range while the main plot is zoomed.",
            ],
        },
        ariaLabel:
            "Interactive regional association plot for BIN1 on chromosome 2. Association strength is shown on the vertical axis, context by color, and xQTL type by shape.",
        displayOpts: {
            width: 930,
            height: 610,
        },
    },
};
