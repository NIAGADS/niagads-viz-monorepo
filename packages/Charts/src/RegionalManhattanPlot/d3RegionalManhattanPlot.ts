import * as d3 from "d3";

import { AxisConfig, DisplayProps } from "../d3/types";
import {
    RegionalManhattanPlotDataPoint,
    RegionalManhattanPlotGene,
    RegionalManhattanPlotLegend,
} from "./RegionalManhattanPlot";

export interface RegionalManhattanPlotSummary {
    visibleCount: number;
    strongestScore?: number;
    leadFeature?: string;
}

export interface RegionalManhattanPlotOptions {
    colorLabels: string[];
    symbolLabels: string[];
    threshold?: number;
    thresholdLabel?: string;
    xAxis?: AxisConfig;
    yAxis?: AxisConfig;
    legend?: RegionalManhattanPlotLegend;
    gene?: RegionalManhattanPlotGene;
    displayOpts?: DisplayProps;
    ariaLabel?: string;
    selectedColor: string;
    selectedSymbol: string;
    minimumScore: number;
    fullDomain: [number, number];
    viewDomain: [number, number];
    onViewDomainChange: (domain: [number, number]) => void;
    onSummaryChange: (summary: RegionalManhattanPlotSummary) => void;
}

const DEFAULT_WIDTH = 930;
const DEFAULT_HEIGHT = 610;
const DEFAULT_MARGIN = { top: 32, right: 170, bottom: 115, left: 72 };
const OVERVIEW_HEIGHT = 55;
const OVERVIEW_GAP = 105;

const getTooltipLines = (
    datum: RegionalManhattanPlotDataPoint,
    scoreLabel: string,
    colorLabel: string,
    symbolLabel: string
) => [
    ...(datum.feature_id ? [{ label: "Feature", value: datum.feature_id }] : []),
    { label: "Position", value: `${datum.position.toFixed(4)} Mb` },
    { label: scoreLabel, value: datum.score.toFixed(2) },
    { label: colorLabel, value: datum.colorCategory },
    { label: symbolLabel, value: datum.symbolCategory },
    ...(datum.tooltipInfo ?? []),
];

export function destroyRegionalManhattanPlot(container: HTMLElement): void {
    d3.select(container).selectAll("*").remove();
}

export function regionalManhattanPlot(
    container: HTMLElement,
    data: RegionalManhattanPlotDataPoint[],
    options: RegionalManhattanPlotOptions
): void {
    destroyRegionalManhattanPlot(container);

    const width = typeof options.displayOpts?.width === "number" ? options.displayOpts.width : DEFAULT_WIDTH;
    const height =
        options.displayOpts?.height ??
        (options.displayOpts?.aspectRatio ? width * options.displayOpts.aspectRatio : DEFAULT_HEIGHT);
    const margin = options.displayOpts?.margin ?? DEFAULT_MARGIN;
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom - OVERVIEW_HEIGHT - OVERVIEW_GAP);
    const maxScore = d3.max(data, (datum) => datum.score) ?? 1;
    const yMaximum = options.yAxis?.max ?? Math.max(1, maxScore);
    const fullYDomain: [number, number] = [options.yAxis?.min ?? 0, yMaximum];
    const yDomain: [number, number] = [
        Math.max(fullYDomain[0], Math.min(options.minimumScore, yMaximum - 1)),
        yMaximum,
    ];
    const x = d3.scaleLinear().domain(options.viewDomain).range([0, plotWidth]);
    const xOverview = d3.scaleLinear().domain(options.fullDomain).range([0, plotWidth]);
    const y = d3.scaleLinear().domain(yDomain).nice().range([plotHeight, 0]);
    const yOverview = d3.scaleLinear().domain(fullYDomain).range([OVERVIEW_HEIGHT, 0]);
    const color = d3
        .scaleOrdinal<string, string>()
        .domain(options.colorLabels)
        .range(d3.quantize(d3.interpolateRainbow, Math.max(1, options.colorLabels.length)));
    const symbols = new Map(
        options.symbolLabels.map((label, index) => [label, d3.symbolsStroke[index % d3.symbolsStroke.length]] as const)
    );
    const colorLabel = options.legend?.colorLabel ?? "Color";
    const symbolLabel = options.legend?.symbolLabel ?? "Symbol";
    const scoreLabel = options.yAxis?.label ?? "Score";

    const svg = d3
        .select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr(
            "aria-label",
            options.ariaLabel ??
                "Interactive regional Manhattan plot. Score is shown vertically, with categories encoded by color and shape."
        );
    const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const overview = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + plotHeight + OVERVIEW_GAP})`);
    const tooltip = d3
        .select(container)
        .append("div")
        .attr("class", "regional-manhattan-plot-tooltip")
        .attr("role", "tooltip")
        .style("display", "none");

    const positionTooltip = (event: PointerEvent | FocusEvent): void => {
        const containerBounds = container.getBoundingClientRect();
        if (event instanceof PointerEvent) {
            tooltip
                .style("left", `${Math.min(event.clientX - containerBounds.left + 14, containerBounds.width - 275)}px`)
                .style("top", `${Math.max(event.clientY - containerBounds.top - 20, 12)}px`);
            return;
        }
        const targetBounds = (event.currentTarget as SVGPathElement).getBoundingClientRect();
        tooltip
            .style("left", `${targetBounds.right - containerBounds.left + 10}px`)
            .style("top", `${targetBounds.top - containerBounds.top}px`);
    };

    const showTooltip = (event: PointerEvent | FocusEvent, datum: RegionalManhattanPlotDataPoint): void => {
        tooltip.html("");
        if (datum.feature_id) {
            tooltip.append("div").attr("class", "regional-manhattan-plot-tooltip-title").text(datum.feature_id);
        }
        getTooltipLines(datum, scoreLabel, colorLabel, symbolLabel)
            .filter((line) => line.label !== "Feature")
            .forEach((line) => {
                const row = tooltip.append("div").attr("class", "regional-manhattan-plot-tooltip-row");
                row.append("span").attr("class", "regional-manhattan-plot-tooltip-key").text(line.label);
                row.append("span").text(String(line.value));
            });
        tooltip.style("display", "block");
        positionTooltip(event);
    };

    chart
        .append("g")
        .attr("class", "regional-manhattan-plot-grid")
        .call(
            d3
                .axisLeft(y)
                .ticks(5)
                .tickSize(-plotWidth)
                .tickFormat(() => "")
        )
        .call((group) => group.select(".domain").remove());

    const thresholdLine = chart
        .append("line")
        .attr("class", "regional-manhattan-plot-threshold")
        .attr("x1", 0)
        .attr("x2", plotWidth);
    const thresholdText = chart
        .append("text")
        .attr("class", "regional-manhattan-plot-threshold-label")
        .attr("x", plotWidth - 4)
        .attr("text-anchor", "end");

    if (options.threshold === undefined || options.threshold < yDomain[0] || options.threshold > yDomain[1]) {
        thresholdLine.style("display", "none");
        thresholdText.style("display", "none");
    } else {
        thresholdLine.attr("y1", y(options.threshold)).attr("y2", y(options.threshold));
        thresholdText.attr("y", y(options.threshold) - 7).text(options.thresholdLabel ?? String(options.threshold));
    }

    const xAxis = chart
        .append("g")
        .attr("class", "regional-manhattan-plot-axis")
        .attr("transform", `translate(0,${plotHeight})`);
    chart.append("g").attr("class", "regional-manhattan-plot-axis").call(d3.axisLeft(y).ticks(5));

    chart
        .append("text")
        .attr("class", "regional-manhattan-plot-axis-title")
        .attr("x", plotWidth / 2)
        .attr("y", plotHeight + 80)
        .attr("text-anchor", "middle")
        .text(options.xAxis?.label ?? "Position (Mb)");
    chart
        .append("text")
        .attr("class", "regional-manhattan-plot-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("x", -plotHeight / 2)
        .attr("y", -52)
        .attr("text-anchor", "middle")
        .text(options.yAxis?.label ?? "Score");

    const pointsLayer = chart.append("g");
    const geneTrack = chart
        .append("g")
        .attr("class", "regional-manhattan-plot-gene-track")
        .style("display", options.gene ? null : "none");
    const geneBar = geneTrack.append("line").attr("class", "regional-manhattan-plot-gene-bar");
    const geneArrow = geneTrack.append("path").attr("class", "regional-manhattan-plot-gene-arrow");
    const geneLabel = geneTrack
        .append("text")
        .attr("class", "regional-manhattan-plot-gene-label")
        .attr("text-anchor", "middle");

    overview
        .append("rect")
        .attr("class", "regional-manhattan-plot-overview-background")
        .attr("width", plotWidth)
        .attr("height", OVERVIEW_HEIGHT);
    overview
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (datum) => xOverview(datum.position))
        .attr("cy", (datum) => yOverview(datum.score))
        .attr("r", 1.4)
        .attr("fill", (datum) => color(datum.colorCategory))
        .attr("opacity", 0.55);
    overview
        .append("g")
        .attr("class", "regional-manhattan-plot-axis")
        .attr("transform", `translate(0,${OVERVIEW_HEIGHT})`)
        .call(
            d3
                .axisBottom(xOverview)
                .ticks(6)
                .tickFormat((tick) => `${tick} Mb`)
        );

    const visibleData = () =>
        data.filter(
            (datum) =>
                (options.selectedColor === "all" || datum.colorCategory === options.selectedColor) &&
                (options.selectedSymbol === "all" || datum.symbolCategory === options.selectedSymbol) &&
                datum.score >= options.minimumScore &&
                datum.position >= x.domain()[0] &&
                datum.position <= x.domain()[1]
        );

    const render = () => {
        xAxis.call(
            d3
                .axisBottom(x)
                .ticks(6)
                .tickFormat((tick) => `${Number(tick).toFixed(1)} Mb`)
        );

        if (options.gene) {
            const geneStart = Math.min(options.gene.start, options.gene.end) / 1_000_000;
            const geneEnd = Math.max(options.gene.start, options.gene.end) / 1_000_000;
            const [viewStart, viewEnd] = x.domain();
            const visibleStart = Math.max(geneStart, viewStart);
            const visibleEnd = Math.min(geneEnd, viewEnd);
            const isVisible = visibleStart <= visibleEnd;
            const barY = plotHeight + 34;
            const startX = x(visibleStart);
            const endX = x(visibleEnd);
            const arrowAtStart = options.gene.strand === "-" && geneStart >= viewStart && geneStart <= viewEnd;
            const arrowAtEnd = options.gene.strand === "+" && geneEnd >= viewStart && geneEnd <= viewEnd;

            geneTrack.style("display", isVisible ? null : "none");
            geneBar.attr("x1", startX).attr("x2", endX).attr("y1", barY).attr("y2", barY);
            geneArrow.attr(
                "d",
                arrowAtStart
                    ? `M${startX},${barY} L${startX + 9},${barY - 5} L${startX + 9},${barY + 5} Z`
                    : arrowAtEnd
                      ? `M${endX},${barY} L${endX - 9},${barY - 5} L${endX - 9},${barY + 5} Z`
                      : ""
            );
            geneLabel
                .attr("x", (startX + endX) / 2)
                .attr("y", barY + 19)
                .text(options.gene.gene_symbol);
        }

        const visible = visibleData();
        pointsLayer
            .selectAll<SVGPathElement, RegionalManhattanPlotDataPoint>("path")
            .data(
                visible,
                (datum) => `${datum.feature_id ?? ""}-${datum.colorCategory}-${datum.symbolCategory}-${datum.position}`
            )
            .join(
                (enter) => enter.append("path").attr("class", "regional-manhattan-plot-point").attr("tabindex", 0),
                (update) => update,
                (exit) => exit.remove()
            )
            .attr("d", (datum) =>
                d3
                    .symbol()
                    .type(symbols.get(datum.symbolCategory) ?? d3.symbolX)
                    .size(datum.score > 30 ? 31 : 19)()
            )
            .attr("transform", (datum) => `translate(${x(datum.position)},${y(datum.score)})`)
            .attr("fill", "none")
            .attr("stroke", (datum) => color(datum.colorCategory))
            .attr("stroke-width", 1.5)
            .attr("opacity", (datum) => (datum.score < 5 ? 0.65 : 0.9))
            .attr("role", "img")
            .attr("aria-label", (datum) =>
                getTooltipLines(datum, scoreLabel, colorLabel, symbolLabel)
                    .map((line) => `${line.label} ${line.value}`)
                    .join(", ")
            )
            .on("pointerenter", (event: PointerEvent, datum) => showTooltip(event, datum))
            .on("pointermove", (event: PointerEvent) => positionTooltip(event))
            .on("pointerleave", () => tooltip.style("display", "none"))
            .on("focus", (event: FocusEvent, datum) => showTooltip(event, datum))
            .on("blur", () => tooltip.style("display", "none"));

        const strongest = d3.greatest(visible, (datum) => datum.score);
        options.onSummaryChange({
            visibleCount: visible.length,
            strongestScore: strongest?.score,
            leadFeature: strongest?.feature_id,
        });
    };

    const brush = d3
        .brushX<unknown>()
        .extent([
            [0, 0],
            [plotWidth, OVERVIEW_HEIGHT],
        ])
        .on("brush", (event) => {
            if (!event.selection) return;
            x.domain((event.selection as [number, number]).map(xOverview.invert) as [number, number]);
            render();
        })
        .on("end", (event) => {
            if (!event.selection || !event.sourceEvent) return;
            options.onViewDomainChange((event.selection as [number, number]).map(xOverview.invert) as [number, number]);
        });

    overview
        .append("g")
        .attr("class", "regional-manhattan-plot-brush")
        .call(brush)
        .call(brush.move, options.viewDomain.map(xOverview));

    const legend = svg.append("g").attr("transform", `translate(${margin.left + plotWidth + 28},${margin.top + 8})`);
    legend
        .append("text")
        .attr("class", "regional-manhattan-plot-legend-title")
        .text(options.legend?.symbolLabel ?? "Symbol");
    options.symbolLabels.forEach((label, index) => {
        const row = legend.append("g").attr("transform", `translate(0,${24 + index * 24})`);
        row.append("path")
            .attr(
                "d",
                d3
                    .symbol()
                    .type(symbols.get(label) ?? d3.symbolX)
                    .size(24)()
            )
            .attr("class", "regional-manhattan-plot-legend-symbol")
            .style("fill", "none");
        row.append("text").attr("class", "regional-manhattan-plot-legend-label").attr("x", 16).attr("y", 4).text(label);
    });
    const colorLegendY = 48 + options.symbolLabels.length * 24;
    legend
        .append("text")
        .attr("class", "regional-manhattan-plot-legend-title")
        .attr("y", colorLegendY)
        .text(options.legend?.colorLabel ?? "Color");
    options.colorLabels.forEach((label, index) => {
        const row = legend.append("g").attr("transform", `translate(0,${colorLegendY + 22 + index * 23})`);
        row.append("circle").attr("r", 4).attr("fill", color(label));
        row.append("text")
            .attr("class", "regional-manhattan-plot-legend-label")
            .attr("x", 13)
            .attr("y", 4)
            .text(label.replace(/ \(.+\)$/, ""));
    });

    render();
}
