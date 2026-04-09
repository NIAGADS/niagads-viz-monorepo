import * as d3 from "d3";
import { DisplayProps } from "./types";

const THEME = {
    backgroundFill: "#f3f6fa",
    panelGradientStart: "#ffffff",
    panelGradientEnd: "#eef3f8",
    textColor: "#4f627a",
    mutedTextColor: "#7e90a8",
    connectorColor: "#b7c5d6",
    scaleFill: "#d7e5f3",
    scaleStroke: "#2f6f9f",
    overviewLine: "#7d90a4",
    overviewFill: "#e7edf3",
    overviewFillAlt: "#dfe7ef",
    geneLine: "#8e9fb2",
    geneRowBackground: "rgba(255,255,255,0.28)",
    focusStroke: "#5b83aa",
    hoverStroke: "#31475f",
    traitLegendRowBackground: "rgba(255,255,255,0.34)",
    traitLegendRowBorder: "#d8e1eb",
    fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif',
};

const DEFAULT_MARGIN = { top: 90, right: 90, bottom: 90, left: 90 };

interface Range {
    start: number;
    end: number;
}

/**
 * Base interface for positioned and styled elements with start/end coordinates
 */
interface TrackBaseElement extends Range {
    stroke: string;
    strokeWidth: number;
}

interface RegionTrack extends TrackBaseElement {}

interface VariantAnnotation {
    id: string;
    position: number;
    value: number;
    trait: string;
}

interface VariantTrack extends VariantAnnotation {
    color: string;
    radius: number;
    strokeWidth: number;
}

interface BackgroundBand extends TrackBaseElement {
    height: number;
    fill: string;
}

interface IntronTrack extends TrackBaseElement {}

interface ExonTrack extends TrackBaseElement {
    fill: string;
    height: number;
}

interface TrackTick {
    value: number;
    label: string;
}

interface TraitLegendBlock extends TrackBaseElement {
    fill: string;
    label?: string;
    group: string;
}

interface AnnotationTrack {
    position: number;
    align: "left" | "right";
    lines: string[];
    titleLineCount: number;
    showDot: boolean;
}

interface Feature extends Range {}

export interface GeneVariantPValuePlotOptions {
    displayOpts: DisplayProps;
    domain: [number, number];
    variants: VariantAnnotation[];
    gene: {
        label: string;
        introns: Feature[];
        exons: Feature[];
        start: number;
        end: number;
    };
}

interface Layout {
    scaleY: number;
    scaleHeight: number;
    variantMinStemHeight: number;
    variantMaxStemHeight: number;
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

interface PositionedTraitLegendBlock extends TraitLegendBlock {
    index: number;
}

function resolveDimensions(container: HTMLElement, displayOpts: DisplayProps) {
    const parent = container.parentElement || container;
    const width = displayOpts.width || parent.clientWidth || 1200;
    const height = displayOpts.height || width * (displayOpts.aspectRatio || 0.66);
    return { width, height };
}

function buildXScale(
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    domain: [number, number]
) {
    return d3
        .scaleLinear()
        .domain(domain)
        .range([margin.left, width - margin.right]);
}

function createDefaultScaleTicks(domain: [number, number], pixelWidth: number = 1200): TrackTick[] {
    // Generate ticks based on available pixel width for better spacing
    const tickCount = Math.max(4, Math.floor(pixelWidth / 200)); // ~1 tick per 200px
    const scale = d3.scaleLinear().domain(domain).range([0, pixelWidth]);
    return scale.ticks(tickCount).map((value) => ({
        value,
        label: `${(value / 1_000_000).toFixed(2)}Mb`,
    }));
}

function resolveLayout(height: number, displayOpts: DisplayProps): Layout {
    const margin = displayOpts.margin || DEFAULT_MARGIN;
    const contentHeight = height - margin.top - margin.bottom;
    const scaleY = margin.top;
    const scaleHeight = 12;
    const variantMinStemHeight = 8;
    const variantMaxStemHeight = Math.max(56, Math.min(96, contentHeight * 0.22));
    const minTopClearance = 38;
    const variantsBaseY = Math.max(
        margin.top + contentHeight * 0.28,
        scaleY + scaleHeight + minTopClearance + variantMaxStemHeight
    );
    const guideTopY = scaleY + scaleHeight + 10;
    const guideBottomY = variantsBaseY + 10;
    const overviewBandY = variantsBaseY + 16;
    const traitLegendY = scaleY - 18;
    const geneY = variantsBaseY + 34;

    return {
        scaleY,
        scaleHeight,
        variantMinStemHeight,
        variantMaxStemHeight,
        variantsBaseY,
        guideTopY,
        guideBottomY,
        overviewBandY,
        overviewBandHeight: 14,
        geneY,
        geneLabelX: margin.left + 86,
        geneLabelDy: 16,
        traitLegendY,
        traitLegendHeight: 12,
    };
}

function drawBackground(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) {
    return;
}

function drawScaleBand(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    ticks: TrackTick[],
    layout: Layout,
    highlightedRegion?: {
        start: number;
        end: number;
        label: string;
    }
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const group = svg.append("g");

    group
        .append("line")
        .attr("x1", chartLeft)
        .attr("x2", chartRight)
        .attr("y1", layout.scaleY)
        .attr("y2", layout.scaleY)
        .attr("stroke", THEME.scaleStroke)
        .attr("stroke-width", 4);

    group
        .append("rect")
        .attr("x", chartLeft)
        .attr("y", layout.scaleY + 8)
        .attr("width", chartRight - chartLeft)
        .attr("height", layout.scaleHeight)
        .attr("fill", THEME.scaleFill);

    group
        .selectAll(".variant-track-scale-tick")
        .data(ticks)
        .join("line")
        .attr("x1", (d) => x(d.value))
        .attr("x2", (d) => x(d.value))
        .attr("y1", layout.scaleY + 1)
        .attr("y2", layout.scaleY + 12)
        .attr("stroke", THEME.textColor)
        .attr("stroke-width", 1);

    group
        .selectAll(".variant-track-scale-label")
        .data(ticks)
        .join("text")
        .attr("x", (d) => x(d.value))
        .attr("y", layout.scaleY + layout.scaleHeight + 22)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", THEME.mutedTextColor)
        .text((d) => d.label);

    if (highlightedRegion) {
        const regionStart = Math.max(highlightedRegion.start, x.domain()[0]);
        const regionEnd = Math.min(highlightedRegion.end, x.domain()[1]);
        const regionWidth = Math.max(36, x(regionEnd) - x(regionStart));
        const regionX = x(regionStart);

        group
            .append("rect")
            .attr("x", regionX)
            .attr("y", layout.scaleY - 3)
            .attr("width", regionWidth)
            .attr("height", 18)
            .attr("rx", 2)
            .attr("fill", "#68b6e8")
            .attr("stroke", "#5d86ad")
            .attr("stroke-width", 1);

        group
            .append("text")
            .attr("x", regionX + regionWidth / 2)
            .attr("y", layout.scaleY + 6)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "11px")
            .style("font-weight", 700)
            .style("fill", "#ffffff")
            .text(highlightedRegion.label);
    }
}

function drawVariants(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    annotations: VariantAnnotation[],
    colorByTrait: Map<string, string>,
    layout: Layout,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
    const group = svg.append("g");
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const genomeWideSignificanceThreshold = 7.30103;

    // Calculate maxValue from annotation values
    const maxValue = d3.max(annotations, (d) => d.value) || 1;
    const heightScale = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([layout.variantMinStemHeight, layout.variantMaxStemHeight]);

    if (genomeWideSignificanceThreshold <= maxValue) {
        const thresholdY = layout.variantsBaseY - heightScale(genomeWideSignificanceThreshold);
        group
            .append("line")
            .attr("x1", chartLeft)
            .attr("x2", chartRight)
            .attr("y1", thresholdY)
            .attr("y2", thresholdY)
            .attr("stroke", "#c7cdd6")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "6 6");

        group
            .append("text")
            .attr("x", margin.left + 12)
            .attr("y", thresholdY - 10)
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", THEME.mutedTextColor)
            .text("p = 5e⁻⁸");
    }

    // Transform annotations to styled tracks
    const variants: VariantTrack[] = annotations.map((annotation) => ({
        ...annotation,
        color: colorByTrait.get(annotation.trait) || "#2f6f9f",
        radius: 4,
        strokeWidth: 1.5,
    }));

    const showTooltip = (event: MouseEvent, datum: VariantTrack) => {
        const pValueText = Number.isFinite(datum.value)
            ? datum.value > 50
                ? "p-value < 1e-50"
                : `p-value = ${(10 ** -datum.value).toExponential(2)}`
            : String(datum.value);
        tooltip
            .style("display", "block")
            .html(
                `Trait: <span style="color:${datum.color}">${datum.trait}</span><br />${pValueText}<br />Variant: ${datum.id}`
            )
            .style("left", `${event.offsetX + 14}px`)
            .style("top", `${event.offsetY - 34}px`);
    };

    const hideTooltip = () => {
        tooltip.style("display", "none");
    };

    group
        .selectAll(".variant-track-stem")
        .data(variants)
        .join("line")
        .attr("class", "variant-track-stem")
        .attr("data-group", (d) => d.trait)
        .attr("x1", (d) => x(d.position))
        .attr("x2", (d) => x(d.position))
        .attr("y1", layout.variantsBaseY)
        .attr("y2", (d) => layout.variantsBaseY - heightScale(d.value))
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", (d) => d.strokeWidth)
        .attr("stroke-linecap", "round")
        .on("mouseenter", function (event, datum) {
            d3.select(this).attr("stroke-width", datum.strokeWidth + 1);
            showTooltip(event, datum);
        })
        .on("mousemove", function (event, datum) {
            showTooltip(event, datum);
        })
        .on("mouseleave", function (_event, datum) {
            d3.select(this).attr("stroke-width", datum.strokeWidth);
            hideTooltip();
        });

    group
        .selectAll(".variant-track-dot")
        .data(variants)
        .join("circle")
        .attr("class", "variant-track-dot")
        .attr("data-group", (d) => d.trait)
        .attr("cx", (d) => x(d.position))
        .attr("cy", (d) => layout.variantsBaseY - heightScale(d.value))
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => d.color)
        .on("mouseenter", function (event, datum) {
            d3.select(this).attr("r", datum.radius + 1.5);
            showTooltip(event, datum);
        })
        .on("mousemove", function (event, datum) {
            showTooltip(event, datum);
        })
        .on("mouseleave", function (_event, datum) {
            d3.select(this).attr("r", datum.radius);
            hideTooltip();
        });
}

function drawGenes(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    gene: {
        label: string;
        introns: Feature[];
        exons: Feature[];
    },
    layout: Layout
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const geneY = layout.geneY;

    // Draw row background
    const group = svg.append("g");
    group
        .append("rect")
        .attr("x", chartLeft)
        .attr("y", geneY - 14)
        .attr("width", chartRight - chartLeft)
        .attr("height", 28)
        .attr("fill", THEME.geneRowBackground);

    // Draw introns
    group
        .selectAll(".variant-track-intron")
        .data(gene.introns)
        .join("line")
        .attr("x1", (d) => x(d.start))
        .attr("x2", (d) => x(d.end))
        .attr("y1", geneY)
        .attr("y2", geneY)
        .attr("stroke", THEME.geneLine)
        .attr("stroke-width", 3);

    // Draw exons
    group
        .selectAll(".variant-track-exon")
        .data(gene.exons)
        .join("rect")
        .attr("x", (d) => x(d.start))
        .attr("y", geneY - 10)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", 20)
        .attr("fill", "#4c89bb")
        .attr("stroke", "#4c89bb")
        .attr("stroke-width", 1);

    group
        .append("text")
        .attr("x", margin.left + 12)
        .attr("y", geneY)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .style("font-size", "14px")
        .style("font-weight", 700)
        .style("fill", THEME.textColor)
        .text(gene.label);

    group
        .append("line")
        .attr("x1", chartLeft)
        .attr("x2", chartRight)
        .attr("y1", geneY + 22)
        .attr("y2", geneY + 22)
        .attr("stroke", THEME.connectorColor)
        .attr("stroke-width", 1.5);

}

function drawOverviewTrack(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    layout: Layout
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const group = svg.append("g");

    group
        .append("line")
        .attr("x1", chartLeft)
        .attr("x2", chartRight)
        .attr("y1", layout.variantsBaseY)
        .attr("y2", layout.variantsBaseY)
        .attr("stroke", THEME.overviewLine)
        .attr("stroke-width", 3);
}

function drawTraitLegend(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    legend: {
        blocks: TraitLegendBlock[];
        highlightedRegion?: RegionTrack;
        rowBackground?: { height: number; fill: string; stroke?: string };
    },
    layout: Layout,
    rootSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const group = svg.append("g");
    const legendLineLeft = margin.left + 84;
    const legendLineRight = chartRight - 8;
    const legendPadding = 20;
    const blockGap = 0;
    const blockAreaLeft = legendLineLeft + legendPadding;
    const blockAreaRight = legendLineRight - legendPadding;
    const usableBlockWidth = Math.max(
        0,
        blockAreaRight - blockAreaLeft - blockGap * Math.max(legend.blocks.length - 1, 0)
    );
    const legendBlocks: PositionedTraitLegendBlock[] = legend.blocks.map((block, index) => ({ ...block, index }));
    const blockWidth = Math.min(64, Math.max(10, usableBlockWidth / Math.max(legendBlocks.length, 1)));

    group
        .append("line")
        .attr("x1", legendLineLeft)
        .attr("x2", legendLineRight)
        .attr("y1", layout.traitLegendY)
        .attr("y2", layout.traitLegendY)
        .attr("stroke", THEME.overviewLine)
        .attr("stroke-width", 2.5);

    group
        .append("text")
        .attr("x", margin.left + 12)
        .attr("y", layout.traitLegendY)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .style("font-size", "14px")
        .style("font-weight", 700)
        .style("fill", THEME.textColor)
        .text("Traits");

    group
        .selectAll(".variant-track-legend-block")
        .data(legendBlocks)
        .join("rect")
        .attr("class", "variant-track-legend-block")
        .attr("data-group", (d) => d.group)
        .attr("x", (d) => blockAreaLeft + d.index * (blockWidth + blockGap))
        .attr("y", layout.traitLegendY - layout.traitLegendHeight / 2)
        .attr("width", blockWidth)
        .attr("height", layout.traitLegendHeight)
        .attr("fill", (d) => d.fill)
        .attr("stroke", (d) => d.stroke)
        .attr("stroke-width", (d) => d.strokeWidth);

    group
        .selectAll<SVGRectElement, PositionedTraitLegendBlock>(".variant-track-legend-block")
        .on("mouseenter", function (event, datum) {
            const traitKey = datum.group;
            if (!traitKey) return;

            rootSvg
                .selectAll<SVGCircleElement, VariantTrack>(".variant-track-dot")
                .attr("opacity", (d) => (d.trait === traitKey ? 1 : 0.22))
                .attr("stroke", "none")
                .attr("stroke-width", 0);

            rootSvg
                .selectAll<SVGLineElement, VariantTrack>(".variant-track-stem")
                .attr("opacity", (d) => (d.trait === traitKey ? 1 : 0.18));

            d3.select(this)
                .attr("opacity", 1)
                .attr("fill", d3.color(datum.fill)?.brighter(0.5).formatHex() || datum.fill)
                .attr("stroke", THEME.hoverStroke)
                .attr("stroke-width", 2.5);

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
            rootSvg
                .selectAll<SVGCircleElement, VariantTrack>(".variant-track-dot")
                .attr("opacity", 1)
                .attr("stroke", "none")
                .attr("stroke-width", 0);

            rootSvg.selectAll<SVGLineElement, VariantTrack>(".variant-track-stem").attr("opacity", 1);

            d3.select<SVGRectElement, TraitLegendBlock>(this)
                .attr("opacity", 1)
                .attr("fill", (d) => d.fill)
                .attr("stroke", (d) => d.stroke)
                .attr("stroke-width", (d) => d.strokeWidth);

            tooltip.style("display", "none");
        });

    if (legend.highlightedRegion) {
        const region = legend.highlightedRegion;
        group
            .append("rect")
            .attr("x", x(region.start))
            .attr("y", layout.traitLegendY - layout.traitLegendHeight / 2)
            .attr("width", Math.max(0, x(region.end) - x(region.start)))
            .attr("height", layout.traitLegendHeight)
            .attr("fill", "none")
            .attr("stroke", region.stroke || THEME.focusStroke)
            .attr("stroke-width", region.strokeWidth || 2);
    }
}

function drawAnnotations(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    annotations: AnnotationTrack[],
    x: d3.ScaleLinear<number, number>,
    layout: Layout
) {
    const annotationGroups = svg.selectAll(".variant-track-annotation").data(annotations).join("g");

    annotationGroups.each(function (annotation) {
        const xPos = x(annotation.position);
        const yPos = layout.variantsBaseY - 60; // Fixed offset above variants
        const group = d3.select(this).attr("transform", `translate(${xPos},${yPos})`);
        const dx = 0;
        const dy = -30;
        const textX = dx + (annotation.align === "left" ? -14 : 14);
        const anchor = annotation.align === "left" ? "end" : "start";
        const titleLineCount = annotation.titleLineCount;

        if (annotation.showDot) {
            group.append("circle").attr("r", 3.5).attr("fill", THEME.textColor);
        }

        group
            .append("line")
            .attr("x1", 0)
            .attr("x2", dx)
            .attr("y1", 0)
            .attr("y2", dy)
            .attr("stroke", THEME.connectorColor)
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "5 5");

        annotation.lines.forEach((line, index) => {
            group
                .append("text")
                .attr("x", textX)
                .attr("y", dy + index * 28)
                .attr("text-anchor", anchor)
                .attr("dominant-baseline", "middle")
                .style("font-size", index < titleLineCount ? "18px" : "16px")
                .style("font-weight", index < titleLineCount ? 700 : 400)
                .style("fill", THEME.textColor)
                .text(line);
        });
    });
}

function generateAnnotationTracks(variants: VariantAnnotation[]): AnnotationTrack[] {
    // Convert variant annotations to annotation tracks
    // Each variant becomes an annotation with its trait and value info
    return variants.map((variant) => ({
        position: variant.position,
        align: Math.random() > 0.5 ? "left" : "right", // Alternate alignment to avoid overlap
        lines: [variant.trait, `p=${variant.value.toExponential(2)}`],
        titleLineCount: 1,
        showDot: true,
    }));
}

function generateTraitLegend(
    variants: VariantAnnotation[],
    domain: [number, number]
): {
    blocks: TraitLegendBlock[];
    colorByTrait: Map<string, string>;
} {
    // Extract unique traits from variants
    const uniqueTraits = Array.from(new Set(variants.map((v) => v.trait))).sort();

    // Create d3 color scale
    const colorScale = d3.scaleOrdinal<string, string>().domain(uniqueTraits).range(d3.schemeCategory10);

    // Generate legend blocks spanning the domain
    const domainSpan = domain[1] - domain[0] || 1;
    const blockWidth = domainSpan / Math.max(uniqueTraits.length, 1);

    const blocks: TraitLegendBlock[] = uniqueTraits.map((trait, index) => ({
        start: domain[0] + index * blockWidth,
        end: domain[0] + (index + 1) * blockWidth,
        fill: colorScale(trait),
        group: trait,
        stroke: "none",
        strokeWidth: 0,
    }));

    // Build color map for variant coloring
    const colorByTrait = new Map(uniqueTraits.map((trait) => [trait, colorScale(trait)]));

    return { blocks, colorByTrait };
}

export function geneVariantPValuePlot(container: HTMLElement, opts: GeneVariantPValuePlotOptions) {
    const margin = opts.displayOpts?.margin || DEFAULT_MARGIN;
    const { width, height } = resolveDimensions(container, opts.displayOpts);

    // Generate trait legend from variants
    const { blocks: legendBlocks, colorByTrait } = generateTraitLegend(opts.variants, opts.domain);
    const traitLegend = {
        blocks: legendBlocks,
    };

    // Clean up existing SVG and tooltip
    d3.select(container).select("svg").remove();
    d3.select(container).select(".annotated-variant-track-tooltip").remove();

    // Create SVG
    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("font-family", THEME.fontFamily);

    d3.select(container).style("position", "relative");

    // Create tooltip
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
        .style("color", THEME.textColor)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("white-space", "nowrap")
        .style("z-index", "1");

    // Calculate layout
    drawBackground(svg, width, height);
    const x = buildXScale(width, margin, opts.domain);
    const layout = resolveLayout(height, opts.displayOpts);

    // Draw scale band with default ticks
    const scaleBandTicks = createDefaultScaleTicks(opts.domain, width - margin.left - margin.right);
    drawScaleBand(svg, x, width, margin, scaleBandTicks, layout, {
        start: opts.gene.start,
        end: opts.gene.end,
        label: opts.gene.label,
    });

    // Draw all components
    drawVariants(svg, x, width, margin, opts.variants, colorByTrait, layout, tooltip);
    drawOverviewTrack(svg, width, margin, layout);
    drawTraitLegend(svg, x, width, margin, traitLegend, layout, svg, tooltip);
    drawGenes(svg, x, width, margin, opts.gene, layout);
}
