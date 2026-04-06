import * as d3 from "d3";

import { AxisConfig, DisplayProps } from "./types";

const HISTOGRAM_COLORS = {
    bar: "#7ea7c7",
    barHover: "#5d8fb8",
    barSelected: "#d97706",
    barOverflow: "#c58a9f",
    stroke: "#587894",
    strokeSelected: "#a65b00",
    strokeOverflow: "#9d6578",
    axis: "#5f6b7a",
    grid: "#d9e2ec",
    label: "#2f3a45",
    tooltipBorder: "#c7d2df",
    tooltipShadow: "0 10px 24px rgba(33, 43, 54, 0.14)",
    background: "#fbfdff",
} as const;

export interface HistogramOptions {
    numBins: number;
    xAxis?: AxisConfig;
    displayOpts?: DisplayProps;
    selectedRange?: number[]; // [min, max] for highlighting bins
}

interface HistogramState {
    bins: d3.Bin<number, number>[];
    opts: HistogramOptions;
    x: d3.ScaleLinear<number, number>;
}

function isSelected(d: d3.Bin<number, number>, selectedRange?: number[]): boolean {
    return !!(
        selectedRange &&
        selectedRange.length >= 1 &&
        d.x0! >= selectedRange[0] &&
        (selectedRange.length === 1 || d.x1! <= selectedRange[1])
    );
}

function applyFill(d: d3.Bin<number, number>, opts: HistogramOptions): string {
    const selected = isSelected(d, opts.selectedRange);
    if (d.x0 === opts.xAxis?.max) {
        return selected ? HISTOGRAM_COLORS.barSelected : HISTOGRAM_COLORS.barOverflow;
    }
    return selected ? HISTOGRAM_COLORS.barSelected : HISTOGRAM_COLORS.bar;
}

function applyStroke(d: d3.Bin<number, number>, opts: HistogramOptions): string {
    const selected = isSelected(d, opts.selectedRange);

    if (d.x0 === opts.xAxis?.max) {
        return selected ? HISTOGRAM_COLORS.strokeSelected : HISTOGRAM_COLORS.strokeOverflow;
    }
    return selected ? HISTOGRAM_COLORS.strokeSelected : HISTOGRAM_COLORS.stroke;
}

function applyStrokeWidth(d: d3.Bin<number, number>, opts: HistogramOptions): number {
    const selected = isSelected(d, opts.selectedRange);
    return selected ? 2 : 1;
}

function applyHoverFill(d: d3.Bin<number, number>, opts: HistogramOptions): string {
    if (isSelected(d, opts.selectedRange)) {
        return HISTOGRAM_COLORS.barSelected;
    }
    if (d.x0 === opts.xAxis?.max) {
        return HISTOGRAM_COLORS.strokeOverflow;
    }
    return HISTOGRAM_COLORS.barHover;
}

function getRoundedTopBarPath(xPos: number, yPos: number, width: number, height: number, radius = 4): string {
    const safeWidth = Math.max(0, width);
    const safeHeight = Math.max(0, height);
    const cappedRadius = Math.min(radius, safeWidth / 2, safeHeight);

    if (safeWidth === 0 || safeHeight === 0) {
        return `M${xPos},${yPos + safeHeight}Z`;
    }

    if (cappedRadius === 0) {
        return [
            `M${xPos},${yPos + safeHeight}`,
            `L${xPos},${yPos}`,
            `L${xPos + safeWidth},${yPos}`,
            `L${xPos + safeWidth},${yPos + safeHeight}`,
            "Z",
        ].join(" ");
    }

    return [
        `M${xPos},${yPos + safeHeight}`,
        `L${xPos},${yPos + cappedRadius}`,
        `Q${xPos},${yPos} ${xPos + cappedRadius},${yPos}`,
        `L${xPos + safeWidth - cappedRadius},${yPos}`,
        `Q${xPos + safeWidth},${yPos} ${xPos + safeWidth},${yPos + cappedRadius}`,
        `L${xPos + safeWidth},${yPos + safeHeight}`,
        "Z",
    ].join(" ");
}

export function histogram(container: HTMLElement, data: number[], opts: HistogramOptions) {
    // Helper to get bin value (count)
    function getBinValue(bin: d3.Bin<number, number>): number {
        return bin.length;
    }

    // Calculate min and max
    const binMin = opts.xAxis?.min || d3.min(data);
    const binMax = opts.xAxis?.max || d3.max(data);

    // Set up bins
    const numBins = opts.numBins || 10;
    const histogramGenerator = d3.bin().domain([binMin!, binMax!]).thresholds(numBins);

    let bins: d3.Bin<number, number>[] = [];
    let binSize: number | undefined = undefined;

    if (opts.xAxis?.max !== undefined) {
        // Split data into normal and overflow
        const cap = opts.xAxis.max;
        const cappedData = data.filter((d) => d <= cap);
        const overflowData = data.filter((d) => d > cap);
        bins = histogramGenerator(cappedData);
        if (bins.length > 0) {
            binSize = bins[0].x1! - bins[0].x0!;
        }
        if (overflowData.length > 0) {
            // Create overflow bin matching d3.bin structure
            const overflowBin = Object.assign(overflowData, {
                x0: cap,
                x1: cap + (binSize || 1),
                length: overflowData.length,
            });
            bins.push(overflowBin as d3.Bin<number, number>);
        }
    } else {
        bins = histogramGenerator(data);
        if (bins.length > 0) {
            binSize = bins[0].x1! - bins[0].x0!;
        }
    }
    // Plotting
    // Set up dimensions
    const margin = opts.displayOpts?.margin || { top: 20, right: 24, bottom: 52, left: 44 };
    const parent = container.parentElement || container;
    const width = parent.clientWidth || 600;
    const aspectRatio = opts.displayOpts?.aspectRatio || 0.5;
    const height = parent.clientHeight || width * aspectRatio;

    // Remove previous SVG if exists
    d3.select(container).select("svg").remove();

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("background", HISTOGRAM_COLORS.background);

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleLinear().domain([binMin!, binMax!]).range([0, plotWidth]);

    // Y scale
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, getBinValue)!])
        .nice()
        .range([plotHeight, 0]);

    g.append("g")
        .attr("class", "histogram-grid")
        .call(
            d3
                .axisLeft(y)
                .ticks(4)
                .tickSize(-plotWidth)
                .tickFormat(() => "")
        )
        .call((grid) => {
            grid.select(".domain").remove();
            grid.selectAll(".tick line").attr("stroke", HISTOGRAM_COLORS.grid).attr("stroke-dasharray", "3 4");
        });

    // Bars
    const bar = g
        .selectAll<SVGPathElement, d3.Bin<number, number>>(".histogram-bar")
        .data(bins, (_d, i) => i)
        .join(
            (enter) =>
                enter
                    .append("path")
                    .attr("class", "histogram-bar")
                    .attr("d", (d: d3.Bin<number, number>) =>
                        getRoundedTopBarPath(
                            x(d.x0!),
                            y(getBinValue(d)),
                            Math.max(0, x(d.x1!) - x(d.x0!) - 1),
                            plotHeight - y(getBinValue(d))
                        )
                    )
                    .attr("fill", (d: d3.Bin<number, number>) => applyFill(d, opts))
                    .attr("stroke", (d: d3.Bin<number, number>) => applyStroke(d, opts))
                    .attr("stroke-width", (d: d3.Bin<number, number>) => applyStrokeWidth(d, opts))
                    .attr("opacity", 0.92),
            (update) =>
                update
                    .attr("d", (d: d3.Bin<number, number>) =>
                        getRoundedTopBarPath(
                            x(d.x0!),
                            y(getBinValue(d)),
                            Math.max(0, x(d.x1!) - x(d.x0!) - 1),
                            plotHeight - y(getBinValue(d))
                        )
                    )
                    .attr("fill", (d: d3.Bin<number, number>) => applyFill(d, opts))
                    .attr("stroke", (d: d3.Bin<number, number>) => applyStroke(d, opts))
                    .attr("stroke-width", (d: d3.Bin<number, number>) => applyStrokeWidth(d, opts))
        );

    // Tooltip div
    let tooltip = d3.select(container).select<HTMLDivElement>(".histogram-tooltip");
    if (tooltip.empty()) {
        tooltip = d3
            .select(container)
            .append<HTMLDivElement>("div")
            .attr("class", "histogram-tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background", "rgba(255,255,255,0.95)")
            .style("border", `1px solid ${HISTOGRAM_COLORS.tooltipBorder}`)
            .style("padding", "8px 10px")
            .style("border-radius", "8px")
            .style("font-size", "12px")
            .style("line-height", "1.45")
            .style("color", HISTOGRAM_COLORS.label)
            .style("box-shadow", HISTOGRAM_COLORS.tooltipShadow)
            .style("display", "none");
    }

    bar.on("mousemove", function (event, d) {
        d3.select(this).attr("fill", applyHoverFill(d, opts)).attr("opacity", 1);
        const cap = opts.xAxis?.max;
        const freq = ((d.length / data.length) * 100).toFixed(1);
        const hasOverflow = cap !== undefined && bins.length > 0 && bins[bins.length - 1].x0 === cap;
        const lastRegularBinIdx = hasOverflow ? bins.length - 2 : bins.length - 1;

        let binLabel: string;
        if (hasOverflow && d.x0! === cap) {
            binLabel = `> ${cap.toFixed(1)}`;
        } else if (d === bins[lastRegularBinIdx]) {
            binLabel = `[${d.x0?.toFixed(1)}, ${d.x1?.toFixed(1)}]`;
        } else {
            binLabel = `[${d.x0?.toFixed(1)}, ${d.x1?.toFixed(1)})`;
        }

        tooltip
            .style("display", "block")
            .html(
                `<strong>Count</strong>: ${d.length}<br>` +
                    `<strong>Percent</strong>: ${freq}%<br>` +
                    `<strong>Range</strong>: ${binLabel}`
            )
            .style("left", event.offsetX + 20 + "px")
            .style("top", event.offsetY - 10 + "px");
    }).on("mouseleave", function (_event, d) {
        d3.select(this).attr("fill", applyFill(d, opts)).attr("opacity", 0.92);
        tooltip.style("display", "none");
    });

    // X Axis
    g.append("g")
        .attr("class", "histogram-axis")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(d3.axisBottom(x))
        .call((axis) => {
            axis.select(".domain").attr("stroke", HISTOGRAM_COLORS.axis).attr("stroke-width", 1);
            axis.selectAll(".tick line").attr("stroke", HISTOGRAM_COLORS.axis);
            axis.selectAll(".tick text").style("font-size", "12px").style("fill", HISTOGRAM_COLORS.axis);
        });

    // X Label

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 12)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .style("fill", HISTOGRAM_COLORS.label)
        .text(opts.xAxis?.label || "");

    // Store state on SVG node for later updates
    (svg.node() as any).__histogramState__ = {
        bins,
        opts,
        x,
    } as HistogramState;

    return binSize;
}

export function updateHistogramHighlight(container: HTMLElement, selectedRange?: number[]) {
    const svg = d3.select(container).select<SVGSVGElement>("svg");
    const state = (svg.node() as any).__histogramState__ as HistogramState | undefined;

    if (!state) return;

    // Update bars with new selected range
    svg.selectAll<SVGPathElement, d3.Bin<number, number>>(".histogram-bar")
        .data(state.bins, (_d, i) => i)
        .attr("fill", (d: d3.Bin<number, number>) => applyFill(d, { ...state.opts, selectedRange }))
        .attr("stroke", (d: d3.Bin<number, number>) => applyStroke(d, { ...state.opts, selectedRange }))
        .attr("stroke-width", (d: d3.Bin<number, number>) => applyStrokeWidth(d, { ...state.opts, selectedRange }));
}
