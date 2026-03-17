import * as d3 from "d3";

export interface HistogramOptions {
    numBins: number;
    xMin?: number;
    xMax?: number;
    xLabel: string;
    aspectRatio?: number; // height = width * aspectRatio
    margin?: { top: number; right: number; bottom: number; left: number };
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

    if (opts.xMax !== undefined && d.x0 === opts.xMax) {
        return selected ? "#FF8C00" : "#ffb6c1"; // dark orange if selected, light pink otherwise
    }
    return selected ? "#FFA500" : "#b0c4de"; // orange if selected, light steel blue otherwise
}

function applyStroke(d: d3.Bin<number, number>, opts: HistogramOptions): string {
    const selected = isSelected(d, opts.selectedRange);

    if (opts.xMax !== undefined && d.x0 === opts.xMax) {
        return selected ? "#CC6600" : "#ff69b4"; // darker orange if selected, hot pink otherwise
    }
    return selected ? "#CC6600" : "steelblue"; // darker orange if selected, steelblue otherwise
}

function applyStrokeWidth(d: d3.Bin<number, number>, opts: HistogramOptions): number {
    const selected = isSelected(d, opts.selectedRange);
    return selected ? 2.5 : 1.5; // thicker stroke when selected
}

export function histogram(container: HTMLElement, data: number[], opts: HistogramOptions) {
    // Helper to get bin value (count)
    function getBinValue(bin: d3.Bin<number, number>): number {
        return bin.length;
    }

    // Calculate min and max
    const binMin = opts.xMin || d3.min(data);
    const binMax = opts.xMax || d3.max(data);

    // Set up bins
    const numBins = opts.numBins || 10;
    const histogramGenerator = d3.bin().domain([binMin!, binMax!]).thresholds(numBins);

    let bins: d3.Bin<number, number>[] = [];
    let binSize: number | undefined = undefined;

    if (opts.xMax !== undefined) {
        // Split data into normal and overflow
        const cappedData = data.filter((d) => d <= opts.xMax!);
        const overflowData = data.filter((d) => d > opts.xMax!);
        bins = histogramGenerator(cappedData);
        if (bins.length > 0) {
            binSize = bins[0].x1! - bins[0].x0!;
        }
        if (overflowData.length > 0) {
            // Create overflow bin matching d3.bin structure
            const overflowBin = Object.assign(overflowData, {
                x0: opts.xMax!,
                x1: opts.xMax! + (binSize || 1),
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
    const margin = opts.margin || { top: 20, right: 30, bottom: 40, left: 40 };
    const parent = container.parentElement || container;
    const width = parent.clientWidth || 600;
    const aspectRatio = opts.aspectRatio || 0.5;
    const height = parent.clientHeight || width * aspectRatio;

    // Remove previous SVG if exists
    d3.select(container).select("svg").remove();

    const svg = d3.select(container).append("svg").attr("width", width).attr("height", height);

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

    // Bars
    const bar = g
        .selectAll<SVGRectElement, d3.Bin<number, number>>("rect")
        .data(bins, (_d, i) => i)
        .join(
            (enter) =>
                enter
                    .append("rect")
                    .attr("x", (d: d3.Bin<number, number>) => x(d.x0!))
                    .attr("y", (d: d3.Bin<number, number>) => y(getBinValue(d)))
                    .attr("width", (d: d3.Bin<number, number>) => x(d.x1!) - x(d.x0!))
                    .attr("height", (d: d3.Bin<number, number>) => plotHeight - y(getBinValue(d)))
                    .attr("fill", (d: d3.Bin<number, number>) => applyFill(d, opts))
                    .attr("stroke", (d: d3.Bin<number, number>) => applyStroke(d, opts))
                    .attr("stroke-width", (d: d3.Bin<number, number>) => applyStrokeWidth(d, opts)),
            (update) =>
                update
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
            .style("border", "1px solid #888")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("font-size", "13px")
            .style("color", "#222")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.15)")
            .style("display", "none");
    }

    bar.on("mousemove", function (event, d) {
        const freq = ((d.length / data.length) * 100).toFixed(1);
        const hasOverflow = opts.xMax !== undefined && bins.length > 0 && bins[bins.length - 1].x0 === opts.xMax;
        const lastRegularBinIdx = hasOverflow ? bins.length - 2 : bins.length - 1;

        let binLabel: string;
        if (hasOverflow && d.x0! === opts.xMax) {
            binLabel = `> ${opts.xMax.toFixed(1)}`;
        } else if (d === bins[lastRegularBinIdx]) {
            binLabel = `[${d.x0?.toFixed(1)}, ${d.x1?.toFixed(1)}]`;
        } else {
            binLabel = `[${d.x0?.toFixed(1)}, ${d.x1?.toFixed(1)})`;
        }

        tooltip
            .style("display", "block")
            .html(
                `<strong>Count:</strong> ${d.length}<br>` +
                    `<strong>Percent:</strong> ${freq}<br>` +
                    `<strong>Bin:</strong> ${binLabel}`
            )
            .style("left", event.offsetX + 20 + "px")
            .style("top", event.offsetY - 10 + "px");
    }).on("mouseleave", function () {
        tooltip.style("display", "none");
    });

    // X Axis
    g.append("g")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(d3.axisBottom(x))
        .selectAll(".tick text")
        .style("font-size", "14px");

    // Y Axis - EGA commented out b/c I kind of like it w/out the axis
    // g.append("g").call(d3.axisLeft(y));

    // X Label

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text(opts.xLabel);

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
    svg.selectAll<SVGRectElement, d3.Bin<number, number>>("rect")
        .data(state.bins, (_d, i) => i)
        .attr("fill", (d: d3.Bin<number, number>) => applyFill(d, { ...state.opts, selectedRange }))
        .attr("stroke", (d: d3.Bin<number, number>) => applyStroke(d, { ...state.opts, selectedRange }))
        .attr("stroke-width", (d: d3.Bin<number, number>) => applyStrokeWidth(d, { ...state.opts, selectedRange }));
}
