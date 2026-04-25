import { AxisConfig, DisplayProps } from "../d3/types";
import { HistogramOptions, histogram } from "./histogramChart";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Range } from "@niagads/common";
import styles from "../Histogram/Histogram.module.css";

interface HistogramProps extends AxisConfig {
    data: number[];
    numBins: number;
    displayOpts?: DisplayProps;
}

const Histogram = ({ data, numBins, max, label, displayOpts }: HistogramProps) => {
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
        <div
            ref={containerRef}
            className={styles["histogram-container"]}
            style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
        />
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
    onRangeSelect,
}: RangeSelectHistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const chartWidth = displayOpts?.width || 300;
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
        <div
            ref={containerRef}
            className={styles["histogram-container"]}
            style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
        />
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
    onRangeSelect,
}: ThresholdSelectHistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const dataMin = useMemo(() => Math.floor(Math.min(...data)), [data]);
    const dataMax = useMemo(() => Math.ceil(Math.max(...data)), [data]);

    const initialRange = useMemo(
        () => (limitType == "min" ? { min: dataMin, max: limit } : { min: limit, max: dataMax }),
        [dataMin, dataMax]
    );

    const chartWidth = displayOpts?.width || 300;
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

    /* useEffect(() => {
        if (limitType == "min") {
            setSelectedRange({ min: dataMin, max: selectedRange.max });
        } else {
            setSelectedRange({ min: selectedRange.min, max: dataMax });
        }
    }, [selectedRange]);*/

    useEffect(() => {
        if (containerRef.current) {
            histogram(containerRef.current, data, {
                ...opts,
            });
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={styles["histogram-container"]}
            style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
        />
    );
};
