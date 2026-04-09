import * as d3 from "d3";
import { DisplayProps } from "./types";

const THEME = {
    textColor: "#4f627a",
    mutedTextColor: "#7e90a8",
    connectorColor: "#b7c5d6",
    scaleFill: "#d7e5f3",
    scaleStroke: "#2f6f9f",
    overviewLine: "#7d90a4",
    geneLine: "#8e9fb2",
    geneRowBackground: "rgba(255,255,255,0.28)",
    focusStroke: "#5b83aa",
    hoverStroke: "#31475f",
    fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif',
    neutralVariantFill: "#9aa3ad",
};

const DEFAULT_MARGIN = { top: 90, right: 90, bottom: 90, left: 90 };

interface Range {
    start: number;
    end: number;
}

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
}

interface Feature extends Range {}

interface TrackTick {
    value: number;
    label: string;
}

interface TraitLegendBlock extends TrackBaseElement {
    fill: string;
    label?: string;
    group: string;
}

interface Layout {
    scaleY: number;
    scaleHeight: number;
    variantMinStemHeight: number;
    variantMaxStemHeight: number;
    variantsBaseY: number;
    geneY: number;
    traitLegendY: number;
    traitLegendHeight: number;
}

interface PositionedTraitLegendBlock extends TraitLegendBlock {
    index: number;
}

export interface GeneVariantPValueManhattanPlotOptions {
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
    const tickCount = Math.max(4, Math.floor(pixelWidth / 200));
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
    const traitLegendY = scaleY - 18;
    const geneY = variantsBaseY + 34;

    return {
        scaleY,
        scaleHeight,
        variantMinStemHeight,
        variantMaxStemHeight,
        variantsBaseY,
        geneY,
        traitLegendY,
        traitLegendHeight: 12,
    };
}

function drawBackground(_svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, _width: number, _height: number) {
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

    const variants: VariantTrack[] = annotations.map((annotation) => ({
        ...annotation,
        color: colorByTrait.get(annotation.trait) || "#2f6f9f",
        radius: 2.5,
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
        .selectAll(".variant-track-dot")
        .data(variants)
        .join("circle")
        .attr("class", "variant-track-dot")
        .attr("data-group", (d) => d.trait)
        .attr("cx", (d) => x(d.position))
        .attr("cy", (d) => layout.variantsBaseY - heightScale(d.value))
        .attr("r", (d) => d.radius)
        .attr("fill", THEME.neutralVariantFill)
        .on("mouseenter", function (event, datum) {
            d3.select(this).attr("r", datum.radius + 0.75);
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
    const group = svg.append("g");

    group
        .append("rect")
        .attr("x", chartLeft)
        .attr("y", geneY - 14)
        .attr("width", chartRight - chartLeft)
        .attr("height", 28)
        .attr("fill", THEME.geneRowBackground);

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

    svg
        .append("g")
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
    },
    layout: Layout,
    rootSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
    const chartRight = width - margin.right;
    const group = svg.append("g");
    const legendLineLeft = margin.left + 84;
    const legendLineRight = chartRight - 8;
    const legendPadding = 20;
    const blockAreaLeft = legendLineLeft + legendPadding;
    const blockAreaRight = legendLineRight - legendPadding;
    const usableBlockWidth = Math.max(0, blockAreaRight - blockAreaLeft);
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
        .attr("x", (d) => blockAreaLeft + d.index * blockWidth)
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
                .attr("fill", (d) => (d.trait === traitKey ? d.color : THEME.neutralVariantFill))
                .attr("r", (d) => (d.trait === traitKey ? d.radius + 0.5 : d.radius));

            d3.select(this)
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
                .attr("fill", THEME.neutralVariantFill)
                .attr("r", (d) => d.radius);

            d3.select<SVGRectElement, TraitLegendBlock>(this)
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

function generateTraitLegend(
    variants: VariantAnnotation[],
    domain: [number, number]
): {
    blocks: TraitLegendBlock[];
    colorByTrait: Map<string, string>;
} {
    const uniqueTraits = Array.from(new Set(variants.map((v) => v.trait))).sort();
    const colorScale = d3.scaleOrdinal<string, string>().domain(uniqueTraits).range(d3.schemeCategory10);
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

    const colorByTrait = new Map(uniqueTraits.map((trait) => [trait, colorScale(trait)]));
    return { blocks, colorByTrait };
}

export function geneVariantPValueManhattanPlot(container: HTMLElement, opts: GeneVariantPValueManhattanPlotOptions) {
    const margin = opts.displayOpts?.margin || DEFAULT_MARGIN;
    const { width, height } = resolveDimensions(container, opts.displayOpts);
    const visibleVariants = opts.variants.filter(
        (variant) => variant.position >= opts.domain[0] && variant.position <= opts.domain[1]
    );
    const { blocks: legendBlocks, colorByTrait } = generateTraitLegend(visibleVariants, opts.domain);
    const traitLegend = { blocks: legendBlocks };

    d3.select(container).select("svg").remove();
    d3.select(container).select(".gene-variant-pvalue-manhattan-plot-tooltip").remove();

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("font-family", THEME.fontFamily);

    d3.select(container).style("position", "relative");

    const tooltip = d3
        .select(container)
        .append("div")
        .attr("class", "gene-variant-pvalue-manhattan-plot-tooltip")
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

    drawBackground(svg, width, height);
    const x = buildXScale(width, margin, opts.domain);
    const layout = resolveLayout(height, opts.displayOpts);
    const scaleBandTicks = createDefaultScaleTicks(opts.domain, width - margin.left - margin.right);

    drawScaleBand(svg, x, width, margin, scaleBandTicks, layout, {
        start: opts.gene.start,
        end: opts.gene.end,
        label: opts.gene.label,
    });

    drawVariants(svg, x, width, margin, visibleVariants, colorByTrait, layout, tooltip);
    drawOverviewTrack(svg, width, margin, layout);
    drawTraitLegend(svg, x, width, margin, traitLegend, layout, svg, tooltip);
    drawGenes(svg, x, width, margin, opts.gene, layout);
}
