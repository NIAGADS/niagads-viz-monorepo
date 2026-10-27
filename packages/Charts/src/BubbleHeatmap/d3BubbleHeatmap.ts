import * as d3 from "d3";

import { DisplayProps } from "../d3/types";
import { BubbleHeatmapAxisLabel, BubbleHeatmapDataPoint, BubbleHeatmapLegend } from "./BubbleHeatmap";

export interface BubbleHeatmapOptions {
    xLabels?: Array<string | BubbleHeatmapAxisLabel>;
    yLabels?: Array<string | BubbleHeatmapAxisLabel>;
    displayOpts?: DisplayProps;
    legend?: BubbleHeatmapLegend;
    ariaLabel?: string;
    showLabels?: boolean;
}

const DEFAULT_WIDTH = 920;
const DEFAULT_HEIGHT = 510;
const DEFAULT_MARGIN = { top: 36, right: 120, bottom: 105, left: 125 };
const DEFAULT_ARIA_LABEL = "Bubble matrix. Color represents the cell value and circle size represents magnitude.";

const unique = (values: string[]): string[] => Array.from(new Set(values));

const normalizeAxisLabels = (labels: Array<string | BubbleHeatmapAxisLabel>): BubbleHeatmapAxisLabel[] =>
    labels.map((label) => (typeof label === "string" ? { value: label } : label));

const wrapLabel = (label: string): string[] => {
    const lines: string[] = [];
    let line = "";

    label.split(" ").forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (candidate.length > 18 && line) {
            lines.push(line);
            line = word;
        } else {
            line = candidate;
        }
    });

    if (line) lines.push(line);
    return lines.slice(0, 2);
};

const getTooltipLines = (
    datum: BubbleHeatmapDataPoint,
    legendLabel: string,
    xLabel: string
): Array<{ label?: string; value: string }> => [
    { value: xLabel },
    { value: datum.y },
    ...(datum.feature_id ? [{ label: "Feature", value: datum.feature_id }] : []),
    ...(datum.tooltipInfo?.map((info) => ({ label: info.label, value: String(info.value) })) ?? []),
    { label: legendLabel, value: d3.format(".2f")(datum.value) },
];

export function destroyBubbleHeatmap(container: HTMLElement): void {
    d3.select(container).selectAll("*").remove();
}

export function bubbleHeatmap(
    container: HTMLElement,
    data: BubbleHeatmapDataPoint[],
    options: BubbleHeatmapOptions = {}
): void {
    destroyBubbleHeatmap(container);

    const width = typeof options.displayOpts?.width === "number" ? options.displayOpts.width : DEFAULT_WIDTH;
    const height =
        options.displayOpts?.height ??
        (options.displayOpts?.aspectRatio ? width * options.displayOpts.aspectRatio : DEFAULT_HEIGHT);
    const margin = options.displayOpts?.margin ?? DEFAULT_MARGIN;
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);
    const xLabels = normalizeAxisLabels(options.xLabels ?? unique(data.map((datum) => datum.x)));
    const yLabels = normalizeAxisLabels(options.yLabels ?? unique(data.map((datum) => datum.y)));
    const xValues = xLabels.map((label) => label.value);
    const yValues = yLabels.map((label) => label.value);
    const xDisplayLabels = new Map(xLabels.map((label) => [label.value, label.secondaryLabel ?? label.value]));
    const legendLabel = options.legend?.label ?? "Value";
    const maxAbsoluteValue = d3.max(data, (datum) => Math.abs(datum.value)) || 1;
    const sizeExtent = d3.extent(data, (datum) => datum.size);
    const minSize = sizeExtent[0] ?? 0;
    const maxSize = sizeExtent[1] ?? minSize;
    const sizeDomain: [number, number] = minSize === maxSize ? [0, maxSize || 1] : [minSize, maxSize];

    const x = d3.scaleBand().domain(xValues).range([0, innerWidth]).padding(0.16);
    const y = d3.scaleBand().domain(yValues).range([0, innerHeight]).padding(0.18);
    const color = d3
        .scaleDiverging<string>()
        .domain([-maxAbsoluteValue, 0, maxAbsoluteValue])
        .interpolator(d3.interpolatePuOr);
    const size = d3.scaleSqrt().domain(sizeDomain).range([9, 25]);

    const svg = d3
        .select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr("aria-label", options.ariaLabel ?? DEFAULT_ARIA_LABEL);

    const plot = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const tooltip = d3
        .select(container)
        .append("div")
        .attr("class", "bubble-heatmap-tooltip")
        .attr("role", "tooltip")
        .style("display", "none");

    const positionTooltip = (event: PointerEvent | FocusEvent): void => {
        const containerBounds = container.getBoundingClientRect();

        if (event instanceof PointerEvent) {
            tooltip
                .style("left", `${Math.min(event.clientX - containerBounds.left + 14, containerBounds.width - 250)}px`)
                .style("top", `${Math.max(event.clientY - containerBounds.top - 20, 12)}px`);
            return;
        }

        const targetBounds = (event.currentTarget as SVGCircleElement).getBoundingClientRect();
        tooltip
            .style("left", `${targetBounds.right - containerBounds.left + 10}px`)
            .style("top", `${targetBounds.top - containerBounds.top}px`);
    };

    const showTooltip = (event: PointerEvent | FocusEvent, datum: BubbleHeatmapDataPoint): void => {
        tooltip.html("");
        getTooltipLines(datum, legendLabel, xDisplayLabels.get(datum.x) ?? datum.x).forEach((line, index) => {
            if (!line.label) {
                tooltip
                    .append("div")
                    .attr("class", index === 0 ? "bubble-heatmap-tooltip-title" : "bubble-heatmap-tooltip-subtitle")
                    .text(line.value);
                return;
            }

            const row = tooltip.append("div").attr("class", "bubble-heatmap-tooltip-row");
            row.append("span").attr("class", "bubble-heatmap-tooltip-key").text(line.label);
            row.append("span").text(line.value);
        });
        tooltip.style("display", "block");
        positionTooltip(event);
    };

    plot.selectAll("line.bubble-heatmap-grid-vertical")
        .data(xValues)
        .join("line")
        .attr("class", "bubble-heatmap-grid-line")
        .attr("x1", (label) => (x(label) ?? 0) + x.bandwidth() / 2)
        .attr("x2", (label) => (x(label) ?? 0) + x.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", innerHeight);

    plot.selectAll("line.bubble-heatmap-grid-horizontal")
        .data(yValues)
        .join("line")
        .attr("class", "bubble-heatmap-grid-line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", (label) => (y(label) ?? 0) + y.bandwidth() / 2)
        .attr("y2", (label) => (y(label) ?? 0) + y.bandwidth() / 2);

    const marks = plot
        .selectAll<SVGGElement, BubbleHeatmapDataPoint>("g.bubble-heatmap-mark")
        .data(data)
        .join("g")
        .attr("class", "bubble-heatmap-mark")
        .attr(
            "transform",
            (datum) => `translate(${(x(datum.x) ?? 0) + x.bandwidth() / 2},${(y(datum.y) ?? 0) + y.bandwidth() / 2})`
        );

    marks
        .append("circle")
        .attr("class", "bubble-heatmap-association")
        .attr("tabindex", 0)
        .attr("r", (datum) => size(datum.size))
        .attr("fill", (datum) => color(datum.value))
        .attr("aria-label", (datum) =>
            getTooltipLines(datum, legendLabel, xDisplayLabels.get(datum.x) ?? datum.x)
                .map((line) => (line.label ? `${line.label} ${line.value}` : line.value))
                .join(", ")
        )
        .on("pointerenter", (event: PointerEvent, datum) => showTooltip(event, datum))
        .on("pointermove", (event: PointerEvent) => positionTooltip(event))
        .on("pointerleave", () => tooltip.style("display", "none"))
        .on("focus", (event: FocusEvent, datum) => showTooltip(event, datum))
        .on("blur", () => tooltip.style("display", "none"));

    marks
        .append("text")
        .attr("class", "bubble-heatmap-mark-label")
        .attr("dy", "0.35em")
        .style("display", options.showLabels ? "block" : "none")
        .text((datum) => datum.feature_id ?? "");

    plot.selectAll("text.bubble-heatmap-y-label")
        .data(yValues)
        .join("text")
        .attr("class", "bubble-heatmap-axis-label")
        .attr("x", -14)
        .attr("y", (label) => (y(label) ?? 0) + y.bandwidth() / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .text((label) => label);

    const xLabelGroups = plot
        .selectAll("g.bubble-heatmap-x-label")
        .data(xLabels)
        .join("g")
        .attr("transform", (label) => `translate(${(x(label.value) ?? 0) + x.bandwidth() / 2},${innerHeight + 20})`);

    xLabelGroups
        .append("text")
        .attr("class", "bubble-heatmap-axis-label")
        .attr("text-anchor", "middle")
        .text((label) => label.value);

    xLabelGroups
        .append("text")
        .attr("class", "bubble-heatmap-axis-label-secondary")
        .attr("text-anchor", "middle")
        .attr("y", 18)
        .each(function (label) {
            d3.select(this)
                .selectAll("tspan")
                .data(wrapLabel(label.secondaryLabel ?? ""))
                .join("tspan")
                .attr("x", 0)
                .attr("dy", (_, index) => (index === 0 ? 0 : 14))
                .text((line) => line);
        });

    const legendHeight = 190;
    const legendWidth = 14;
    const legendX = innerWidth + 54;
    const legendY = 70;
    const gradientId = `bubble-heatmap-gradient-${Math.random().toString(36).slice(2)}`;
    const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    d3.range(0, 1.001, 0.1).forEach((position) => {
        gradient
            .append("stop")
            .attr("offset", `${position * 100}%`)
            .attr("stop-color", color(-maxAbsoluteValue + position * maxAbsoluteValue * 2));
    });

    plot.append("text")
        .attr("class", "bubble-heatmap-axis-label")
        .attr("x", legendX - 8)
        .attr("y", legendY - 24)
        .text(legendLabel);

    plot.append("rect")
        .attr("x", legendX)
        .attr("y", legendY)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("rx", 7)
        .attr("fill", `url(#${gradientId})`);

    const legendScale = d3
        .scaleLinear()
        .domain([maxAbsoluteValue, -maxAbsoluteValue])
        .range([legendY, legendY + legendHeight]);

    plot.append("g")
        .attr("class", "bubble-heatmap-legend-axis")
        .attr("transform", `translate(${legendX + legendWidth},0)`)
        .call(d3.axisRight(legendScale).ticks(5).tickSize(5))
        .call((group) => group.select(".domain").remove());

    if (options.legend?.colorDescription || options.legend?.sizeDescription) {
        const encodingLegend = svg
            .append("g")
            .attr("class", "bubble-heatmap-encoding-legend")
            .attr("transform", `translate(${margin.left},${height - 14})`);

        if (options.legend.colorDescription) {
            const colorLegend = encodingLegend.append("text");
            colorLegend.append("tspan").attr("class", "bubble-heatmap-encoding-key").text("Color: ");
            colorLegend.append("tspan").text(options.legend.colorDescription);
        }

        if (options.legend.sizeDescription) {
            const sizeLegend = encodingLegend.append("text").attr("x", innerWidth * 0.45);
            sizeLegend.append("tspan").attr("class", "bubble-heatmap-encoding-key").text("Size: ");
            sizeLegend.append("tspan").text(options.legend.sizeDescription);
        }
    }
}
