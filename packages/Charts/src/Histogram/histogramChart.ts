import * as d3 from "d3";

import { AxisConfig, DisplayProps } from "../d3/types";
import { SelectionMode, ThresholdHandle, createSelectionOverlay } from "../d3/selectionOverlay";

import { Range } from "@niagads/common";

const HISTOGRAM_COLORS = {
    bar: "#7ea7c7",
    barHover: "#5d8fb8",
    barSelected: "#d97706",
    barSelectedHover: "#b85a00",
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
    overlayData?: number[];
    binDomain?: Range; // minimum bin start, maximum bin end
    xAxis?: AxisConfig;
    displayOpts?: DisplayProps;
    selection?: {
        mode: SelectionMode;
        selectedRange?: Range; // [min, max] for highlighting bins
        thresholdHandle?: ThresholdHandle;
        onChange?: (range: Range) => void;
    };
}

export function destroyHistogram(container: HTMLElement) {
    const root = d3.select(container);
    root.select("svg").remove();
    root.select(".histogram-tooltip").remove();
}

interface HistogramState {
    hasOverflow: boolean;
    selectionOverlay?: {
        update: (selection: Range) => void;
    };
}

interface HistogramBin {
    x0: number;
    x1: number;
    baselineCount: number;
    overlayCount?: number;
    isOverflow?: boolean;
}

function getRoundedTopBarPath(xPos: number, yPos: number, width: number, height: number, radius = 2): string {
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

function buildBins(
    baselineData: number[],
    overlayData: number[] | undefined,
    opts: HistogramOptions
): {
    bins: HistogramBin[];
    binMin: number;
    binMax: number;
    binSize: number;
    dataMax: number;
    hasOverflow: boolean;
} {
    const dataMax = Math.ceil(d3.max(baselineData)!);
    const binMin = opts.xAxis?.min ?? opts.binDomain?.min ?? Math.floor(d3.min(baselineData)!);
    const binMax = opts.xAxis?.max ?? opts.binDomain?.max ?? dataMax;
    const numBins = opts.numBins || 10;
    const histogramGenerator = d3.bin<number, number>().domain([binMin, binMax]).thresholds(numBins);
    const cap = opts.xAxis?.max;

    const getBaseBins = (values: number[]) => {
        if (cap == null) {
            return histogramGenerator(values);
        }

        return histogramGenerator(values.filter((d) => d <= cap));
    };

    const baselineRawBins = getBaseBins(baselineData);
    const binSize = baselineRawBins.length > 0 ? baselineRawBins[0].x1! - baselineRawBins[0].x0! : 1;
    const baselineOverflowCount = cap == null ? 0 : baselineData.filter((d) => d > cap).length;
    const overlayOverflowCount = cap == null ? 0 : (overlayData || []).filter((d) => d > cap).length;

    const bins: HistogramBin[] = baselineRawBins.map((bin) => ({
        x0: bin.x0!,
        x1: bin.x1!,
        baselineCount: bin.length,
        overlayCount: overlayData ? 0 : undefined,
    }));

    if (overlayData) {
        const overlayRawBins = getBaseBins(overlayData);
        bins.forEach((bin, idx) => {
            bin.overlayCount = overlayRawBins[idx]?.length || 0;
        });
    }

    if (cap != null && baselineOverflowCount > 0) {
        bins.push({
            x0: cap,
            x1: cap + binSize,
            baselineCount: baselineOverflowCount,
            overlayCount: overlayData ? overlayOverflowCount : undefined,
            isOverflow: true,
        });
    }

    return {
        bins,
        binMin,
        binMax,
        binSize,
        dataMax,
        hasOverflow: cap != null && baselineOverflowCount > 0,
    };
}

export function histogram(container: HTMLElement, data: number[], opts: HistogramOptions) {
    const showOverlayLayer = !!opts.overlayData;
    const legendSpacing = showOverlayLayer ? 18 : 0;

    function isSelected(d: HistogramBin, selectedRange?: Range): boolean {
        return !!(selectedRange && d.x0 >= selectedRange.min && d.x1 <= selectedRange.max);
    }

    function applyFill(d: HistogramBin): string {
        const selected = isSelected(d, opts.selection?.selectedRange);
        if (d.isOverflow) {
            return selected ? HISTOGRAM_COLORS.barSelected : HISTOGRAM_COLORS.barOverflow;
        }
        return selected ? HISTOGRAM_COLORS.barSelected : HISTOGRAM_COLORS.bar;
    }

    function applyStroke(d: HistogramBin): string {
        const selected = isSelected(d, opts.selection?.selectedRange);

        if (d.isOverflow) {
            return selected ? HISTOGRAM_COLORS.strokeSelected : HISTOGRAM_COLORS.strokeOverflow;
        }
        return selected ? HISTOGRAM_COLORS.strokeSelected : HISTOGRAM_COLORS.stroke;
    }

    function applyStrokeWidth(d: HistogramBin): number {
        const selected = isSelected(d, opts.selection?.selectedRange);
        return selected ? 2 : 1;
    }

    function applyHoverFill(d: HistogramBin): string {
        if (isSelected(d, opts.selection?.selectedRange)) {
            return HISTOGRAM_COLORS.barSelectedHover;
        }
        if (d.isOverflow) {
            return HISTOGRAM_COLORS.barHover;
        }
        return HISTOGRAM_COLORS.barHover;
    }

    function updateSelectedRange(nextSelection?: Range) {
        opts.selection!.selectedRange = nextSelection;
        svg.selectAll<SVGPathElement, HistogramBin>(
            showOverlayLayer ? ".histogram-bar.foreground" : ".histogram-bar.background"
        )
            .data(bins, (_d, i) => i)
            .attr("fill", (d: HistogramBin) => applyFill(d))
            .attr("stroke", (d: HistogramBin) => applyStroke(d))
            .attr("stroke-width", (d: HistogramBin) => applyStrokeWidth(d));
    }

    function getBaselineBinValue(bin: HistogramBin): number {
        return bin.baselineCount;
    }

    const { bins, binMin, binMax, binSize, dataMax, hasOverflow } = buildBins(data, opts.overlayData, opts);
    const cap = opts.xAxis?.max;
    const maxBinValue = d3.max(bins, (bin) => Math.max(bin.baselineCount, bin.overlayCount ?? 0)) || 0;

    // Plotting
    // Set up dimensions
    const margin = opts.displayOpts?.margin || { top: 20, right: 24, bottom: 52, left: 44 };
    const parent = container.parentElement || container;
    const width = parent.clientWidth || 600;
    const aspectRatio = opts.displayOpts?.aspectRatio || 0.5;
    const height = parent.clientHeight || width * aspectRatio;

    // Remove previous chart nodes before drawing.
    destroyHistogram(container);

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block");

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom - legendSpacing;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top + legendSpacing})`);

    // X scale
    const x = d3.scaleLinear().domain([binMin, binMax]).range([0, plotWidth]);

    // Y scale
    const y = d3.scaleLinear().domain([0, maxBinValue]).nice().range([plotHeight, 0]);

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

    const baselineLayer = g.append("g").attr("class", "histogram-layer histogram-layer-baseline");
    const overlayLayer = g.append("g").attr("class", "histogram-layer histogram-layer-overlay");

    const baselineBar = baselineLayer
        .selectAll<SVGPathElement, HistogramBin>(".histogram-bar.background")
        .data(bins, (_d, i) => i)
        .join(
            (enter) =>
                enter
                    .append("path")
                    .attr("class", "histogram-bar background")
                    .attr("d", (d: HistogramBin) =>
                        getRoundedTopBarPath(
                            x(d.x0),
                            y(getBaselineBinValue(d)),
                            Math.max(0, x(d.x1) - x(d.x0) - 1),
                            plotHeight - y(getBaselineBinValue(d))
                        )
                    )
                    .attr("fill", showOverlayLayer ? "#d6dde6" : (d: HistogramBin) => applyFill(d))
                    .attr("stroke", showOverlayLayer ? "#bcc8d4" : (d: HistogramBin) => applyStroke(d))
                    .attr("stroke-width", showOverlayLayer ? 1 : (d: HistogramBin) => applyStrokeWidth(d))
                    .attr("opacity", showOverlayLayer ? 0.7 : 0.92),
            (update) =>
                update
                    .attr("d", (d: HistogramBin) =>
                        getRoundedTopBarPath(
                            x(d.x0),
                            y(getBaselineBinValue(d)),
                            Math.max(0, x(d.x1) - x(d.x0) - 1),
                            plotHeight - y(getBaselineBinValue(d))
                        )
                    )
                    .attr("fill", showOverlayLayer ? "#d6dde6" : (d: HistogramBin) => applyFill(d))
                    .attr("stroke", showOverlayLayer ? "#bcc8d4" : (d: HistogramBin) => applyStroke(d))
                    .attr("stroke-width", showOverlayLayer ? 1 : (d: HistogramBin) => applyStrokeWidth(d))
        );

    const overlayBar = overlayLayer
        .selectAll<SVGPathElement, HistogramBin>(".histogram-bar.foreground")
        .data(showOverlayLayer ? bins : [], (_d, i) => i)
        .join(
            (enter) =>
                enter
                    .append("path")
                    .attr("class", "histogram-bar foreground")
                    .attr("d", (d: HistogramBin) =>
                        getRoundedTopBarPath(
                            x(d.x0),
                            y(d.overlayCount ?? 0),
                            Math.max(0, x(d.x1) - x(d.x0) - 1),
                            plotHeight - y(d.overlayCount ?? 0)
                        )
                    )
                    .attr("fill", (d: HistogramBin) => applyFill(d))
                    .attr("stroke", (d: HistogramBin) => applyStroke(d))
                    .attr("stroke-width", (d: HistogramBin) => applyStrokeWidth(d))
                    .attr("opacity", 0.95),
            (update) =>
                update
                    .attr("d", (d: HistogramBin) =>
                        getRoundedTopBarPath(
                            x(d.x0),
                            y(d.overlayCount ?? 0),
                            Math.max(0, x(d.x1) - x(d.x0) - 1),
                            plotHeight - y(d.overlayCount ?? 0)
                        )
                    )
                    .attr("fill", (d: HistogramBin) => applyFill(d))
                    .attr("stroke", (d: HistogramBin) => applyStroke(d))
                    .attr("stroke-width", (d: HistogramBin) => applyStrokeWidth(d))
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

    const hoverSelection = showOverlayLayer ? overlayBar : baselineBar;
    hoverSelection
        .on("mousemove", function (event, d) {
            d3.select(this).attr("fill", applyHoverFill(d)).attr("opacity", 1);
            const activeCount = showOverlayLayer ? (d.overlayCount ?? 0) : d.baselineCount;
            const activeTotal = showOverlayLayer ? opts.overlayData!.length : data.length;
            const freq = activeTotal > 0 ? ((activeCount / activeTotal) * 100).toFixed(1) : "0.0";
            const lastRegularBinIdx = hasOverflow ? bins.length - 2 : bins.length - 1;

            let binLabel: string;
            if (hasOverflow && d.x0 === cap) {
                binLabel = `> ${cap.toFixed(1)}`;
            } else if (d === bins[lastRegularBinIdx]) {
                binLabel = `[${d.x0.toFixed(1)}, ${d.x1.toFixed(1)}]`;
            } else {
                binLabel = `[${d.x0.toFixed(1)}, ${d.x1.toFixed(1)})`;
            }

            const countHtml = showOverlayLayer
                ? `<strong>Count</strong>: ${d.overlayCount ?? 0}<br>`
                : `<strong>Count</strong>: ${d.baselineCount}<br>`;

            tooltip
                .style("display", "block")
                .html(countHtml + `<strong>Percent</strong>: ${freq}%<br>` + `<strong>Range</strong>: ${binLabel}`)
                .style("left", event.offsetX + 20 + "px")
                .style("top", event.offsetY - 10 + "px");
        })
        .on("mouseleave", function (_event, d) {
            d3.select(this)
                .attr("fill", applyFill(d))
                .attr("opacity", showOverlayLayer ? 0.95 : 0.92);
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

    if (showOverlayLayer) {
        const legend = svg
            .append("g")
            .attr("class", "histogram-legend")
            .attr("transform", `translate(${margin.left},8)`);

        [
            { label: "All Records", fill: "#d6dde6", stroke: "#bcc8d4" },
            { label: "Displayed Records", fill: HISTOGRAM_COLORS.bar, stroke: HISTOGRAM_COLORS.stroke },
        ].forEach((item, idx) => {
            const legendItem = legend.append("g").attr("transform", `translate(${idx * 92},0)`);
            legendItem
                .append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("rx", 2)
                .attr("fill", item.fill)
                .attr("stroke", item.stroke);
            legendItem
                .append("text")
                .attr("x", 18)
                .attr("y", 10)
                .style("font-size", "11px")
                .style("fill", HISTOGRAM_COLORS.label)
                .text(item.label);
        });
    }

    let selectionOverlay: HistogramState["selectionOverlay"];
    if (opts.selection) {
        const selectionRange = opts.selection.selectedRange;
        if (selectionRange) {
            selectionOverlay = createSelectionOverlay({
                root: g,
                xScale: x,
                plotHeight,
                domain: {
                    min: binMin,
                    max: hasOverflow ? cap! + binSize : binMax,
                },
                selection: selectionRange,
                mode: opts.selection.mode,
                step: binSize,
                thresholdHandle: opts.selection.thresholdHandle,
                onChange: (nextSelection) => {
                    const dataAccurateSelection =
                        hasOverflow && cap != null && nextSelection.max >= cap
                            ? { min: nextSelection.min, max: dataMax }
                            : nextSelection;
                    updateSelectedRange(nextSelection);
                    opts.selection?.onChange?.(dataAccurateSelection);
                },
            });

            updateSelectedRange(selectionRange);
        }
    }

    // Store state on SVG node for later updates
    (svg.node() as any).__histogramState__ = {
        selectionOverlay,
    } as HistogramState;

    return binSize;
}
