# NIAGADS Charts

`@niagads/charts` provides React components backed by D3 visualizations. React owns component layout and controls; D3 owns each chart's SVG rendering.

## Installation

```bash
npm install @niagads/charts
```

Chart components include an **Export SVG** control. Supplying `visualizationInfo` also displays the shared **About this visualization** control.

## BubbleHeatmap

`BubbleHeatmap` is a two-value matrix visualization. Circle color represents `value`, circle size represents `size`, and the `x` and `y` fields locate a point in the matrix.

```tsx
import { BubbleHeatmap } from "@niagads/charts";

const data = [
    {
        x: "DLPFC",
        y: "mQTL",
        value: -8.4,
        size: 13.46,
        feature_id: "rs6733839",
        tooltipInfo: [{ label: "FDR", value: "3.45e-14" }],
    },
];

<BubbleHeatmap
    data={data}
    xLabels={[
        {
            value: "DLPFC",
            secondaryLabel: "Dorsolateral prefrontal cortex",
        },
    ]}
    yLabels={["mQTL"]}
    legend={{
        label: "Z-score",
        colorDescription: "direction and magnitude of Z-score",
        sizeDescription: "statistical significance, −log10(FDR)",
    }}
    ariaLabel="Bubble heatmap of xQTL associations by context and xQTL type."
    displayOpts={{ width: 920, height: 510 }}
/>;
```

`xLabels` and `yLabels` are optional. When omitted, the component derives them from the supplied data. Use `{ value, secondaryLabel }` when an axis category has a longer display label.

### ADSP FunGen xQTL Atlas data adapter

This partner-specific adapter accepts the gene and variant result schemas produced by the **ADSP FunGen xQTL Atlas**. It is not a generic xQTL adapter. It returns BubbleHeatmap data and both sets of axis labels.

```tsx
import {
    BubbleHeatmap,
    BubbleHeatmapTranslators,
} from "@niagads/charts";

const { data, xLabels, yLabels } =
    new BubbleHeatmapTranslators.ADSPFunGenXQTL("gene")
        .translate(adspFunGenGeneXQTLData);

<BubbleHeatmap
    data={data}
    xLabels={xLabels}
    yLabels={yLabels}
    legend={{
        label: "Z-score",
        colorDescription: "direction and magnitude of Z-score",
        sizeDescription: "statistical significance, −log10(FDR)",
    }}
/>;
```

For variant results:

```ts
const translated =
    new BubbleHeatmapTranslators.ADSPFunGenXQTL("variant")
        .translate(adspFunGenVariantXQTLData);
```

The adapter orders contexts alphabetically by their displayed long names. Variant target-gene rows preserve their first-occurrence order.

## RegionalManhattanPlot

`RegionalManhattanPlot` displays association scores across a genomic interval. Position and score are generic: consumers determine whether the score represents `−log10(FDR)`, `−log10(p)`, or another measure through their data and axis labels.

The `data` prop contains `points` and an optional `gene`. When present, the gene is drawn below the chromosome ticks and the initial view is focused on its span plus the configured flank.

```tsx
import { RegionalManhattanPlot } from "@niagads/charts";

const data = {
    points: [
        {
            position: 127.135234,
            score: 13.46,
            colorCategory: "Dorsolateral prefrontal cortex (DLPFC)",
            symbolCategory: "mQTL",
            feature_id: "rs6733839",
            tooltipInfo: [{ label: "FDR", value: "3.45e-14" }],
        },
    ],
    gene: {
        gene_symbol: "BIN1",
        chr: "chr2",
        start: 127048027,
        end: 127107288,
        strand: "-" as const,
        flankBp: 500_000,
    },
};

<RegionalManhattanPlot
    data={data}
    threshold={-Math.log10(0.05)}
    thresholdLabel="FDR = 0.05"
    xAxis={{
        min: 123.5,
        max: 131,
        label: "Position on chromosome 2 (Mb)",
    }}
    yAxis={{ min: 0, max: 98, label: "−log10(FDR)" }}
    legend={{ colorLabel: "Context", symbolLabel: "xQTL type" }}
    ariaLabel="Interactive regional Manhattan plot for BIN1 on chromosome 2."
    displayOpts={{ width: 930, height: 610 }}
/>;
```

`gene` is optional. Without it, no gene track is drawn and the initial view uses the complete data interval. `flankBp` is optional and defaults to 500 kb when a gene is supplied.

The chart provides context and symbol filters, a minimum-score control, summary values, gene-focused reset behavior, and a brushable overview for genomic zoom.

### ADSP FunGen xQTL Atlas data adapter

This adapter accepts the regional result schema produced by the **ADSP FunGen xQTL Atlas**; it is not a generic regional xQTL adapter. It converts base-pair positions to megabases, maps `logFDR` to the chart score, maps context to color, and maps xQTL type to symbol.

```tsx
import {
    RegionalManhattanPlot,
    RegionalManhattanPlotTranslators,
} from "@niagads/charts";

const {
    data: translatedData,
    colorLabels,
    symbolLabels,
} = new RegionalManhattanPlotTranslators.ADSPFunGenXQTL("gene")
    .translate(adspFunGenRegionalXQTLData);

const data = {
    ...translatedData,
    gene: {
        gene_symbol: "BIN1",
        chr: "chr2",
        start: 127048027,
        end: 127107288,
        strand: "-" as const,
        flankBp: 500_000,
    },
};

<RegionalManhattanPlot
    data={data}
    colorLabels={colorLabels}
    symbolLabels={symbolLabels}
    yAxis={{ label: "−log10(FDR)" }}
    legend={{ colorLabel: "Context", symbolLabel: "xQTL type" }}
/>;
```

## RankedFeaturePlot

`RankedFeaturePlot` is a horizontal lollipop chart. It sorts features from highest to lowest score. Hovering or focusing anywhere along a row highlights that feature and opens a persistent tooltip.

```tsx
import { RankedFeaturePlot } from "@niagads/charts";

const data = [
    {
        feature_id: "BIN1",
        score: 97.42,
        tooltipInfo: [
            { label: "Associations", value: 2104 },
            { label: "xQTL type", value: "mQTL" },
        ],
    },
];

<RankedFeaturePlot
    data={data}
    xAxis={{
        min: 0,
        max: 115,
        label: "−log10(minimum p-value)",
    }}
    recordUrlTemplate="/gene/<feature_id>"
    ariaLabel="Ranked lollipop plot of genes by minimum p-value."
    displayOpts={{ width: 900 }}
/>;
```

When `recordUrlTemplate` is supplied, `<feature_id>` is replaced with the URL-encoded feature identifier and the tooltip includes an external record link.

### ADSP FunGen xQTL Atlas data adapter

This adapter accepts the regional ranked-gene result schema produced by the **ADSP FunGen xQTL Atlas**. It is not a generic ranked-gene or xQTL adapter.

```tsx
import {
    RankedFeaturePlot,
    RankedFeaturePlotTranslators,
} from "@niagads/charts";

const data =
    new RankedFeaturePlotTranslators.ADSPFunGenXQTL("gene")
        .translate(adspFunGenRankedGeneData);

<RankedFeaturePlot
    data={data}
    xAxis={{
        min: 0,
        max: 115,
        label: "−log10(minimum p-value)",
    }}
    recordUrlTemplate="https://xqtl.niagads.org/gene/<feature_id>"
/>;
```

The adapter maps `targetGene` to `feature_id`, maps `mlog10` to `score`, and adds relevant xQTL metadata to the tooltip.

## Shared chart features

The following options are available for all chart components.

### Display options

Each component accepts `displayOpts` for dimensions and margins. Numeric widths are rendered in pixels; components also accept CSS width strings.

```tsx
displayOpts={{
    width: 920,
    height: 510,
    margin: { top: 40, right: 80, bottom: 100, left: 120 },
}}
```

### About this visualization

All chart components accept `visualizationInfo`. Supplying it displays the shared **About this visualization** control. The panel closes when the user clicks or moves focus outside it, or presses Escape.

The `visualizationInfo` prop implements `VisualizationInfoContent`:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | `string` | Yes | Brief explanation of what the visualization shows. |
| `encodings` | `Array<{ label: string; description: string }>` | No | Named visual encodings and explanations of what each represents. These supplement rather than replace visible chart legends. |
| `interactions` | `string[]` | No | Instructions for using the visualization. When omitted, the chart uses its standard interactions where defined. Providing an array replaces those defaults. |
| `rules` | `string[]` | No | Filtering, aggregation, or data-handling rules needed to interpret the visualization. When omitted, the chart uses its standard rules where defined. Providing an array replaces those defaults. |

Provide a chart-specific description and its essential encodings:

```tsx
<BubbleHeatmap
    data={data}
    xLabels={xLabels}
    yLabels={yLabels}
    visualizationInfo={{
        description:
            "This figure compares association evidence across biological contexts and xQTL types.",
        encodings: [
            {
                label: "Position",
                description: "Columns show biological contexts and rows show xQTL types.",
            },
            {
                label: "Color",
                description: "Color shows the direction and magnitude of the Z-score.",
            },
            {
                label: "Size",
                description: "Circle size shows statistical significance using −log10(FDR).",
            },
        ],
    }}
/>;
```

Each chart supplies its standard `interactions` and, where defined, `rules` when those fields are omitted. Pass either field to replace that chart's defaults. Essential encodings should remain visible in the chart or legend rather than relying only on the information panel.

### Accessibility and SVG export

Supply an `ariaLabel` that identifies the visualization and explains its essential encodings. Each component includes an **Export SVG** control. The export filename uses the chart `title` when supplied and otherwise uses a chart-specific default.
