import * as d3 from "d3";

import { COLOR_BLIND_FRIENDLY_PALETTES } from "@niagads/common";
import { DisplayProps } from "./types";

export interface PieChartDataPoint {
    id: string;
    label: string;
    value: number;
}

export interface PieChartOptions {
    displayOpts?: DisplayProps;
    onClick?: (id: string) => void;
}

const PIE_COLORS = {
    arcLabel: "#333333",
    linkLabel: "#333333",
} as const;

const DEFAULT_MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };

export function pieChart(container: HTMLElement, data: PieChartDataPoint[], options: PieChartOptions = {}): void {
    // Clear existing content
    d3.select(container).selectAll("*").remove();

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

    // Radius is limited by the smaller dimension
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Create SVG
    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Create main group
    const g = svg.append("g").attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);

    // Create pie generator
    const total = d3.sum(data, (d) => d.value);
    const pie = d3.pie<PieChartDataPoint>().value((d) => d.value);

    // Create arc generator
    const arc = d3
        .arc<d3.PieArcDatum<PieChartDataPoint>>()
        .innerRadius(0)
        .outerRadius(radius - 10);

    const arcLabel = d3
        .arc<d3.PieArcDatum<PieChartDataPoint>>()
        .innerRadius(radius * 0.67)
        .outerRadius(radius * 0.67);

    // Color scale - using colorblind-friendly palette
    const colorScale = d3
        .scaleOrdinal<string, string>()
        .domain(data.map((d) => d.id))
        .range(COLOR_BLIND_FRIENDLY_PALETTES.eight_color);

    // Create tooltip
    const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("padding", "8px 12px")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("transition", "opacity 0.2s ease");

    // Create pie arcs
    const arcs = g
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .style("cursor", options.onClick ? "pointer" : "default");

    // Add paths
    arcs.append("path")
        .attr("d", arc as any)
        .attr("fill", (d) => colorScale(d.data.id))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("transition", "opacity 0.3s ease")
        .on("click", (event, d) => {
            options.onClick && options.onClick(d.data.id);
        })
        .on("mouseenter", function (event, d) {
            d3.select(this).style("opacity", 0.8);
            const percentage = ((d.data.value / total) * 100).toFixed(1);
            tooltip
                .style("opacity", 1)
                .html(`${d.data.label}<br/>${percentage}%`)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", function (event) {
            tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
        })
        .on("mouseleave", function () {
            d3.select(this).style("opacity", 1);
            tooltip.style("opacity", 0);
        });
}
