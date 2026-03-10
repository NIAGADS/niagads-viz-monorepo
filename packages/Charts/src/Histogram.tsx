import { D3BinDatum, HistogramOptions, histogram } from "./d3/histogramChart";
import React, { useEffect, useMemo, useRef } from "react";

import { AxisOptions } from "./types";
import styles from "./styles/Charts.module.css";

interface HistogramProps {
    data: number[];
    numBins?: number;
    /** Cap bar height at this count; capped bars render at the cap and are labelled with their actual value */
    cap?: number;
    /** If true, display frequencies (proportions) instead of raw counts */
    useFrequencies?: boolean;
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
        const midpoint = (binStart + binEnd) / 2;
        const label = midpoint.toFixed(1);
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

const Histogram = ({ data, numBins = 10, cap, useFrequencies = false, xAxis, yAxis }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<ReturnType<typeof histogram> | null>(null);

    const domainMin = useMemo(() => xAxis?.min ?? Math.min(...data), [xAxis?.min, data]);
    const domainMax = useMemo(() => xAxis?.max ?? Math.max(...data), [xAxis?.max, data]);

    const binData = useMemo(
        () => computeBins(data, numBins, domainMin, domainMax, cap),
        [data, numBins, domainMin, domainMax, cap]
    );

    const d3Data = useMemo<D3BinDatum[]>(
        () =>
            binData.map((b) => {
                const actualCount = useFrequencies ? b.actualCount / data.length : b.actualCount;
                return {
                    bin: b.bin,
                    count: useFrequencies ? actualCount : b.count,
                    actualCount: actualCount,
                    capped: b.capped,
                };
            }),
        [binData, useFrequencies, data.length]
    );

    const opts = useMemo<HistogramOptions>(
        () => ({
            cap,
            useFrequencies,
            xLabel: xAxis?.label,
            yLabel: yAxis?.label,
            yMin: yAxis?.min,
            yMax: yAxis?.max,
        }),
        [cap, useFrequencies, xAxis?.label, yAxis?.label, yAxis?.min, yAxis?.max]
    );

    // Initialize chart once on mount and destroy on unmount
    useEffect(() => {
        if (containerRef.current) {
            chartRef.current = histogram(containerRef.current, d3Data, opts) as any;
        }
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [d3Data, opts]);

    return <div ref={containerRef} className={styles.chartContainer} />;
};

export default Histogram;
