import { AxisConfig, DisplayProps } from "../d3/types";
import { HistogramOptions, histogram } from "./histogramChart";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Range } from "@niagads/common";
import chartStyles from "../styles/Charts.module.css";
import styles from "./Histogram.module.css";

interface HistogramProps extends AxisConfig {
    data: number[];
    numBins: number;
    title?: string;
    displayOpts?: DisplayProps;
}

const Histogram = ({ data, title, numBins, max, label, displayOpts }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const chartWidth = displayOpts?.width || 400;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const opts: HistogramOptions = {
        numBins: numBins,
        xAxis: { max: max, label: label },
        displayOpts: updatedDisplayOpts,
    };

    useEffect(() => {
        if (containerRef.current) {
            histogram(containerRef.current, data, {
                ...opts,
            });
        }
    }, []);

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
    numBins,
    max,
    label,
    displayOpts,
    range,
    title,
    onRangeSelect,
}: RangeSelectHistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const chartWidth = displayOpts?.width || 400;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const dataMin = useMemo(() => Math.floor(Math.min(...data)), [data]);
    const dataMax = useMemo(() => Math.ceil(Math.max(...data)), [data]);

    const opts: HistogramOptions = {
        numBins: numBins,
        binDomain: { min: dataMin, max: dataMax },
        xAxis: { max: max, label: label },
        displayOpts: updatedDisplayOpts,
        selection: {
            mode: "range",
            selectedRange: range,
            onChange: onRangeSelect,
        },
    };

    useEffect(() => {
        if (containerRef.current) {
            histogram(containerRef.current, data, {
                ...opts,
            });
        }
    }, []);

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
    numBins,
    max,
    label,
    displayOpts,
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
        [dataMin, dataMax]
    );

    const chartWidth = displayOpts?.width || 400;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const opts: HistogramOptions = {
        numBins: numBins,
        binDomain: { min: dataMin, max: dataMax },
        xAxis: { max: max, label: label },
        displayOpts: updatedDisplayOpts,

        selection: {
            mode: "threshold",
            selectedRange: initialRange,
            thresholdHandle: limitType === "min" ? "max" : "min",
            onChange: onRangeSelect,
        },
    };

    useEffect(() => {
        if (containerRef.current) {
            histogram(containerRef.current, data, {
                ...opts,
            });
        }
    }, [data]);

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
