import * as d3 from "d3";

export interface VariantTrackTick {
    value: number;
    label: string;
}

export interface VariantTrackRegion {
    start: number;
    end: number;
    label?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    textColor?: string;
}

export interface VariantTrackVariant {
    position: number;
    value: number;
    color: string;
    group?: string;
    radius?: number;
    strokeWidth?: number;
    label?: string;
}

export interface VariantTrackSegment {
    start: number;
    end: number;
    fill: string;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}

export interface VariantTrackBackgroundBand {
    start: number;
    end: number;
    y?: number;
    height?: number;
    fill: string;
}

export interface VariantTrackOverview {
    y?: number;
    baselineHeight?: number;
    baselineStroke?: string;
    segments: VariantTrackSegment[];
    backgroundBands?: VariantTrackBackgroundBand[];
}

export interface VariantTrackIntron {
    start: number;
    end: number;
    stroke?: string;
    strokeWidth?: number;
}

export interface VariantTrackExon {
    start: number;
    end: number;
    fill: string;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}

export interface VariantTrackGene {
    label: string;
    y?: number;
    labelX?: number;
    labelDy?: number;
    exonHeight?: number;
    rowBackground?: {
        height: number;
        fill: string;
        stroke?: string;
    };
    introns: VariantTrackIntron[];
    exons: VariantTrackExon[];
    separatorY?: number;
    separatorStroke?: string;
}

export interface VariantTrackLegendBlock {
    start: number;
    end: number;
    fill: string;
    label?: string;
    group?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface VariantTrackLegend {
    y?: number;
    height?: number;
    blocks: VariantTrackLegendBlock[];
    rowBackground?: {
        height: number;
        fill: string;
        stroke?: string;
    };
    highlightedRegion?: VariantTrackRegion;
}

export interface VariantTrackAnnotation {
    x: number;
    y: number;
    dx?: number;
    dy?: number;
    align?: "left" | "right";
    lines: string[];
    titleLineCount?: number;
    showDot?: boolean;
}

export interface AnnotatedVariantTrackTheme {
    backgroundFill?: string;
    panelGradientStart?: string;
    panelGradientEnd?: string;
    titleColor?: string;
    textColor?: string;
    mutedTextColor?: string;
    connectorColor?: string;
    guideColor?: string;
    scaleFill?: string;
    scaleStroke?: string;
    zoomFill?: string;
    zoomStroke?: string;
    overviewLine?: string;
    overviewFill?: string;
    geneLine?: string;
    focusStroke?: string;
    hoverStroke?: string;
    fontFamily?: string;
}

export interface AnnotatedVariantTrackOptions {
    width?: number;
    height?: number;
    aspectRatio?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    domain: [number, number];
    scaleBand?: {
        y?: number;
        height?: number;
        ticks: VariantTrackTick[];
        highlightedRegion?: VariantTrackRegion;
    };
    variants: {
        baseY?: number;
        maxValue?: number;
        guideRegion?: {
            start: number;
            end: number;
            topY?: number;
            bottomY?: number;
        };
        items: VariantTrackVariant[];
    };
    overviewTrack: VariantTrackOverview;
    genes: VariantTrackGene[];
    traitLegend: VariantTrackLegend;
    annotations?: VariantTrackAnnotation[];
    theme?: AnnotatedVariantTrackTheme;
}

const DEFAULT_THEME: Required<AnnotatedVariantTrackTheme> = {
    backgroundFill: "#f3f6fa",
    panelGradientStart: "#ffffff",
    panelGradientEnd: "#eef3f8",
    titleColor: "#4f627a",
    textColor: "#4f627a",
    mutedTextColor: "#7e90a8",
    connectorColor: "#b7c5d6",
    guideColor: "#c0cedd",
    scaleFill: "#d7e5f3",
    scaleStroke: "#2f6f9f",
    zoomFill: "#68b6e8",
    zoomStroke: "#5d86ad",
    overviewLine: "#7d90a4",
    overviewFill: "#e7edf3",
    geneLine: "#8e9fb2",
    focusStroke: "#5b83aa",
    hoverStroke: "#31475f",
    fontFamily: "\"Segoe UI\", Helvetica, Arial, sans-serif",
};

const DEFAULT_MARGIN = { top: 90, right: 300, bottom: 90, left: 90 };

interface VariantTrackLayout {
    scaleY: number;
    scaleHeight: number;
    variantsBaseY: number;
    guideTopY: number;
    guideBottomY: number;
    overviewBandY: number;
    overviewBandHeight: number;
    geneY: number;
    geneLabelX: number;
    geneLabelDy: number;
    traitLegendY: number;
    traitLegendHeight: number;
}

function resolveDimensions(container: HTMLElement, opts: AnnotatedVariantTrackOptions) {
    const parent = container.parentElement || container;
    const width = opts.width || parent.clientWidth || 1200;
    const height = opts.height || width * (opts.aspectRatio || 0.66);
    return { width, height };
}

function buildXScale(
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    domain: [number, number]
) {
    return d3.scaleLinear().domain(domain).range([margin.left, width - margin.right]);
}

function createDefaultScaleTicks(domain: [number, number]): VariantTrackTick[] {
    const scale = d3.scaleLinear().domain(domain);
    return scale.ticks(6).map((value) => ({
        value,
        label: `${(value / 1_000_000).toFixed(2)}Mb`,
    }));
}

function resolveLayout(
    height: number,
    margin: { top: number; right: number; bottom: number; left: number },
    opts: AnnotatedVariantTrackOptions
): VariantTrackLayout {
    const contentHeight = height - margin.top - margin.bottom;
    const scaleY = opts.scaleBand?.y ?? margin.top;
    const scaleHeight = opts.scaleBand?.height ?? 24;
    const variantsBaseY = opts.variants.baseY ?? margin.top + contentHeight * 0.34;
    const guideTopY = opts.variants.guideRegion?.topY ?? scaleY + scaleHeight + 11;
    const guideBottomY = opts.variants.guideRegion?.bottomY ?? variantsBaseY + 12;
    const geneY = opts.genes[0]?.y ?? variantsBaseY + 115;
    const traitLegendY = opts.traitLegend.y ?? geneY + 110;

    return {
        scaleY,
        scaleHeight,
        variantsBaseY,
        guideTopY,
        guideBottomY,
        overviewBandY: variantsBaseY + 20,
        overviewBandHeight: 14,
        geneY,
        geneLabelX: opts.genes[0]?.labelX ?? margin.left + 86,
        geneLabelDy: opts.genes[0]?.labelDy ?? 16,
        traitLegendY,
        traitLegendHeight: opts.traitLegend.height ?? 22,
    };
}

function drawBackground(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number,
    theme: Required<AnnotatedVariantTrackTheme>
) {
    const defs = svg.append("defs");
    const gradient = defs
        .append("radialGradient")
        .attr("id", "variant-track-panel-gradient")
        .attr("cx", "32%")
        .attr("cy", "18%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", theme.panelGradientStart);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", theme.panelGradientEnd);

    svg.append("rect").attr("width", width).attr("height", height).attr("fill", theme.backgroundFill);
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "url(#variant-track-panel-gradient)");
}

function drawScaleBand(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    scaleBand: NonNullable<AnnotatedVariantTrackOptions["scaleBand"]>,
    layout: VariantTrackLayout,
    theme: Required<AnnotatedVariantTrackTheme>
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const group = svg.append("g");

    group.append("line")
        .attr("x1", chartLeft)
        .attr("x2", chartRight)
        .attr("y1", layout.scaleY)
        .attr("y2", layout.scaleY)
        .attr("stroke", theme.scaleStroke)
        .attr("stroke-width", 4);

    group.append("rect")
        .attr("x", chartLeft)
        .attr("y", layout.scaleY + 8)
        .attr("width", chartRight - chartLeft)
        .attr("height", layout.scaleHeight)
        .attr("fill", theme.scaleFill);

    if (scaleBand.highlightedRegion) {
        const region = scaleBand.highlightedRegion;
        const x0 = x(region.start);
        const x1 = x(region.end);
        group.append("rect")
            .attr("x", x0)
            .attr("y", layout.scaleY - 4)
            .attr("width", Math.max(0, x1 - x0))
            .attr("height", 16)
            .attr("fill", region.fill || theme.zoomFill)
            .attr("rx", 1);

        if (region.label) {
            group.append("text")
                .attr("x", (x0 + x1) / 2)
                .attr("y", layout.scaleY + 8)
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .style("font-weight", 700)
                .style("fill", region.textColor || "#ffffff")
                .text(region.label);
        }
    }

    group.selectAll(".variant-track-scale-tick")
        .data(scaleBand.ticks)
        .join("line")
        .attr("x1", (d) => x(d.value))
        .attr("x2", (d) => x(d.value))
        .attr("y1", layout.scaleY + 1)
        .attr("y2", layout.scaleY + 12)
        .attr("stroke", theme.textColor)
        .attr("stroke-width", 1);

    group.selectAll(".variant-track-scale-label")
        .data(scaleBand.ticks)
        .join("text")
        .attr("x", (d) => x(d.value))
        .attr("y", layout.scaleY + layout.scaleHeight + 22)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", theme.mutedTextColor)
        .text((d) => d.label);
}

function drawVariants(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    variants: AnnotatedVariantTrackOptions["variants"],
    layout: VariantTrackLayout,
    theme: Required<AnnotatedVariantTrackTheme>
) {
    const group = svg.append("g");
    const maxValue = variants.maxValue || d3.max(variants.items, (d) => d.value) || 1;
    const heightScale = d3.scaleLinear().domain([0, maxValue]).range([8, 78]);

    if (variants.guideRegion) {
        group.append("line")
            .attr("x1", x(variants.guideRegion.start))
            .attr("x2", x(variants.guideRegion.start))
            .attr("y1", layout.guideTopY)
            .attr("y2", layout.guideBottomY)
            .attr("stroke", theme.guideColor)
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4 3");

        group.append("line")
            .attr("x1", x(variants.guideRegion.end))
            .attr("x2", x(variants.guideRegion.end))
            .attr("y1", layout.guideTopY)
            .attr("y2", layout.guideBottomY)
            .attr("stroke", theme.guideColor)
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4 3");
    }

    group.selectAll(".variant-track-stem")
        .data(variants.items)
        .join("line")
        .attr("class", "variant-track-stem")
        .attr("data-group", (d) => d.group || null)
        .attr("x1", (d) => x(d.position))
        .attr("x2", (d) => x(d.position))
        .attr("y1", layout.variantsBaseY)
        .attr("y2", (d) => layout.variantsBaseY - heightScale(d.value))
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", (d) => d.strokeWidth || 2.25)
        .attr("stroke-linecap", "round");

    group.selectAll(".variant-track-dot")
        .data(variants.items)
        .join("circle")
        .attr("class", "variant-track-dot")
        .attr("data-group", (d) => d.group || null)
        .attr("cx", (d) => x(d.position))
        .attr("cy", (d) => layout.variantsBaseY - heightScale(d.value))
        .attr("r", (d) => d.radius || 5)
        .attr("fill", (d) => d.color);
}

function drawOverviewTrack(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    overviewTrack: VariantTrackOverview,
    layout: VariantTrackLayout,
    theme: Required<AnnotatedVariantTrackTheme>
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const group = svg.append("g");

    group.append("line")
        .attr("x1", chartLeft)
        .attr("x2", chartRight)
        .attr("y1", overviewTrack.y ?? layout.variantsBaseY)
        .attr("y2", overviewTrack.y ?? layout.variantsBaseY)
        .attr("stroke", overviewTrack.baselineStroke || theme.overviewLine)
        .attr("stroke-width", overviewTrack.baselineHeight || 12);

    group.selectAll(".variant-track-overview-segment")
        .data(overviewTrack.segments)
        .join("rect")
        .attr("x", (d) => x(d.start))
        .attr("y", (d) => (overviewTrack.y ?? layout.variantsBaseY) - (d.height || 16) / 2)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", (d) => d.height || 16)
        .attr("fill", (d) => d.fill)
        .attr("stroke", (d) => d.stroke || "none")
        .attr("stroke-width", (d) => d.strokeWidth || 0);

    const backgroundBands =
        overviewTrack.backgroundBands && overviewTrack.backgroundBands.length > 0
            ? overviewTrack.backgroundBands
            : [
                  { start: 0, end: 0, fill: theme.overviewFill },
                  { start: 0, end: 0, fill: theme.overviewFill },
                  { start: 0, end: 0, fill: theme.overviewFill },
              ];

    group.selectAll(".variant-track-background-band")
        .data(backgroundBands)
        .join("rect")
        .attr("x", (d) => x(d.start))
        .attr("y", (d, index) => d.y ?? layout.overviewBandY)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", (d) => d.height ?? layout.overviewBandHeight)
        .attr("fill", (d) => d.fill || theme.overviewFill);
}

function drawGenes(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    genes: VariantTrackGene[],
    layout: VariantTrackLayout,
    theme: Required<AnnotatedVariantTrackTheme>
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;

    const geneGroups = svg.selectAll(".variant-track-gene-row").data(genes).join("g").attr("class", "variant-track-gene-row");

    geneGroups.each(function (gene, index) {
        const row = d3.select(this);
        const geneY = gene.y ?? layout.geneY + index * 88;

        if (gene.rowBackground) {
            row.append("rect")
                .attr("x", chartLeft)
                .attr("y", geneY - gene.rowBackground.height / 2)
                .attr("width", chartRight - chartLeft)
                .attr("height", gene.rowBackground.height)
                .attr("fill", gene.rowBackground.fill)
                .attr("stroke", gene.rowBackground.stroke || "none");
        }

        row.selectAll(".variant-track-intron")
            .data(gene.introns)
            .join("line")
            .attr("x1", (d) => x(d.start))
            .attr("x2", (d) => x(d.end))
            .attr("y1", geneY)
            .attr("y2", geneY)
            .attr("stroke", (d) => d.stroke || theme.geneLine)
            .attr("stroke-width", (d) => d.strokeWidth || 4);

        row.selectAll(".variant-track-exon")
            .data(gene.exons)
            .join("rect")
            .attr("x", (d) => x(d.start))
            .attr("y", (d) => geneY - (d.height || gene.exonHeight || 20) / 2)
            .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
            .attr("height", (d) => d.height || gene.exonHeight || 20)
            .attr("fill", (d) => d.fill)
            .attr("stroke", (d) => d.stroke || "none")
            .attr("stroke-width", (d) => d.strokeWidth || 0);

        row.append("text")
            .attr("x", gene.labelX || layout.geneLabelX)
            .attr("y", geneY - (gene.labelDy || layout.geneLabelDy))
            .style("font-size", "18px")
            .style("font-weight", 700)
            .style("fill", theme.textColor)
            .text(gene.label);

        if (gene.separatorY !== undefined) {
            row.append("line")
                .attr("x1", chartLeft)
                .attr("x2", chartRight)
                .attr("y1", gene.separatorY)
                .attr("y2", gene.separatorY)
                .attr("stroke", gene.separatorStroke || theme.guideColor)
                .attr("stroke-width", 1);
        }
    });
}

function drawTraitLegend(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    legend: VariantTrackLegend,
    layout: VariantTrackLayout,
    theme: Required<AnnotatedVariantTrackTheme>,
    rootSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const group = svg.append("g");

    if (legend.rowBackground) {
        group.append("rect")
            .attr("x", chartLeft)
            .attr("y", (legend.y ?? layout.traitLegendY) - legend.rowBackground.height / 2)
            .attr("width", chartRight - chartLeft)
            .attr("height", legend.rowBackground.height)
            .attr("fill", legend.rowBackground.fill)
            .attr("stroke", legend.rowBackground.stroke || "none");
    }

    group.selectAll(".variant-track-legend-block")
        .data(legend.blocks)
        .join("rect")
        .attr("class", "variant-track-legend-block")
        .attr("data-group", (d) => d.group || null)
        .attr("x", (d) => x(d.start))
        .attr("y", (legend.y ?? layout.traitLegendY) - (legend.height ?? layout.traitLegendHeight) / 2)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", legend.height ?? layout.traitLegendHeight)
        .attr("fill", (d) => d.fill)
        .attr("stroke", (d) => d.stroke || "#ffffff")
        .attr("stroke-width", (d) => d.strokeWidth || 1.5);

    group.selectAll<SVGRectElement, VariantTrackLegendBlock>(".variant-track-legend-block")
        .on("mouseenter", function (event, datum) {
            const groupKey = datum.group;
            if (!groupKey) return;

            rootSvg.selectAll<SVGCircleElement, VariantTrackVariant>(".variant-track-dot")
                .attr("opacity", (d) => (d.group === groupKey ? 1 : 0.22))
                .attr("stroke", (d) => (d.group === groupKey ? theme.hoverStroke : "none"))
                .attr("stroke-width", (d) => (d.group === groupKey ? 1.5 : 0));

            rootSvg.selectAll<SVGLineElement, VariantTrackVariant>(".variant-track-stem")
                .attr("opacity", (d) => (d.group === groupKey ? 1 : 0.18));

            d3.select(this)
                .attr("stroke", theme.hoverStroke)
                .attr("stroke-width", 2);

            tooltip
                .style("display", "block")
                .text(datum.label || datum.group || "")
                .style("left", `${event.offsetX + 14}px`)
                .style("top", `${event.offsetY - 30}px`);
        })
        .on("mousemove", function (event, datum) {
            tooltip
                .style("display", "block")
                .text(datum.label || datum.group || "")
                .style("left", `${event.offsetX + 14}px`)
                .style("top", `${event.offsetY - 30}px`);
        })
        .on("mouseleave", function () {
            rootSvg.selectAll<SVGCircleElement, VariantTrackVariant>(".variant-track-dot")
                .attr("opacity", 1)
                .attr("stroke", "none")
                .attr("stroke-width", 0);

            rootSvg.selectAll<SVGLineElement, VariantTrackVariant>(".variant-track-stem")
                .attr("opacity", 1);

            d3.select<SVGRectElement, VariantTrackLegendBlock>(this)
                .attr("stroke", (d) => d.stroke || "#ffffff")
                .attr("stroke-width", (d) => d.strokeWidth || 1.5);

            tooltip.style("display", "none");
        });

    if (legend.highlightedRegion) {
        const region = legend.highlightedRegion;
        group.append("rect")
            .attr("x", x(region.start))
            .attr("y", (legend.y ?? layout.traitLegendY) - (legend.height ?? layout.traitLegendHeight) / 2)
            .attr("width", Math.max(0, x(region.end) - x(region.start)))
            .attr("height", legend.height ?? layout.traitLegendHeight)
            .attr("fill", "none")
            .attr("stroke", region.stroke || theme.focusStroke)
            .attr("stroke-width", region.strokeWidth || 2);
    }
}

function drawAnnotations(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    annotations: VariantTrackAnnotation[],
    theme: Required<AnnotatedVariantTrackTheme>
) {
    const annotationGroups = svg.selectAll(".variant-track-annotation").data(annotations).join("g");

    annotationGroups.each(function (annotation) {
        const group = d3.select(this).attr("transform", `translate(${annotation.x},${annotation.y})`);
        const dx = annotation.dx || 0;
        const dy = annotation.dy || 0;
        const textX = dx + (annotation.align === "left" ? -14 : 14);
        const anchor = annotation.align === "left" ? "end" : "start";
        const titleLineCount = annotation.titleLineCount || 1;

        if (annotation.showDot !== false) {
            group.append("circle").attr("r", 3.5).attr("fill", theme.textColor);
        }

        if (dx !== 0 || dy !== 0) {
            group.append("line")
                .attr("x1", 0)
                .attr("x2", dx)
                .attr("y1", 0)
                .attr("y2", dy)
                .attr("stroke", theme.connectorColor)
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", "5 5");
        }

        annotation.lines.forEach((line, index) => {
            group.append("text")
                .attr("x", textX)
                .attr("y", dy + index * 28)
                .attr("text-anchor", anchor)
                .attr("dominant-baseline", "middle")
                .style("font-size", index < titleLineCount ? "18px" : "16px")
                .style("font-weight", index < titleLineCount ? 700 : 400)
                .style("fill", theme.textColor)
                .text(line);
        });
    });
}

export function annotatedVariantTrack(container: HTMLElement, opts: AnnotatedVariantTrackOptions) {
    const margin = opts.margin || DEFAULT_MARGIN;
    const theme = { ...DEFAULT_THEME, ...opts.theme };
    const { width, height } = resolveDimensions(container, opts);
    const scaleBand = opts.scaleBand || { ticks: createDefaultScaleTicks(opts.domain) };
    const overviewTrack = {
        ...opts.overviewTrack,
        backgroundBands:
            opts.overviewTrack.backgroundBands && opts.overviewTrack.backgroundBands.length > 0
                ? opts.overviewTrack.backgroundBands
                : [
                      {
                          start: opts.domain[0],
                          end: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.33,
                          fill: theme.overviewFill,
                      },
                      {
                          start: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.34,
                          end: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.66,
                          fill: "#dfe7ef",
                      },
                      {
                          start: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.67,
                          end: opts.domain[1],
                          fill: theme.overviewFill,
                      },
                  ],
    };
    const traitLegend = {
        ...opts.traitLegend,
        rowBackground: opts.traitLegend.rowBackground || {
            height: 58,
            fill: "rgba(255,255,255,0.34)",
            stroke: "#d8e1eb",
        },
    };
    const genes = opts.genes.map((gene) => ({
        ...gene,
        rowBackground: gene.rowBackground || {
            height: 48,
            fill: "rgba(255,255,255,0.28)",
        },
    }));

    d3.select(container).select("svg").remove();
    d3.select(container).select(".annotated-variant-track-tooltip").remove();

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("font-family", theme.fontFamily);

    d3.select(container).style("position", "relative");

    const tooltip = d3
        .select(container)
        .append("div")
        .attr("class", "annotated-variant-track-tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("padding", "6px 10px")
        .style("border-radius", "8px")
        .style("background", "rgba(255,255,255,0.96)")
        .style("border", "1px solid #cfd8e3")
        .style("box-shadow", "0 8px 20px rgba(45, 62, 80, 0.16)")
        .style("color", theme.textColor)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("white-space", "nowrap")
        .style("z-index", "1");

    drawBackground(svg, width, height, theme);

    const x = buildXScale(width, margin, opts.domain);
    const layout = resolveLayout(height, margin, {
        ...opts,
        scaleBand,
        overviewTrack,
        traitLegend,
        genes,
    });

    drawScaleBand(svg, x, width, margin, scaleBand, layout, theme);
    drawVariants(svg, x, opts.variants, layout, theme);
    drawOverviewTrack(svg, x, width, margin, overviewTrack, layout, theme);
    drawGenes(svg, x, width, margin, genes, layout, theme);
    drawTraitLegend(svg, x, width, margin, traitLegend, layout, theme, svg, tooltip);
    drawAnnotations(svg, opts.annotations || [], theme);
}
