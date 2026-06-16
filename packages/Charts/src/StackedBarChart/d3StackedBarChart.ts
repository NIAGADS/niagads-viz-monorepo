import * as d3 from "d3";

import { DisplayProps } from "../d3/types";
import { StackedBarChartDataRow } from "./StackedBarChart";
import { _isNA } from "@niagads/common";

export interface StackedBarChartOptions {
    displayOpts?: DisplayProps;
}

export const NA_COLOR = "#a1a2a4ff";

const STACKED_BAR_CHART_COLORS = {
    axis: "#5f6b7a",
    label: "#2f3a45",
    mutedLabel: "#52606d",
    grid: "#d9e2ec",
    segmentStroke: "#ffffff",
    segmentHoverOpacity: 0.9,
    totalLabel: "#1f2933",
    tooltipBackground: "rgba(255,255,255,0.98)",
    tooltipShadow: "0 10px 24px rgba(33, 43, 54, 0.14)",
} as const;

const DEFAULT_MARGIN = { top: 18, right: 56, bottom: 18, left: 136 };
const DEFAULT_BAR_HEIGHT = 28;
const DEFAULT_ROW_GAP = 8;
const DEFAULT_BAR_RADIUS = 4;

interface FlattenedDataRow {
    id: string;
    label: string;
    total: number;
    segments: Record<string, number>;
}

interface SegmentDatum {
    key: string;
    value: number;
    start: number;
    end: number;
}

interface VisibleSegmentDatum extends SegmentDatum {
    isFirstVisible: boolean;
    isLastVisible: boolean;
}

const getSegmentKeys = (data: StackedBarChartDataRow[]): string[] => {
    const keys = new Set<string>();
    data.forEach((row) => {
        row.values.forEach((value) => {
            keys.add(value.label);
        });
    });
    return Array.from(keys);
};

const flattenData = (data: StackedBarChartDataRow[], segmentKeys: string[]): FlattenedDataRow[] =>
    data.map((row) => {
        const segments = segmentKeys.reduce(
            (acc, key) => {
                acc[key] = 0;
                return acc;
            },
            {} as Record<string, number>
        );

        row.values.forEach((value) => {
            segments[value.label] = value.value;
        });

        return {
            id: row.id,
            label: row.label || row.id,
            total: d3.sum(row.values, (value) => value.value),
            segments,
        };
    });

const getSegmentData = (row: FlattenedDataRow, keys: string[]): SegmentDatum[] => {
    let offset = 0;

    return keys.map((key) => {
        const value = row.segments[key] ?? 0;
        const segment = {
            key,
            value,
            start: offset,
            end: offset + value,
        };
        offset += value;
        return segment;
    });
};

const getVisibleSegmentData = (row: FlattenedDataRow, keys: string[]): VisibleSegmentDatum[] => {
    const visibleSegments = getSegmentData(row, keys).filter((segment) => segment.value > 0);

    return visibleSegments.map((segment, index) => ({
        ...segment,
        isFirstVisible: index === 0,
        isLastVisible: index === visibleSegments.length - 1,
    }));
};

const getRoundedHorizontalSegmentPath = (
    xPos: number,
    yPos: number,
    width: number,
    height: number,
    radius: number,
    roundLeft: boolean,
    roundRight: boolean
): string => {
    const safeWidth = Math.max(0, width);
    const safeHeight = Math.max(0, height);
    const cappedRadius = Math.min(radius, safeHeight / 2, safeWidth / 2);

    if (safeWidth === 0 || safeHeight === 0) {
        return `M${xPos},${yPos}Z`;
    }

    if (cappedRadius === 0) {
        return [
            `M${xPos},${yPos}`,
            `L${xPos + safeWidth},${yPos}`,
            `L${xPos + safeWidth},${yPos + safeHeight}`,
            `L${xPos},${yPos + safeHeight}`,
            "Z",
        ].join(" ");
    }

    const leftInset = roundLeft ? cappedRadius : 0;
    const rightInset = roundRight ? cappedRadius : 0;

    return [
        `M${xPos + leftInset},${yPos}`,
        `L${xPos + safeWidth - rightInset},${yPos}`,
        roundRight
            ? `Q${xPos + safeWidth},${yPos} ${xPos + safeWidth},${yPos + cappedRadius}`
            : `L${xPos + safeWidth},${yPos}`,
        roundRight
            ? `L${xPos + safeWidth},${yPos + safeHeight - cappedRadius}`
            : `L${xPos + safeWidth},${yPos + safeHeight}`,
        roundRight
            ? `Q${xPos + safeWidth},${yPos + safeHeight} ${xPos + safeWidth - rightInset},${yPos + safeHeight}`
            : "",
        `L${xPos + leftInset},${yPos + safeHeight}`,
        roundLeft
            ? `Q${xPos},${yPos + safeHeight} ${xPos},${yPos + safeHeight - cappedRadius}`
            : `L${xPos},${yPos + safeHeight}`,
        roundLeft ? `L${xPos},${yPos + cappedRadius}` : `L${xPos},${yPos}`,
        roundLeft ? `Q${xPos},${yPos} ${xPos + leftInset},${yPos}` : "",
        "Z",
    ]
        .filter(Boolean)
        .join(" ");
};

export function getStackedBarChartHeight(rowCount: number, margin = DEFAULT_MARGIN): number {
    if (rowCount <= 0) {
        return margin.top + margin.bottom;
    }

    const rowStep = DEFAULT_BAR_HEIGHT + DEFAULT_ROW_GAP;
    const plotHeight = rowCount * rowStep - DEFAULT_ROW_GAP;
    return margin.top + plotHeight + margin.bottom;
}

export function destroyStackedBarChart(container: HTMLElement): void {
    d3.select(container).select(".stacked-bar-tooltip").remove();
    d3.select(container).select("svg").remove();
}

export function stackedBarChart(
    container: HTMLElement,
    data: StackedBarChartDataRow[],
    options: StackedBarChartOptions = {}
): void {
    destroyStackedBarChart(container);

    if (data.length === 0) {
        return;
    }

    const displayOpts = options.displayOpts || {};
    const margin = displayOpts.margin || DEFAULT_MARGIN;
    const width = displayOpts.width || 420;
    const segmentKeys = getSegmentKeys(data);
    const flattenedData = flattenData(data, segmentKeys);
    const maxTotal = d3.max(flattenedData, (row) => row.total) ?? 0;
    const rowGap = DEFAULT_ROW_GAP;
    const bandHeight = DEFAULT_BAR_HEIGHT;
    const rowStep = bandHeight + rowGap;
    const plotHeight = flattenedData.length * rowStep - rowGap;
    const height = getStackedBarChartHeight(flattenedData.length, margin);

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const plotWidth = width - margin.left - margin.right;

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, maxTotal]).nice().range([0, plotWidth]);

    const y = d3
        .scalePoint<string>()
        .domain(flattenedData.map((row) => row.label))
        .range([bandHeight / 2, Math.max(bandHeight / 2, (flattenedData.length - 1) * rowStep + bandHeight / 2)]);

    const colorScale = d3.scaleOrdinal<string, string>().domain(segmentKeys).range(d3.schemeCategory10);

    let tooltip = d3.select(container).select<HTMLDivElement>(".stacked-bar-tooltip");
    if (tooltip.empty()) {
        tooltip = d3
            .select(container)
            .append("div")
            .attr("class", "stacked-bar-tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background", STACKED_BAR_CHART_COLORS.tooltipBackground)
            .style("border", "1px solid transparent")
            .style("padding", "8px 10px")
            .style("border-radius", "8px")
            .style("font-size", "12px")
            .style("line-height", "1.4")
            .style("color", STACKED_BAR_CHART_COLORS.label)
            .style("box-shadow", STACKED_BAR_CHART_COLORS.tooltipShadow)
            .style("display", "none")
            .style("z-index", "10");
    }

    const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(12);
    root.append("g")
        .attr("class", "stacked-bar-axis")
        .call(yAxis)
        .call((axis) => {
            axis.select(".domain").remove();
            axis.selectAll(".tick text")
                .style("fill", STACKED_BAR_CHART_COLORS.label)
                .style("font-size", "12px")
                .style("font-weight", "500");
        });

    const rowGroups = root
        .append("g")
        .attr("class", "stacked-bar-rows")
        .selectAll("g")
        .data(flattenedData)
        .enter()
        .append("g")
        .attr("transform", (row) => `translate(0,${(y(row.label) ?? bandHeight / 2) - bandHeight / 2})`);

    rowGroups
        .append("g")
        .selectAll("path")
        .data((row) => getVisibleSegmentData(row, segmentKeys))
        .enter()
        .append("path")
        .attr("d", (segment) =>
            getRoundedHorizontalSegmentPath(
                x(segment.start),
                0,
                Math.max(0, x(segment.end) - x(segment.start)),
                bandHeight,
                DEFAULT_BAR_RADIUS,
                segment.isFirstVisible,
                segment.isLastVisible
            )
        )
        .attr("fill", (segment) => (_isNA(segment.key) ? NA_COLOR : colorScale(segment.key)))
        .attr("stroke", STACKED_BAR_CHART_COLORS.segmentStroke)
        .attr("stroke-width", 1)
        .on("mousemove", function (event, segment) {
            const fillColor = _isNA(segment.key) ? NA_COLOR : colorScale(segment.key);
            const [pointerX, pointerY] = d3.pointer(event, container);
            d3.select(this).attr("opacity", STACKED_BAR_CHART_COLORS.segmentHoverOpacity);

            tooltip
                .style("display", "block")
                .style("border-color", fillColor)
                .style("left", `${pointerX + 16}px`)
                .style("top", `${pointerY - 10}px`)
                .html(`<strong>${segment.key}</strong><br>${d3.format(",")(segment.value)}`);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("opacity", 1);
            tooltip.style("display", "none");
        });

    rowGroups
        .append("text")
        .attr("x", (row) => x(row.total) + 8)
        .attr("y", bandHeight / 2)
        .attr("dominant-baseline", "middle")
        .style("fill", STACKED_BAR_CHART_COLORS.totalLabel)
        .style("font-size", "12px")
        .style("font-weight", "700")
        .text((row) => d3.format(",")(row.total));
}
