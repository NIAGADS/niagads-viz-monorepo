import * as d3 from "d3";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { AxisOptions } from "./types";

interface HistogramProps {
    data: number[];
    numBins?: number;
    /** Cap bar height at this count; capped bars render at the cap and are labelled with their actual value */
    cap?: number;
    xAxis?: AxisOptions;
    yAxis?: AxisOptions;
}

interface BinDatum {
    bin: string;
    /** Rendered bar height — clamped to cap if set */
    count: number;
    /** Original count before capping */
    actualCount: number;
    /** 1 if this bar was capped, 0 otherwise (boolean encoded as number for compatibility) */
    capped: number;
    [key: string]: string | number;
}

const computeBins = (data: number[], numBins: number, min: number, max: number, cap?: number): BinDatum[] => {
    const binWidth = (max - min) / numBins;
    const rawBins: { bin: string; count: number }[] = Array.from({ length: numBins }, (_, i) => {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        const label = `${binStart.toPrecision(4)}–${binEnd.toPrecision(4)}`;
        return { bin: label, count: 0 };
    });

    for (const value of data) {
        if (value < min || value > max) continue;
        let idx = Math.floor((value - min) / binWidth);
        // clamp the last value into the final bin
        if (idx >= numBins) idx = numBins - 1;
        rawBins[idx].count += 1;
    }

    return rawBins.map(({ bin, count }) => {
        const isCapped = cap !== undefined && count > cap;
        return {
            bin,
            count: isCapped ? cap! : count,
            actualCount: count,
            capped: isCapped ? 1 : 0,
        };
    });
};

const Histogram = ({ data, numBins = 10, cap, xAxis, yAxis }: HistogramProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoveredBin, setHoveredBin] = useState<number | null>(null);

    const filteredData = useMemo(() => {
        const bounded = data.filter((v) => Number.isFinite(v));
        const domainMin = xAxis?.min ?? Math.min(...bounded);
        const domainMax = xAxis?.max ?? Math.max(...bounded);
        return bounded.filter((v) => v >= domainMin && v <= domainMax);
    }, [data, xAxis?.min, xAxis?.max]);

    const domainMin = xAxis?.min ?? Math.min(...filteredData);
    const domainMax = xAxis?.max ?? Math.max(...filteredData);

    const binData = useMemo(
        () => computeBins(filteredData, numBins, domainMin, domainMax, cap),
        [filteredData, numBins, domainMin, domainMax, cap]
    );

    useEffect(() => {
        if (!svgRef.current || binData.length === 0) return;

        const margin = { top: 40, right: 40, bottom: 80, left: 80 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X scale
        const xScale = d3
            .scaleBand<string>()
            .domain(binData.map((d) => d.bin))
            .range([0, width])
            .padding(0.05);

        // Y scale
        const yMax = cap ?? Math.max(...binData.map((d) => d.count));
        const yMin = yAxis?.min ?? 0;
        const yScaleMax = yAxis?.max ?? yMax;

        const yScale = d3.scaleLinear().domain([yMin, yScaleMax]).range([height, 0]);

        // Draw grid lines
        svg.append("g")
            .attr("class", "grid")
            .attr("opacity", 0.1)
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSize(-width)
                    .tickFormat(() => "")
            );

        // Draw bars
        svg.selectAll(".bar")
            .data(binData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d: any) => xScale((d as BinDatum).bin)!)
            .attr("y", (d: any) => yScale((d as BinDatum).count))
            .attr("width", xScale.bandwidth())
            .attr("height", (d: any) => height - yScale((d as BinDatum).count))
            .attr("fill", (d: any, i: number) => (i === hoveredBin ? "#4a90e2" : "#5e7fb8"))
            .attr("opacity", 0.8)
            .on("mouseenter", (event: any, d: any) => {
                const binIndex = binData.indexOf(d as BinDatum);
                setHoveredBin(binIndex);
            })
            .on("mouseleave", () => {
                setHoveredBin(null);
            });

        // Draw labels on capped bars
        svg.selectAll(".bar-label")
            .data(binData)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d: any) => xScale((d as BinDatum).bin)! + xScale.bandwidth() / 2)
            .attr("y", (d: any) => yScale((d as BinDatum).count) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("fill", "#333")
            .text((d: any) => ((d as BinDatum).capped ? `> ${cap}` : ""))
            .style("pointer-events", "none");

        // X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 56)
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .attr("font-size", 14)
            .text(xAxis?.label ?? "");

        svg.selectAll(".tick text").attr("transform", "rotate(-35)").attr("text-anchor", "end").attr("font-size", 11);

        // Y axis
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .attr("font-size", 14)
            .text(yAxis?.label ?? "Count");

        // Tooltip
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

        svg.selectAll(".bar")
            .on("mousemove", (event: any, d: any) => {
                const binData = d as BinDatum;
                tooltip
                    .style("opacity", 1)
                    .html(`n = <strong>${binData.actualCount}</strong>`)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseleave", () => {
                tooltip.style("opacity", 0);
            });

        return () => {
            tooltip.remove();
        };
    }, [binData, cap, hoveredBin, xAxis?.label, yAxis?.label, yAxis?.min, yAxis?.max]);

    return <svg ref={svgRef}></svg>;
};

export default Histogram;
