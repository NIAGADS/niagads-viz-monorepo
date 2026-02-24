import React, { useMemo } from "react";
import { BarTooltipProps, ResponsiveBar } from "@nivo/bar";
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
    /** Rendered bar height — clamped to yAxis.cap if set */
    count: number;
    /** Original count before capping */
    actualCount: number;
    /** 1 if this bar was capped, 0 otherwise (boolean encoded as number for BarDatum compat) */
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

const HistogramTooltip = ({ data }: BarTooltipProps<BinDatum> & { cap?: number }) => {
    const binData = data.data as unknown as BinDatum;
    return (
        <div
            style={{
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px 10px",
                fontSize: 13,
            }}
        >
            <br />n = <strong>{binData.actualCount}</strong>
        </div>
    );
};

const Histogram = ({ data, numBins = 10, cap, xAxis, yAxis }: HistogramProps) => {
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

    return (
        <ResponsiveBar
            data={binData}
            keys={["count"]}
            indexBy="bin"
            margin={{ top: 40, right: 40, bottom: 80, left: 80 }}
            padding={0.05}
            enableGridY={true}
            enableGridX={false}
            // Show a label only on capped bars: "n=actualCount"
            enableLabel={true}
            label={(datum) => ((datum.data as BinDatum).capped ? `> ${cap}` : "")}
            labelSkipWidth={0}
            labelSkipHeight={0}
            tooltip={(props) => <HistogramTooltip {...(props as BarTooltipProps<BinDatum>)} />}
            axisBottom={{
                legend: xAxis?.label ?? "",
                legendOffset: 56,
                legendPosition: "middle",
                tickRotation: -35,
                truncateTickAt: 20,
            }}
            axisLeft={{
                legend: yAxis?.label ?? "Count",
                legendOffset: -60,
                legendPosition: "middle",
            }}
            valueScale={{
                type: "linear",
                ...(yAxis?.min !== undefined ? { min: yAxis.min } : { min: 0 }),
                ...(cap !== undefined ? { max: cap } : yAxis?.max !== undefined ? { max: yAxis.max } : {}),
            }}
        />
    );
};

export default Histogram;
