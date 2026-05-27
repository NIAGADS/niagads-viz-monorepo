import { AxisConfig, DisplayProps } from "../d3/types";
import { HistogramOptions, destroyHistogram, histogram } from "./histogramChart";
import React, { useLayoutEffect, useMemo, useRef } from "react";

import { Range } from "@niagads/common";
import chartStyles from "../styles/Charts.module.css";
import styles from "./Histogram.module.css";

type HistogramYAxisScale = "linear" | "log10";

interface HistogramProps extends AxisConfig {
    data: number[];
    overlayData?: number[];
    numBins: number;
    title?: string;
    displayOpts?: DisplayProps;
    yAxisScale?: HistogramYAxisScale;
}

function useHistogramRender(
    containerRef: React.RefObject<HTMLDivElement | null>,
    data: number[],
    overlayData: undefined | number[],
    opts: HistogramOptions
) {
    useLayoutEffect(() => {
        if (!containerRef.current) {
            return;
        }

        histogram(containerRef.current, data, opts, overlayData);

        return () => {
            if (containerRef.current) {
                destroyHistogram(containerRef.current);
            }
        };
    }, [containerRef, data, opts]);
}

const Histogram = ({ data, overlayData, title, numBins, max, label, displayOpts, yAxisScale }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const chartWidth = displayOpts?.width || 400;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = useMemo(
        () => ({
            ...displayOpts,
            width: chartWidth,
            height: chartHeight,
        }),
        [displayOpts, chartWidth, chartHeight]
    );

    const opts = useMemo<HistogramOptions>(
        () => ({
            numBins: numBins,
            yAxisScale,
            xAxis: { max: max, label: label },
            displayOpts: updatedDisplayOpts,
        }),
        [numBins, max, label, updatedDisplayOpts, yAxisScale]
    );

    useHistogramRender(containerRef, data, overlayData, opts);

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div
                ref={containerRef}
                className={styles["histogram-container"]}
                style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
            />
        </>
    );
};

export default Histogram;

interface RangeSelectHistogramProps extends HistogramProps {
    range: Range;
    onRangeSelect: (value: Range) => void;
}

export const RangeSelectHistogram = ({
    data,
    overlayData,
    numBins,
    max,
    label,
    displayOpts,
    yAxisScale,
    range,
    title,
    onRangeSelect,
}: RangeSelectHistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const chartWidth = displayOpts?.width || 400;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = useMemo(
        () => ({
            ...displayOpts,
            width: chartWidth,
            height: chartHeight,
        }),
        [displayOpts, chartWidth, chartHeight]
    );

    const dataMin = useMemo(() => Math.floor(Math.min(...data)), [data]);
    const dataMax = useMemo(() => Math.ceil(Math.max(...data)), [data]);

    const opts = useMemo<HistogramOptions>(
        () => ({
            numBins: numBins,
            yAxisScale,
            binDomain: { min: dataMin, max: dataMax },
            xAxis: { max: max, label: label },
            displayOpts: updatedDisplayOpts,
            selection: {
                mode: "range",
                selectedRange: range,
                onChange: onRangeSelect,
            },
        }),
        [numBins, dataMin, dataMax, max, label, updatedDisplayOpts, range, onRangeSelect, yAxisScale]
    );

    useHistogramRender(containerRef, data, overlayData, opts);

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div
                ref={containerRef}
                className={styles["histogram-container"]}
                style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
            />
        </>
    );
};

type LimitType = "min" | "max";
interface ThresholdSelectHistogramProps extends HistogramProps {
    limit: number;
    limitType: LimitType;
    onRangeSelect: (value: Range) => void;
}

export const ThresholdSelectHistogram = ({
    data,
    overlayData,
    numBins,
    max,
    label,
    displayOpts,
    yAxisScale,
    limit,
    limitType,
    title,
    onRangeSelect,
}: ThresholdSelectHistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const dataMin = useMemo(() => Math.floor(Math.min(...data)), [data]);
    const dataMax = useMemo(() => Math.ceil(Math.max(...data)), [data]);

    const initialRange = useMemo(
        () => (limitType == "min" ? { min: dataMin, max: limit } : { min: limit, max: dataMax }),
        [dataMin, dataMax, limit, limitType]
    );

    const chartWidth = displayOpts?.width || 400;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = useMemo(
        () => ({
            ...displayOpts,
            width: chartWidth,
            height: chartHeight,
        }),
        [displayOpts, chartWidth, chartHeight]
    );

    const opts = useMemo<HistogramOptions>(
        () => ({
            numBins: numBins,
            yAxisScale,
            binDomain: { min: dataMin, max: dataMax },
            xAxis: { max: max, label: label },
            displayOpts: updatedDisplayOpts,
            selection: {
                mode: "threshold",
                selectedRange: initialRange,
                thresholdHandle: limitType === "min" ? "max" : "min",
                onChange: onRangeSelect,
            },
        }),
        [numBins, dataMin, dataMax, max, label, updatedDisplayOpts, initialRange, limitType, onRangeSelect, yAxisScale]
    );

    useHistogramRender(containerRef, data, overlayData, opts);

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div
                ref={containerRef}
                className={styles["histogram-container"]}
                style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
            />
        </>
    );
};
