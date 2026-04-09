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
}

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
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
    const group = svg.append("g");
    const { maxValue, heightScale } = createValueHeightScale(annotations, layout);
    drawGenomeWideSignificanceLine(group, width, margin, layout, maxValue, heightScale);

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

export function geneVariantPValueManhattanPlot(container: HTMLElement, opts: GeneVariantPValueManhattanPlotOptions) {
    const margin = opts.displayOpts?.margin || DEFAULT_MARGIN;
    const { width, height } = resolveDimensions(container, opts.displayOpts);
    const visibleVariants = filterVariantsToDomain(opts.variants, opts.domain);
    const { blocks: legendBlocks, colorByTrait } = generateTraitLegend(visibleVariants, opts.domain);
    const traitLegend = { blocks: legendBlocks };

    d3.select(container).select("svg").remove();

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("font-family", THEME.fontFamily);

    const tooltip = createPlotTooltip(container, "gene-variant-pvalue-manhattan-plot-tooltip");

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
    drawTraitLegend(svg, x, width, margin, traitLegend, layout, svg, tooltip, {
        onEnter: (rootSvg, traitKey) => {
            rootSvg
                .selectAll<SVGCircleElement, VariantTrack>(".variant-track-dot")
                .attr("opacity", (d) => (d.trait === traitKey ? 1 : 0.22))
                .attr("fill", (d) => (d.trait === traitKey ? d.color : THEME.neutralVariantFill))
                .attr("r", (d) => (d.trait === traitKey ? d.radius + 0.5 : d.radius));
        },
        onLeave: (rootSvg) => {
            rootSvg
                .selectAll<SVGCircleElement, VariantTrack>(".variant-track-dot")
                .attr("opacity", 1)
                .attr("fill", THEME.neutralVariantFill)
                .attr("r", (d) => d.radius);
        },
    });
    drawGenes(svg, x, width, margin, opts.gene, layout);
}
