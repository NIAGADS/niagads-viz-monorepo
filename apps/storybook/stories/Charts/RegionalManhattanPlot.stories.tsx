import type { Meta, StoryObj } from "@storybook/react";

import { RegionalManhattanPlot, RegionalManhattanPlotTranslators } from "@niagads/charts";

import xqtlAtlasBin1ManhattanPlot from "../../examples/manhattan-plots/xqtl_atlas_bin1_manhattan_plot.json";

const { data, colorLabels, symbolLabels } = new RegionalManhattanPlotTranslators.ADSPFunGenXQTL("gene").translate(
    xqtlAtlasBin1ManhattanPlot
);

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

export const QTLAssociationsInBIN1Region: Story = {
    parameters: {
        docs: {
            description: {
                story: `
This example uses \`RegionalManhattanPlotTranslators.ADSPFunGenXQTL("gene")\` to convert ADSP FunGen gene xQTL regional data into RegionalManhattanPlot data and legend labels.

\`\`\`ts
const { data, colorLabels, symbolLabels } =
    new RegionalManhattanPlotTranslators.ADSPFunGenXQTL("gene")
        .translate(xqtlData);
\`\`\`
                `,
            },
        },
    },
    args: {
        data,
        gene: {
            gene_symbol: "BIN1",
            chr: "chr2",
            start: 127048027,
            end: 127107288,
            strand: "-",
        },
        colorLabels,
        symbolLabels,
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
            description: "This regional Manhattan plot shows association strength across a genomic interval.",
            encodings: [
                { label: "Position", description: "Horizontal location is genomic position in megabases." },
                {
                    label: "Height",
                    description: "Vertical position is −log10(FDR); higher points are stronger associations.",
                },
                { label: "Color", description: "Color identifies the biological context." },
                { label: "Shape", description: "Symbol shape identifies the xQTL type." },
                { label: "Size", description: "Points with scores above 30 are slightly larger." },
                {
                    label: "Gene track",
                    description: "The bar shows the gene span and its arrow indicates strand direction.",
                },
            ],
            interactions: [
                "Hover or focus a point to inspect its values.",
                "Drag the overview brush to zoom the genomic interval.",
                "The initial view shows the supplied gene with a 100 kb flank on each side.",
                "Use the selectors to filter context and xQTL type.",
                "Raise the minimum score to filter points and zoom the y-axis.",
                "Use Reset to restore all filters and the initial gene-focused interval.",
            ],
            rules: [
                "Summary cards describe only points visible after filters and zoom are applied.",
                "The overview retains the full data range while the main plot is zoomed.",
            ],
        },
        ariaLabel:
            "Interactive regional Manhattan plot for BIN1 on chromosome 2. Association strength is shown on the vertical axis, context by color, and xQTL type by shape.",
        displayOpts: {
            width: 930,
            height: 610,
        },
    },
};
