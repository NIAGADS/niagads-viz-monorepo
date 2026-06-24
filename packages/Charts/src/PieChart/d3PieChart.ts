import * as d3 from "d3";

import { _isNA } from "@niagads/common";

import { DisplayProps } from "../d3/types";

export interface PieChartDataPoint {
    id: string;
    label?: string;
    value: number;
}

export interface PieChartOptions {
    displayOpts?: DisplayProps;
    referenceData?: PieChartDataPoint[];
    onClick?: (id: string) => void;
    preserveSliceOrder?: boolean;
    selectedId?: string;
}

export const NA_COLOR = "#a1a2a4ff";

const PIE_CHART_COLORS = {
    arcStroke: "white",
    arcStrokeWidth: 2,
    arcStrokeWidthSelected: 4,
    arcOpacity: 1,
    arcOpacityHover: 0.8,
    arcOpacitySelected: 1,
    referenceArcOpacity: 0.55,
    tooltipBackground: "white",
    tooltipColor: "black",
    tooltipBorder: "0 2px 8px rgba(0, 0, 0, 0.15)",
    badgeTextLight: "white",
    badgeTextDark: "black",
    arcFillNA: NA_COLOR,
} as const;

const PIE_CHART_SIZES = {
    arcStrokeWidthDefault: 2,
    arcStrokeWidthSelectedDefault: 4,
    arcTranslateOffset: 12,
    arcTransitionDurationMs: 150,
    tooltipPadding: "8px 12px",
    tooltipBorderRadius: "4px",
    tooltipFontSize: "12px",
} as const;

const DEFAULT_MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };

const isNA = (data: PieChartDataPoint): boolean => (data.label && _isNA(data.label)) || _isNA(data.id);

const getSliceColor = (data: PieChartDataPoint, colorScale: d3.ScaleOrdinal<string, string>): string =>
    isNA(data) ? PIE_CHART_COLORS.arcFillNA : colorScale(data.id);

const hexToRgb = (color: string): { r: number; g: number; b: number } | null => {
    const normalized = color.trim();
    const hexMatch = normalized.match(/^#([\da-f]{3}|[\da-f]{6})$/i);

    if (!hexMatch) return null;

    const hex = hexMatch[1];
    const expandedHex = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
    const value = Number.parseInt(expandedHex, 16);

    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
};

const getSelectionFilter = (color: string): string => {
    const rgb = hexToRgb(color);
    if (!rgb) return "none";

    return [
        `drop-shadow(0 0 3px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8))`,
        `drop-shadow(0 0 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6))`,
        `drop-shadow(0 0 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4))`,
    ].join(" ");
};

const getSelectionTransform = (arc: d3.PieArcDatum<PieChartDataPoint>, isSelected: boolean): string => {
    if (!isSelected) return "translate(0,0)";

    const angle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
    const offsetX = Math.cos(angle) * PIE_CHART_SIZES.arcTranslateOffset;
    const offsetY = Math.sin(angle) * PIE_CHART_SIZES.arcTranslateOffset;

    return `translate(${offsetX},${offsetY})`;
};

interface PieChartState {
    data: PieChartDataPoint[];
    opts: PieChartOptions;
    colorScale: d3.ScaleOrdinal<string, string>;
    total: number;
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
}

const showTooltip = (
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
    event: MouseEvent,
    data: PieChartDataPoint,
    total: number,
    sliceColor: string
): void => {
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : "0.0";

    tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .style("display", "block")
        .style("border-color", sliceColor)
        .html("");

    tooltip.append("div").style("margin-bottom", "8px").html(`<strong>${data.label || data.id}</strong>: ${percentage}%`);
    tooltip.append("div").html(`${data.value} records`);
};

const getCombinedData = (data: PieChartDataPoint[], referenceData?: PieChartDataPoint[]): PieChartDataPoint[] => {
    const combinedData = new Map<string, PieChartDataPoint>();

    referenceData?.forEach((d) => combinedData.set(d.id, d));
    data.forEach((d) => {
        if (!combinedData.has(d.id)) {
            combinedData.set(d.id, d);
        }
    });

    return Array.from(combinedData.values());
};

export function updatePieChartSelection(container: HTMLElement, selectedId?: string): void {
    const svg = d3.select(container).select<SVGSVGElement>("svg");
    const state = (svg.node() as any).__pieChartState__ as PieChartState | undefined;

    if (!state) return;

    // Update stored selection state
    state.opts.selectedId = selectedId;

    const transition = svg.transition().duration(PIE_CHART_SIZES.arcTransitionDurationMs);

    svg.selectAll<SVGGElement, d3.PieArcDatum<PieChartDataPoint>>(".arc")
        .transition(transition as any)
        .attr("transform", (d: d3.PieArcDatum<PieChartDataPoint>) => getSelectionTransform(d, d.data.id === selectedId));

    svg.selectAll<SVGPathElement, d3.PieArcDatum<PieChartDataPoint>>(".arc path")
        .transition(transition as any)
        .style("fill", (d: d3.PieArcDatum<PieChartDataPoint>) => getSliceColor(d.data, state.colorScale))
        .style("stroke-width", (d: d3.PieArcDatum<PieChartDataPoint>) =>
            d.data.id === selectedId ? PIE_CHART_COLORS.arcStrokeWidthSelected : PIE_CHART_COLORS.arcStrokeWidth
        )
        .style("filter", (d: d3.PieArcDatum<PieChartDataPoint>) =>
            d.data.id === selectedId ? getSelectionFilter(getSliceColor(d.data, state.colorScale)) : "none"
        );
}

export function destroyPieChart(container: HTMLElement): void {
    const svg = d3.select(container).select<SVGSVGElement>("svg");
    const state = (svg.node() as any)?.__pieChartState__ as PieChartState | undefined;

    state?.tooltip.remove();
    svg.remove();
}

export function pieChart(container: HTMLElement, data: PieChartDataPoint[], options: PieChartOptions = {}): void {
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
    const hasReferenceData = !!options.referenceData?.length;
    const referenceTotal = d3.sum(options.referenceData || [], (d) => d.value);

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
    if (options.preserveSliceOrder) {
        pie.sort(null);
    }

    // Create arc generator
    const arc = d3
        .arc<d3.PieArcDatum<PieChartDataPoint>>()
        .innerRadius(0)
        .outerRadius(hasReferenceData ? radius * 0.66 : radius - 10);

    const referenceArc = d3
        .arc<d3.PieArcDatum<PieChartDataPoint>>()
        .innerRadius(radius * 0.7)
        .outerRadius(radius - 10);

    // Color scale - using default D3 palette
    const colorScale = d3
        .scaleOrdinal<string, string>()
        .domain(getCombinedData(data, options.referenceData).map((d) => d.id))
        .range(d3.schemeCategory10);

    // Create tooltip
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "pie-tooltip")
        .style("position", "absolute")
        .style("background-color", PIE_CHART_COLORS.tooltipBackground)
        .style("color", PIE_CHART_COLORS.tooltipColor)
        .style("padding", PIE_CHART_SIZES.tooltipPadding)
        .style("border-radius", PIE_CHART_SIZES.tooltipBorderRadius)
        .style("box-shadow", PIE_CHART_COLORS.tooltipBorder)
        .style("font-size", PIE_CHART_SIZES.tooltipFontSize)
        .style("pointer-events", "none")
        .style("z-index", "1000")
        .style("display", "none")
        .style("text-align", "left")
        .style("border", "2px solid transparent");

    if (hasReferenceData && options.referenceData) {
        const referenceArcs = g
            .selectAll(".reference-arc")
            .data(pie(options.referenceData))
            .enter()
            .append("g")
            .attr("class", "reference-arc");

        referenceArcs
            .append("path")
            .attr("d", referenceArc as any)
            .attr("fill", (d) => getSliceColor(d.data, colorScale))
            .style("stroke", PIE_CHART_COLORS.arcStroke)
            .style("stroke-width", PIE_CHART_COLORS.arcStrokeWidth)
            .style("opacity", PIE_CHART_COLORS.referenceArcOpacity)
            .on("mouseenter", (event: MouseEvent, d: d3.PieArcDatum<PieChartDataPoint>) => {
                const path = d3.select(event.currentTarget as SVGPathElement);
                path.style("opacity", PIE_CHART_COLORS.arcOpacityHover.toString());

                const sliceColor = isNA(d.data) ? PIE_CHART_COLORS.arcFillNA : colorScale(d.data.id);
                showTooltip(tooltip, event, d.data, referenceTotal, sliceColor);
            })
            .on("mouseleave", (event: MouseEvent) => {
                const path = d3.select(event.currentTarget as SVGPathElement);
                path.style("opacity", PIE_CHART_COLORS.referenceArcOpacity.toString());
                tooltip.style("display", "none");
            });
    }

    // Create pie arcs
    const arcs = g
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", (d) => (options.onClick ? "arc arc-clickable" : "arc"));

    // Add paths
    arcs.append("path")
        .attr("d", arc as any)
        .attr("fill", (d) => getSliceColor(d.data, colorScale))
        .style("stroke", PIE_CHART_COLORS.arcStroke)
        .style("stroke-width", PIE_CHART_COLORS.arcStrokeWidth)
        .on("click", (event, d) => {
            const newSelectedId = d.data.id === options.selectedId ? undefined : d.data.id;
            options.onClick && options.onClick(newSelectedId || "");
        })
        .on("mouseenter", (event: MouseEvent, d: d3.PieArcDatum<PieChartDataPoint>) => {
            const path = d3.select(event.currentTarget as SVGPathElement);
            path.style("opacity", PIE_CHART_COLORS.arcOpacityHover.toString());

            const sliceColor = isNA(d.data) ? PIE_CHART_COLORS.arcFillNA : colorScale(d.data.id);
            showTooltip(tooltip, event, d.data, total, sliceColor);
        })
        .on("mouseleave", (event: MouseEvent) => {
            const path = d3.select(event.currentTarget as SVGPathElement);
            path.style("opacity", PIE_CHART_COLORS.arcOpacity.toString());
            tooltip.style("display", "none");
        });

    // Store state on SVG node for later updates
    (svg.node() as any).__pieChartState__ = {
        data,
        opts: options,
        colorScale,
        total,
        tooltip,
    } as PieChartState;

    // Apply initial selection styling if selectedId is provided
    updatePieChartSelection(container, options.selectedId);
}
