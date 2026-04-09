import * as d3 from "d3";
import { DisplayProps } from "./types";
import {
    buildXScale,
    createDefaultScaleTicks,
    createPlotTooltip,
    createValueHeightScale,
    DEFAULT_MARGIN,
    drawBackground,
    drawGenes,
    drawGenomeWideSignificanceLine,
    drawOverviewTrack,
    drawScaleBand,
    drawTraitLegend,
    filterVariantsToDomain,
    generateTraitLegend,
    GeneModel,
    Layout,
    resolveDimensions,
    resolveLayout,
    THEME,
    VariantDatum,
} from "./geneVariantPlotShared";

interface VariantTrack extends VariantDatum {
    color: string;
    radius: number;
    renderedX: number;
    renderedY: number;
}

const selectedTraitByContainer = new WeakMap<HTMLElement, string | null>();
const TOOLTIP_ROW_LIMIT = 5;
const TOOLTIP_X_TOLERANCE = 6;
const TOOLTIP_Y_TOLERANCE = 6;

export interface GeneVariantPValueManhattanPlotOptions {
    displayOpts: DisplayProps;
    domain: [number, number];
    variants: VariantDatum[];
    gene: GeneModel;
}

function drawVariants(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleLinear<number, number>,
    width: number,
    margin: { top: number; right: number; bottom: number; left: number },
    annotations: VariantDatum[],
    colorByTrait: Map<string, string>,
    layout: Layout,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
    selectedTrait: string | null
) {
    const group = svg.append("g");
    const { maxValue, heightScale } = createValueHeightScale(annotations, layout);
    drawGenomeWideSignificanceLine(group, width, margin, layout, maxValue, heightScale);

    const variants: VariantTrack[] = annotations.map((annotation) => ({
        ...annotation,
        color: colorByTrait.get(annotation.trait) || "#2f6f9f",
        radius: 2.5,
        renderedX: x(annotation.position),
        renderedY: layout.variantsBaseY - heightScale(annotation.value),
    }));

    const formatPValue = (value: number) => {
        if (!Number.isFinite(value)) return String(value);
        if (value > 200) {
            return `1e-${Math.round(value)}`;
        }
        return (10 ** -value).toExponential(2);
    };

    const buildTooltipHtml = (datum: VariantTrack) => {
        const relevantVariants = variants
            .filter(
                (variant) =>
                    Math.abs(variant.renderedX - datum.renderedX) <= TOOLTIP_X_TOLERANCE &&
                    Math.abs(variant.renderedY - datum.renderedY) <= TOOLTIP_Y_TOLERANCE
            )
            .filter((variant) => !selectedTrait || variant.trait === selectedTrait)
            .sort((a, b) => b.value - a.value);

        if (!relevantVariants.length) {
            return null;
        }

        const seen = new Set<string>();
        const dedupedVariants = relevantVariants.filter((variant) => {
            const pValueDisplay = formatPValue(variant.value);
            const key = `${variant.trait}::${variant.id}::${pValueDisplay}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });

        const visibleRows = dedupedVariants.slice(0, TOOLTIP_ROW_LIMIT);
        const hiddenCount = Math.max(0, dedupedVariants.length - visibleRows.length);
        const rows = visibleRows
            .map(
                (variant) =>
                    `<tr><td style="padding:2px 10px 2px 0;color:${variant.color};">${variant.trait}</td><td style="padding:2px 10px 2px 0;">${variant.id}</td><td style="padding:2px 0 2px 0;text-align:right;">${formatPValue(variant.value)}</td></tr>`
            )
            .join("");
        const overflowRow = hiddenCount
            ? `<tr><td colspan="3" style="padding-top:4px;color:${THEME.mutedTextColor};">...plus ${hiddenCount} more</td></tr>`
            : "";

        tooltip
            .style("display", "block")
            .html(
                `<table style="border-collapse:collapse;"><thead><tr><th style="padding:0 10px 4px 0;text-align:left;">Trait</th><th style="padding:0 10px 4px 0;text-align:left;">Variant</th><th style="padding:0 0 4px 0;text-align:right;">p-value</th></tr></thead><tbody>${rows}${overflowRow}</tbody></table>`
            );

        return true;
    };

    const showTooltip = (event: MouseEvent, datum: VariantTrack) => {
        if (!buildTooltipHtml(datum)) {
            hideTooltip();
            return;
        }
        tooltip.style("left", `${event.offsetX + 14}px`).style("top", `${event.offsetY - 34}px`);
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

export function geneVariantPValueManhattanPlot(container: HTMLElement, opts: GeneVariantPValueManhattanPlotOptions) {
    const margin = opts.displayOpts?.margin || DEFAULT_MARGIN;
    const { width, height } = resolveDimensions(container, opts.displayOpts);
    const visibleVariants = filterVariantsToDomain(opts.variants, opts.domain);
    const { blocks: legendBlocks, colorByTrait } = generateTraitLegend(visibleVariants, opts.domain);
    const traitLegend = { blocks: legendBlocks };
    const selectedTrait = selectedTraitByContainer.get(container) || null;

    d3.select(container).select("svg").remove();

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("font-family", THEME.fontFamily);

    const tooltip = createPlotTooltip(container, "gene-variant-pvalue-manhattan-plot-tooltip");
    tooltip.style("white-space", "normal");

    drawBackground(svg, width, height);
    const x = buildXScale(width, margin, opts.domain);
    const layout = resolveLayout(height, opts.displayOpts);
    const scaleBandTicks = createDefaultScaleTicks(opts.domain, width - margin.left - margin.right);

    drawScaleBand(svg, x, width, margin, scaleBandTicks, layout, {
        start: opts.gene.start,
        end: opts.gene.end,
        label: opts.gene.label,
    });

    drawVariants(svg, x, width, margin, visibleVariants, colorByTrait, layout, tooltip, selectedTrait);
    drawOverviewTrack(svg, width, margin, layout);

    const applyActiveTrait = (rootSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>, traitKey: string | null) => {
        rootSvg
            .selectAll<SVGCircleElement, VariantTrack>(".variant-track-dot")
            .attr("opacity", (d) => (!traitKey || d.trait === traitKey ? 1 : 0.22))
            .attr("fill", (d) => (!traitKey ? THEME.neutralVariantFill : d.trait === traitKey ? d.color : THEME.neutralVariantFill))
            .attr("r", (d) => (!traitKey || d.trait !== traitKey ? d.radius : d.radius + 0.5));
    };

    applyActiveTrait(svg, selectedTrait);

    drawTraitLegend(svg, x, width, margin, traitLegend, layout, svg, tooltip, {
        onEnter: (rootSvg, traitKey) => {
            applyActiveTrait(rootSvg, selectedTrait || traitKey);
        },
        onLeave: (rootSvg) => {
            applyActiveTrait(rootSvg, selectedTrait);
        },
        onClick: (traitKey) => {
            selectedTraitByContainer.set(container, selectedTrait === traitKey ? null : traitKey);
            geneVariantPValueManhattanPlot(container, opts);
        },
        isSelected: (traitKey) => selectedTrait === traitKey,
    });
    drawGenes(svg, x, width, margin, opts.gene, layout);
}
