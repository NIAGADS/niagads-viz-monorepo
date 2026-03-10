import * as d3 from "d3";

export interface D3BinDatum {
    bin: string;
    count: number;
    actualCount: number;
    capped: number;
}

export interface HistogramOptions {
    margin?: { top: number; right: number; bottom: number; left: number };
    cap?: number;
    useFrequencies?: boolean;
    xLabel?: string;
    yLabel?: string;
    yMin?: number;
    yMax?: number;
    aspectRatio?: number; // height = width * aspectRatio
}

export function histogram(container: HTMLElement, initialData: D3BinDatum[], opts: HistogramOptions = {}) {
    const options: Required<Pick<HistogramOptions, "margin" | "useFrequencies" | "aspectRatio">> &
        Omit<HistogramOptions, "margin" | "useFrequencies" | "aspectRatio"> = {
        margin: { top: 40, right: 40, bottom: 80, left: 80 },
        useFrequencies: false,
        aspectRatio: 0.52, // default ~500/960
        ...opts,
    };

    const { margin, aspectRatio } = options;

    let currentData = initialData;
    let width = 0;
    let height = 0;
    let innerWidth = 0;
    let innerHeight = 0;

    d3.select(container).selectAll("*").remove();

    const svg = d3
        .select(container)
        .append("svg")
        .style("width", "100%")
        .style("height", "auto")
        .attr("preserveAspectRatio", "xMidYMid meet");

    const root = svg.append("g");

    const gridG = root.append("g").attr("opacity", 0.08).attr("pointer-events", "none");
    const barsG = root.append("g");
    const labelsG = root.append("g");
    const xAxisG = root.append("g");
    const yAxisG = root.append("g");

    const yAxisLabel = yAxisG
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", 14);

    const xScale = d3.scaleBand<string>().padding(0.05);
    const yScale = d3.scaleLinear<number, number>();

    const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "6px 10px")
        .style("font-size", "13px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    function computeLayout() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = width * aspectRatio;

        innerWidth = width - margin.left - margin.right;
        innerHeight = height - margin.top - margin.bottom;

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        root.attr("transform", `translate(${margin.left},${margin.top})`);

        xScale.range([0, innerWidth]);
        yScale.range([innerHeight, 0]);

        xAxisG.attr("transform", `translate(0,${innerHeight})`);

        yAxisLabel.attr("y", -margin.left + 15).attr("x", -innerHeight / 2);
    }

    function render(data: D3BinDatum[], localOpts: HistogramOptions = {}) {
        const o = { ...options, ...localOpts };
        currentData = data;

        xScale.domain(data.map((d) => d.bin));

        // When using frequencies, counts are expected to be in [0,1]. Ignore `cap` in
        // frequency mode (it doesn't make sense to cap frequencies), but allow an
        // explicit `yMax` override. Otherwise prefer cap/yMax or fall back to data max.
        const yMax = o.useFrequencies ? (o.yMax ?? 1) : (o.cap ?? o.yMax ?? d3.max(data, (d) => d.count) ?? 0);
        const yMin = o.yMin ?? 0;

        yScale.domain([yMin, yMax]).nice();

        gridG.call(
            d3
                .axisLeft(yScale)
                .tickSize(-innerWidth)
                .tickFormat(() => "")
        );

        barsG
            .selectAll<SVGRectElement, D3BinDatum>("rect")
            .data(data, (d) => d.bin)
            .join(
                (enter) =>
                    enter.append("rect").attr("fill", "#5e7fb8").attr("stroke", "#333").attr("stroke-width", 0.5),
                (update) => update,
                (exit) => exit.remove()
            )
            .attr("x", (d) => xScale(d.bin)!)
            .attr("width", xScale.bandwidth())
            .attr("y", (d) => yScale(d.count))
            .attr("height", (d) => innerHeight - yScale(d.count))
            .on("mousemove", (event, d) => {
                const label = o.useFrequencies
                    ? `${(d.actualCount * 100).toFixed(2)}%`
                    : `n = ${Math.round(d.actualCount)}`;

                tooltip
                    .style("opacity", 1)
                    .html(`<strong>${label}</strong>`)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseleave", () => tooltip.style("opacity", 0));

        labelsG
            .selectAll<SVGTextElement, D3BinDatum>("text")
            .data(data, (d) => d.bin)
            .join(
                (enter) =>
                    enter.append("text").attr("text-anchor", "middle").attr("font-size", 12).attr("fill", "#333"),
                (update) => update,
                (exit) => exit.remove()
            )
            .attr("x", (d) => xScale(d.bin)! + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d.count) - 5)
            .text((d) => (d.capped && !o.useFrequencies && o.cap ? `> ${o.cap}` : ""));

        xAxisG.call(d3.axisBottom(xScale));

        if (o.useFrequencies) {
            yAxisG.call(d3.axisLeft(yScale).tickFormat((d) => `${(+d * 100).toFixed(1)}%`));
            yAxisLabel.text(o.yLabel ?? "Frequency");
        } else {
            yAxisG.call(d3.axisLeft(yScale));
            yAxisLabel.text(o.yLabel ?? "Count");
        }

        xAxisG
            .selectAll(".tick text")
            .attr("transform", "rotate(-35)")
            .attr("text-anchor", "end")
            .attr("font-size", 11);
    }

    let lastWidth = 0;

    const resizeObserver = new ResizeObserver((entries) => {
        const newWidth = entries[0].contentRect.width;
        if (newWidth === lastWidth) return;
        lastWidth = newWidth;

        computeLayout();
        render(currentData);
    });

    resizeObserver.observe(container);

    computeLayout();
    render(initialData);

    return {
        update(newData: D3BinDatum[], newOpts: HistogramOptions = {}) {
            render(newData, newOpts);
        },
        destroy() {
            resizeObserver.disconnect();
            tooltip.remove();
            svg.remove();
        },
    };
}
