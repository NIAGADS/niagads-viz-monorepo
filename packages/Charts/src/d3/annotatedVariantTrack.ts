import * as d3 from "d3";
import { DisplayProps } from "./types";
import { Range } from "@niagads/common";

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

/**
 * Base interface for positioned and styled elements with start/end coordinates
 */
interface TrackBaseElement extends Range {
    stroke: string;
    strokeWidth: number;
}

interface RegionTrack extends TrackBaseElement {}

interface VariantAnnotation {
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

interface AnnotationPopup {
    position: number;
    align: "left" | "right";
    lines: string[];
    titleLineCount: number;
    showDot: boolean;
}

export interface AnnotatedVariantTrackOptions {
    displayOpts: DisplayProps;
    domain: [number, number];
    variants: VariantAnnotation[];
    gene: {
        label: string;
        introns: IntronTrack[];
        exons: ExonTrack[];
    };
    annotations?: AnnotationPopup[];
}

interface Layout {
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

function createDefaultScaleTicks(domain: [number, number]): TrackTick[] {
    const scale = d3.scaleLinear().domain(domain);
    return scale.ticks(6).map((value) => ({
        value,
        label: `${(value / 1_000_000).toFixed(2)}Mb`,
    }));
}

function resolveLayout(height: number, displayOpts: DisplayProps): Layout {
    const margin = displayOpts.margin || DEFAULT_MARGIN;
    const contentHeight = height - margin.top - margin.bottom;
    const scaleY = margin.top;
    const scaleHeight = 24;
    const variantsBaseY = margin.top + contentHeight * 0.34;
    const guideTopY = scaleY + scaleHeight + 11;
    const guideBottomY = variantsBaseY + 12;
    const geneY = variantsBaseY + 115;
    const traitLegendY = geneY + 110;

    return {
        scaleY,
        scaleHeight,
        variantsBaseY,
        guideTopY,
        guideBottomY,
        overviewBandY: variantsBaseY + 20,
        overviewBandHeight: 14,
        geneY,
        geneLabelX: margin.left + 86,
        geneLabelDy: 16,
        traitLegendY,
        traitLegendHeight: 22,
    };
}

function drawBackground(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) {
    const defs = svg.append("defs");
    const gradient = defs
        .append("radialGradient")
        .attr("id", "variant-track-panel-gradient")
        .attr("cx", "32%")
        .attr("cy", "18%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", THEME.panelGradientStart);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", THEME.panelGradientEnd);

    svg.append("rect").attr("width", width).attr("height", height).attr("fill", THEME.backgroundFill);
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "url(#variant-track-panel-gradient)");
}

function drawScaleBand(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    ticks: TrackTick[],
    layout: Layout
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
}

function drawVariants(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    annotations: VariantAnnotation[],
    colorByTrait: Map<string, string>,
    layout: Layout
) {
    const group = svg.append("g");

    // Calculate maxValue from annotation values
    const maxValue = d3.max(annotations, (d) => d.value) || 1;
    const heightScale = d3.scaleLinear().domain([0, maxValue]).range([8, 78]);

    // Transform annotations to styled tracks
    const variants: VariantTrack[] = annotations.map((annotation) => ({
        ...annotation,
        color: colorByTrait.get(annotation.trait) || "#2f6f9f",
        radius: 4,
        strokeWidth: 1.5,
    }));

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
        .attr("stroke-linecap", "round");

    group
        .selectAll(".variant-track-dot")
        .data(variants)
        .join("circle")
        .attr("class", "variant-track-dot")
        .attr("data-group", (d) => d.trait)
        .attr("cx", (d) => x(d.position))
        .attr("cy", (d) => layout.variantsBaseY - heightScale(d.value))
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => d.color);
}

function drawOverviewTrack(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    backgroundBands: BackgroundBand[],
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
        .attr("stroke-width", 12);

    group.selectAll(".variant-track-overview-segment").data([]).join("rect");

    group
        .selectAll(".variant-track-background-band")
        .data(backgroundBands)
        .join("rect")
        .attr("x", (d) => x(d.start))
        .attr("y", (d) => layout.overviewBandY)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", (d) => d.height)
        .attr("fill", (d) => d.fill || THEME.overviewFill);
}

function drawGenes(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    gene: {
        label: string;
        introns: IntronTrack[];
        exons: ExonTrack[];
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
        .attr("y", geneY - 24)
        .attr("width", chartRight - chartLeft)
        .attr("height", 48)
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
        .attr("stroke", (d) => d.stroke || THEME.geneLine)
        .attr("stroke-width", (d) => d.strokeWidth);

    // Draw exons
    group
        .selectAll(".variant-track-exon")
        .data(gene.exons)
        .join("rect")
        .attr("x", (d) => x(d.start))
        .attr("y", (d) => geneY - (d.height || 20) / 2)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", (d) => d.height || 20)
        .attr("fill", (d) => d.fill)
        .attr("stroke", (d) => d.stroke)
        .attr("stroke-width", (d) => d.strokeWidth);

    // Draw label
    group
        .append("text")
        .attr("x", layout.geneLabelX)
        .attr("y", geneY - layout.geneLabelDy)
        .style("font-size", "18px")
        .style("font-weight", 700)
        .style("fill", THEME.textColor)
        .text(gene.label);
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

    if (legend.rowBackground) {
        group
            .append("rect")
            .attr("x", chartLeft)
            .attr("y", layout.traitLegendY - legend.rowBackground.height / 2)
            .attr("width", chartRight - chartLeft)
            .attr("height", legend.rowBackground.height)
            .attr("fill", legend.rowBackground.fill)
            .attr("stroke", legend.rowBackground.stroke || "none");
    }

    group
        .selectAll(".variant-track-legend-block")
        .data(legend.blocks)
        .join("rect")
        .attr("class", "variant-track-legend-block")
        .attr("data-group", (d) => d.group)
        .attr("x", (d) => x(d.start))
        .attr("y", layout.traitLegendY - layout.traitLegendHeight / 2)
        .attr("width", (d) => Math.max(0, x(d.end) - x(d.start)))
        .attr("height", layout.traitLegendHeight)
        .attr("fill", (d) => d.fill)
        .attr("stroke", (d) => d.stroke)
        .attr("stroke-width", (d) => d.strokeWidth);

    group
        .selectAll<SVGRectElement, TraitLegendBlock>(".variant-track-legend-block")
        .on("mouseenter", function (event, datum) {
            const traitKey = datum.group;
            if (!traitKey) return;

            rootSvg
                .selectAll<SVGCircleElement, VariantTrack>(".variant-track-dot")
                .attr("opacity", (d) => (d.trait === traitKey ? 1 : 0.22))
                .attr("stroke", (d) => (d.trait === traitKey ? THEME.hoverStroke : "none"))
                .attr("stroke-width", (d) => (d.trait === traitKey ? 1.5 : 0));

            rootSvg
                .selectAll<SVGLineElement, VariantTrack>(".variant-track-stem")
                .attr("opacity", (d) => (d.trait === traitKey ? 1 : 0.18));

            d3.select(this).attr("stroke", THEME.hoverStroke).attr("stroke-width", 2);

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
    annotations: AnnotationPopup[],
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
    const colorScale = d3.scaleOrdinal<string, string>()
        .domain(uniqueTraits)
        .range(d3.schemeCategory10);

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

export function annotatedVariantTrack(container: HTMLElement, opts: AnnotatedVariantTrackOptions) {
    const margin = opts.displayOpts?.margin || DEFAULT_MARGIN;
    const { width, height } = resolveDimensions(container, opts.displayOpts);

    // Compute background bands from domain
    const backgroundBands = [
        {
            start: opts.domain[0],
            end: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.33,
            fill: THEME.overviewFill,
            height: 16,
            stroke: "none",
            strokeWidth: 0,
        },
        {
            start: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.34,
            end: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.66,
            fill: THEME.overviewFillAlt,
            height: 16,
            stroke: "none",
            strokeWidth: 0,
        },
        {
            start: opts.domain[0] + (opts.domain[1] - opts.domain[0]) * 0.67,
            end: opts.domain[1],
            fill: THEME.overviewFill,
            height: 16,
            stroke: "none",
            strokeWidth: 0,
        },
    ] as unknown as BackgroundBand[];

    // Generate trait legend from variants
    const { blocks: legendBlocks, colorByTrait } = generateTraitLegend(opts.variants, opts.domain);
    const traitLegend = {
        blocks: legendBlocks,
        rowBackground: {
            height: 58,
            fill: THEME.traitLegendRowBackground,
            stroke: THEME.traitLegendRowBorder,
        },
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
    const scaleBandTicks = createDefaultScaleTicks(opts.domain);
    drawScaleBand(svg, x, width, margin, scaleBandTicks, layout);

    // Draw all components
    drawVariants(svg, x, opts.variants, colorByTrait, layout);
    drawOverviewTrack(svg, x, width, margin, backgroundBands, layout);
    drawGenes(svg, x, width, margin, opts.gene, layout);
    drawTraitLegend(svg, x, width, margin, traitLegend, layout, svg, tooltip);
    drawAnnotations(svg, opts.annotations || [], x, layout);
}
