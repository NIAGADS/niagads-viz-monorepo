import * as d3 from "d3";

import { COLOR_BLIND_FRIENDLY_PALETTES, _isNA } from "@niagads/common";

import { DisplayProps } from "../d3/types";
import { StackedBarChartDataRow, StackedBarChartValue } from "./StackedBarChart";

export interface StackedBarChartOptions {
    displayOpts?: DisplayProps;
    onClick?: (id: string) => void;
    selectedLabel?: string;
}

export const NA_COLOR = "#a1a2a4ff";

const STACKED_BAR_CHART_COLORS = {
    arcStroke: "white",
    arcStrokeWidth: 2,
    arcStrokeWidthSelected: 4,
    arcOpacity: 1,
    arcOpacityHover: 0.8,
    arcOpacitySelected: 1,
    arcFillSelected: "#d97706",
    arcFilterSelected:
        "drop-shadow(0 0 3px rgba(217, 119, 6, 0.8)) drop-shadow(0 0 8px rgba(217, 119, 6, 0.6)) drop-shadow(0 0 12px rgba(217, 119, 6, 0.4))",
    tooltipBackground: "white",
    tooltipColor: "black",
    tooltipBorder: "0 2px 8px rgba(0, 0, 0, 0.15)",
    badgeTextLight: "white",
    badgeTextDark: "black",
    arcFillNA: NA_COLOR,
} as const;

const STACKED_BAR_CHART_SIZES = {
    arcStrokeWidthDefault: 2,
    arcStrokeWidthSelectedDefault: 4,
    tooltipPadding: "8px 12px",
    tooltipBorderRadius: "4px",
    tooltipFontSize: "12px",
} as const;

const DEFAULT_MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };

const isNA = (data: StackedBarChartValue): boolean => _isNA(data.label);

interface StackedBarChartState {
    data: StackedBarChartDataRow[];
    opts: StackedBarChartOptions;
    colorScale: d3.ScaleOrdinal<string, string>;
    total: number;
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
}

export function updateStackedBarChartSelection(container: HTMLElement, selectedLabel?: string): void {
    const svg = d3.select(container).select<SVGSVGElement>("svg");
    const state = (svg.node() as any).__stackedBarChartState__ as StackedBarChartState | undefined;

    if (!state) return;

    // Update stored selection state
    state.opts.selectedLabel = selectedLabel;

    svg.selectAll<SVGPathElement, d3.PieArcDatum<StackedBarChartValue>>(".arc path")
        .style("fill", (d: d3.PieArcDatum<StackedBarChartValue>) => {
            return d.data.label === selectedLabel
                ? STACKED_BAR_CHART_COLORS.arcFillSelected
                : isNA(d.data)
                  ? STACKED_BAR_CHART_COLORS.arcFillNA
                  : state.colorScale(d.data.label);
        })
        .style("stroke-width", (d: d3.PieArcDatum<StackedBarChartValue>) =>
            d.data.label === selectedLabel
                ? STACKED_BAR_CHART_COLORS.arcStrokeWidthSelected
                : STACKED_BAR_CHART_COLORS.arcStrokeWidth
        )
        .style("filter", (d: d3.PieArcDatum<StackedBarChartValue>) =>
            d.data.label === selectedLabel ? STACKED_BAR_CHART_COLORS.arcFilterSelected : "none"
        );
}

export function destroyStackedBarChart(container: HTMLElement): void {
    const svg = d3.select(container).select<SVGSVGElement>("svg");
    const state = (svg.node() as any)?.__pieChartState__ as StackedBarChartState | undefined;

    state?.tooltip.remove();
    svg.remove();
}

export function stackedBarChart(
    container: HTMLElement,
    data: StackedBarChartDataRow[],
    options: StackedBarChartOptions = {}
): void {
    const displayOpts = options.displayOpts || {};
    const margin = displayOpts.margin || DEFAULT_MARGIN;

    // Get dimensions from displayOpts or use defaults
    const width = displayOpts.width || 300;
    const aspectRatio = displayOpts.aspectRatio || 1;
    const height = width * aspectRatio;

    // Use specified dimensions
    const svgWidth = width;
    const svgHeight = height;

    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;

    const total = d3.sum(data, (d) => d3.sum(d.values, (v) => v.value));

    const flattenedData = data.reduce(
        (prev, cur) => {
            return [
                ...prev,
                {
                    label: cur.label || cur.id,
                    ...cur.values.reduce((prev, cur) => ({ ...prev, [cur.label]: cur.value }), {}),
                },
            ];
        },
        [] as Record<string, any>[]
    );

    console.log(flattenedData);

    const stackedData = d3.stack().keys(Object.keys(flattenedData[0]).filter((x) => x !== "label"))(flattenedData);

    console.log(stackedData);

    const maxBarHeight = d3.max(flattenedData, d => Object.entries(d).reduce((prev, [key, val]) => key === "label" ? prev : prev + val, 0))!

    // Create SVG
    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Create main group
    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.right})`);

    // x and y scales
    const x = d3.scaleBand()
        .rangeRound([margin.left, innerWidth])
        .padding(0.2)
        .domain(flattenedData.map((d) => d.label));

    const y = d3.scaleLinear()
        .rangeRound([innerHeight, 0])
        .domain([0, maxBarHeight + 2]).nice();

    // draw axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, ${innerWidth})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))

    // colors
    const colorScale = d3
        .scaleOrdinal<string, string>()
        .domain(Object.keys(flattenedData[0]).filter((x) => x !== "label"))
        .range(COLOR_BLIND_FRIENDLY_PALETTES.eight_color);

    // draw bars
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", (d) => colorScale(d.key))
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => x(`${d.data.label}`)!)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    // Create tooltip
    // const tooltip = d3
    //     .select("body")
    //     .append("div")
    //     .attr("class", "pie-tooltip")
    //     .style("position", "absolute")
    //     .style("background-color", STACKED_BAR_CHART_COLORS.tooltipBackground)
    //     .style("color", STACKED_BAR_CHART_COLORS.tooltipColor)
    //     .style("padding", STACKED_BAR_CHART_SIZES.tooltipPadding)
    //     .style("border-radius", STACKED_BAR_CHART_SIZES.tooltipBorderRadius)
    //     .style("box-shadow", STACKED_BAR_CHART_COLORS.tooltipBorder)
    //     .style("font-size", STACKED_BAR_CHART_SIZES.tooltipFontSize)
    //     .style("pointer-events", "none")
    //     .style("z-index", "1000")
    //     .style("display", "none")
    //     .style("text-align", "left")
    //     .style("border", "2px solid transparent");

    // Store state on SVG node for later updates
    (svg.node() as any).__pieChartState__ = {
        data,
        opts: options,
        colorScale,
        total,
        //tooltip,
    } as StackedBarChartState;

    // Apply initial selection styling if selectedLabel is provided
    updateStackedBarChartSelection(container, options.selectedLabel);
}
