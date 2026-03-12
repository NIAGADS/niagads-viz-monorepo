import * as d3 from "d3";

export interface HistogramOptions {
    numBins: number;
    xMin?: number;
    xMax?: number;
    xLabel: string;
    aspectRatio?: number; // height = width * aspectRatio
    margin?: { top: number; right: number; bottom: number; left: number };
}

export function histogram(container: HTMLElement, data: number[], opts: HistogramOptions) {
    // Helper to get bin value (count)
    function getBinValue(bin: d3.Bin<number, number>): number {
        return bin.length;
    }

    // Calculate min and max
    const min = opts.xMin || d3.min(data);
    const max = opts.xMax || d3.max(data);

    // Set up bins
    const numBins = opts.numBins || 10;
    const histogramGenerator = d3.bin().domain([min!, max!]).thresholds(numBins);
    const bins = histogramGenerator(data);

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
    const x = d3.scaleLinear().domain([min!, max!]).range([0, plotWidth]);

    // Y scale
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, getBinValue)!])
        .nice()
        .range([plotHeight, 0]);

    // Bars
    const bar = g
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", (d: d3.Bin<number, number>) => x(d.x0!))
        .attr("y", (d: d3.Bin<number, number>) => y(getBinValue(d)))
        .attr("width", (d: d3.Bin<number, number>) => x(d.x1!) - x(d.x0!))
        .attr("height", (d: d3.Bin<number, number>) => plotHeight - y(getBinValue(d)))
        .attr("fill", "#b0c4de") // blue-grey fill (light steel blue)
        .attr("stroke", "steelblue") // steelblue border
        .attr("stroke-width", 1.5);

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
        const freq = (d.length / data.length).toFixed(2);
        tooltip
            .style("display", "block")
            .html(
                `<strong>Count:</strong> ${d.length}<br>` +
                    `<strong>Percent:</strong> ${freq}<br>` +
                    `<strong>Bin:</strong> [${d.x0?.toFixed(2)}, ${d.x1?.toFixed(2)})`
            )
            .style("left", event.offsetX + 20 + "px")
            .style("top", event.offsetY - 10 + "px");
    }).on("mouseleave", function () {
        tooltip.style("display", "none");
    });

    // X Axis
    g.append("g").attr("transform", `translate(0,${plotHeight})`).call(d3.axisBottom(x));

    // Y Axis - EGA commented out b/c I kind of like it w/out the axis
    // g.append("g").call(d3.axisLeft(y));

    // X Label

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text(opts.xLabel);

    // Y Label
    /*svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Count"); */
}
