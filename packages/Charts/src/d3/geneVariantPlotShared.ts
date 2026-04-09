import * as d3 from "d3";
import { DisplayProps } from "./types";

export const THEME = {
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

export const DEFAULT_MARGIN = { top: 90, right: 90, bottom: 90, left: 90 };
export const GENOME_WIDE_SIGNIFICANCE_THRESHOLD = 7.30103;

export interface Range {
    start: number;
    end: number;
}

export interface TrackBaseElement extends Range {
    stroke: string;
    strokeWidth: number;
}

export interface RegionTrack extends TrackBaseElement {}

export interface VariantDatum {
    id: string;
    position: number;
    value: number;
    trait: string;
}

export interface Feature extends Range {}

export interface TrackTick {
    value: number;
    label: string;
}

export interface TraitLegendBlock extends TrackBaseElement {
    fill: string;
    label?: string;
    group: string;
}

export interface PositionedTraitLegendBlock extends TraitLegendBlock {
    index: number;
}

export interface Layout {
    scaleY: number;
    scaleHeight: number;
    variantMinStemHeight: number;
    variantMaxStemHeight: number;
    variantsBaseY: number;
    geneY: number;
    traitLegendY: number;
    traitLegendHeight: number;
}

export interface GeneModel {
    label: string;
    introns: Feature[];
    exons: Feature[];
    start: number;
    end: number;
}

export function resolveDimensions(container: HTMLElement, displayOpts: DisplayProps) {
    const parent = container.parentElement || container;
    const width = displayOpts.width || parent.clientWidth || 1200;
    const height = displayOpts.height || width * (displayOpts.aspectRatio || 0.66);
    return { width, height };
}

export function buildXScale(
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    domain: [number, number]
) {
    return d3
        .scaleLinear()
        .domain(domain)
        .range([margin.left, width - margin.right]);
}

export function createDefaultScaleTicks(domain: [number, number], pixelWidth: number = 1200): TrackTick[] {
    const tickCount = Math.max(4, Math.floor(pixelWidth / 200));
    const scale = d3.scaleLinear().domain(domain).range([0, pixelWidth]);
    return scale.ticks(tickCount).map((value) => ({
        value,
        label: `${(value / 1_000_000).toFixed(2)}Mb`,
    }));
}

export function resolveLayout(height: number, displayOpts: DisplayProps): Layout {
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

    return {
        scaleY,
        scaleHeight,
        variantMinStemHeight,
        variantMaxStemHeight,
        variantsBaseY,
        geneY: variantsBaseY + 34,
        traitLegendY: scaleY - 18,
        traitLegendHeight: 12,
    };
}

export function drawBackground(_svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, _width: number, _height: number) {
    return;
}

export function createValueHeightScale(variants: VariantDatum[], layout: Layout) {
    const maxValue = d3.max(variants, (d) => d.value) || 1;
    const heightScale = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([layout.variantMinStemHeight, layout.variantMaxStemHeight]);
    return { maxValue, heightScale };
}

export function drawGenomeWideSignificanceLine(
    group: d3.Selection<SVGGElement, unknown, null, undefined>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    layout: Layout,
    maxValue: number,
    heightScale: d3.ScaleLinear<number, number>
) {
    if (GENOME_WIDE_SIGNIFICANCE_THRESHOLD > maxValue) return;

    const chartLeft = margin.left;
    const chartRight = width - margin.right;
    const thresholdY = layout.variantsBaseY - heightScale(GENOME_WIDE_SIGNIFICANCE_THRESHOLD);

    group
        .append("line")
        .attr("x1", chartLeft)
        .attr("x2", chartRight)
        .attr("y1", thresholdY)
        .attr("y2", thresholdY)
        .attr("stroke", "#c94b4b")
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
        .style("fill", "#c94b4b")
        .text("p = 5e⁻⁸");
}

export function drawScaleBand(
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

    if (!highlightedRegion) return;

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

export function drawGenes(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    gene: Pick<GeneModel, "label" | "introns" | "exons">,
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

export function drawOverviewTrack(
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

export function generateTraitLegend(
    variants: VariantDatum[],
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

    return { blocks, colorByTrait: new Map(uniqueTraits.map((trait) => [trait, colorScale(trait)])) };
}

export function createPlotTooltip(container: HTMLElement, className: string) {
    d3.select(container).select(`.${className}`).remove();
    d3.select(container).style("position", "relative");

    return d3
        .select(container)
        .append("div")
        .attr("class", className)
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
}

export function filterVariantsToDomain(variants: VariantDatum[], domain: [number, number]) {
    return variants.filter((variant) => variant.position >= domain[0] && variant.position <= domain[1]);
}

export function drawTraitLegend(
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
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
    handlers: {
        onEnter: (rootSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>, traitKey: string) => void;
        onLeave: (rootSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void;
        onClick?: (traitKey: string) => void;
        isSelected?: (traitKey: string) => boolean;
    }
) {
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
    const applyLegendBlockStyle = <D extends TraitLegendBlock>(
        selection: d3.Selection<SVGRectElement, D, any, any>,
        isActive: boolean
    ) => {
        selection
            .attr("fill", (d) => (isActive ? d3.color(d.fill)?.brighter(0.5).formatHex() || d.fill : d.fill))
            .attr("stroke", (d) => (isActive ? THEME.hoverStroke : d.stroke))
            .attr("stroke-width", (d) => (isActive ? 2.5 : d.strokeWidth));
    };

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

    if (handlers.onClick) {
        group.selectAll<SVGRectElement, PositionedTraitLegendBlock>(".variant-track-legend-block").style("cursor", "pointer");
    }

    group
        .selectAll<SVGRectElement, PositionedTraitLegendBlock>(".variant-track-legend-block")
        .on("mouseenter", function (event, datum) {
            const traitKey = datum.group;
            if (!traitKey) return;

            handlers.onEnter(rootSvg, traitKey);

            const isSelected = handlers.isSelected?.(traitKey) || false;
            if (!handlers.isSelected || !handlers.isSelected(traitKey)) {
                applyLegendBlockStyle(d3.select<SVGRectElement, PositionedTraitLegendBlock>(this as SVGRectElement), true);
            } else {
                applyLegendBlockStyle(
                    d3.select<SVGRectElement, PositionedTraitLegendBlock>(this as SVGRectElement),
                    isSelected
                );
            }

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
            handlers.onLeave(rootSvg);

            const selection = d3.select<SVGRectElement, PositionedTraitLegendBlock>(this as SVGRectElement);
            const traitKey = selection.datum().group;
            applyLegendBlockStyle(selection, handlers.isSelected?.(traitKey) || false);

            tooltip.style("display", "none");
        })
        .on("click", function (_event, datum) {
            if (!handlers.onClick) return;
            handlers.onClick(datum.group);
        });

    if (handlers.isSelected) {
        group.selectAll<SVGRectElement, PositionedTraitLegendBlock>(".variant-track-legend-block").each(function (datum) {
            applyLegendBlockStyle(
                d3.select<SVGRectElement, PositionedTraitLegendBlock>(this as SVGRectElement),
                handlers.isSelected?.(datum.group) || false
            );
        });
    }

    if (!legend.highlightedRegion) return;

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
