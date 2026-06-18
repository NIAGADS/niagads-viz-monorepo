import { AxisConfig, DisplayProps } from "../d3/types";
import { HistogramOptions, destroyHistogram, histogram } from "./histogramChart";
import React, { CSSProperties, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Range } from "@niagads/common";
import chartStyles from "../styles/Charts.module.css";
import styles from "./Histogram.module.css";

type HistogramYAxisScale = "linear" | "log10";

const DEFAULT_HISTOGRAM_WIDTH = 400;
const DEFAULT_HISTOGRAM_ASPECT_RATIO = 0.66;
const DEFAULT_RANGE_HISTOGRAM_ASPECT_RATIO = 0.5;

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
        if (!containerRef.current || data.length === 0) {
            return;
        }

        histogram(containerRef.current, data, opts, overlayData);

        return () => {
            if (containerRef.current) {
                destroyHistogram(containerRef.current);
            }
        };
    }, [data, overlayData, opts]);
}

function getCssWidth(width?: DisplayProps["width"]): CSSProperties["width"] {
    return width ?? DEFAULT_HISTOGRAM_WIDTH;
}

function useResolvedHistogramLayout(displayOpts: DisplayProps | undefined, defaultAspectRatio: number) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [measuredWidth, setMeasuredWidth] = useState<number | undefined>();

    const requestedWidth = displayOpts?.width;

    useLayoutEffect(() => {
        if (typeof requestedWidth === "number") {
            setMeasuredWidth(undefined);
            return;
        }

        const wrapper = wrapperRef.current;

        if (!wrapper) {
            return;
        }

        const updateMeasuredWidth = () => {
            const nextWidth = wrapper.clientWidth || undefined;

            setMeasuredWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
        };

        updateMeasuredWidth();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateMeasuredWidth);

            return () => {
                window.removeEventListener("resize", updateMeasuredWidth);
            };
        }

        const resizeObserver = new ResizeObserver(updateMeasuredWidth);
        resizeObserver.observe(wrapper);

        return () => {
            resizeObserver.disconnect();
        };
    }, [requestedWidth]);

    const chartWidth =
        typeof requestedWidth === "number" ? requestedWidth : measuredWidth || DEFAULT_HISTOGRAM_WIDTH;

    const chartHeight = displayOpts?.height ?? chartWidth * (displayOpts?.aspectRatio ?? defaultAspectRatio);

    const wrapperStyle = useMemo<CSSProperties>(
        () => ({
            width: getCssWidth(requestedWidth),
        }),
        [requestedWidth]
    );

    const containerStyle = useMemo<CSSProperties>(
        () => ({
            width: "100%",
            height: `${chartHeight}px`,
        }),
        [chartHeight]
    );

    const resolvedDisplayOpts = useMemo<DisplayProps>(
        () => ({
            ...displayOpts,
            width: chartWidth,
            height: chartHeight,
        }),
        [displayOpts, chartWidth, chartHeight]
    );

    return {
        wrapperRef,
        wrapperStyle,
        containerStyle,
        resolvedDisplayOpts,
    };
}

const Histogram = ({ data, overlayData, title, numBins, max, label, displayOpts, yAxisScale }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { wrapperRef, wrapperStyle, containerStyle, resolvedDisplayOpts } = useResolvedHistogramLayout(
        displayOpts,
        DEFAULT_HISTOGRAM_ASPECT_RATIO
    );

    const opts = useMemo<HistogramOptions>(
        () => ({
            numBins,
            yAxisScale,
            xAxis: { max, label },
            displayOpts: resolvedDisplayOpts,
        }),
        [numBins, max, label, resolvedDisplayOpts, yAxisScale]
    );

    useHistogramRender(containerRef, data, overlayData, opts);

    if (data.length === 0) {
        return null;
    }

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div ref={wrapperRef} style={wrapperStyle}>
                <div ref={containerRef} className={styles["histogram-container"]} style={containerStyle} />
            </div>
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

    const { wrapperRef, wrapperStyle, containerStyle, resolvedDisplayOpts } = useResolvedHistogramLayout(
        displayOpts,
        DEFAULT_RANGE_HISTOGRAM_ASPECT_RATIO
    );

    const dataMin = useMemo(() => (data.length > 0 ? Math.floor(Math.min(...data)) : 0), [data]);
    const dataMax = useMemo(() => (data.length > 0 ? Math.ceil(Math.max(...data)) : 0), [data]);

    const opts = useMemo<HistogramOptions>(
        () => ({
            numBins,
            yAxisScale,
            binDomain: { min: dataMin, max: dataMax },
            xAxis: { max, label },
            displayOpts: resolvedDisplayOpts,
            selection: {
                mode: "range",
                selectedRange: range,
                onChange: onRangeSelect,
            },
        }),
        [numBins, dataMin, dataMax, max, label, resolvedDisplayOpts, range, onRangeSelect, yAxisScale]
    );

    useHistogramRender(containerRef, data, overlayData, opts);

    if (data.length === 0) {
        return null;
    }

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div ref={wrapperRef} style={wrapperStyle}>
                <div ref={containerRef} className={styles["histogram-container"]} style={containerStyle} />
            </div>
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

    const { wrapperRef, wrapperStyle, containerStyle, resolvedDisplayOpts } = useResolvedHistogramLayout(
        displayOpts,
        DEFAULT_HISTOGRAM_ASPECT_RATIO
    );

    const dataMin = useMemo(() => (data.length > 0 ? Math.floor(Math.min(...data)) : 0), [data]);
    const dataMax = useMemo(() => (data.length > 0 ? Math.ceil(Math.max(...data)) : 0), [data]);

    const initialRange = useMemo(
        () => (limitType === "min" ? { min: dataMin, max: limit } : { min: limit, max: dataMax }),
        [dataMin, dataMax, limit, limitType]
    );

    const opts = useMemo<HistogramOptions>(
        () => ({
            numBins,
            yAxisScale,
            binDomain: { min: dataMin, max: dataMax },
            xAxis: { max, label },
            displayOpts: resolvedDisplayOpts,
            selection: {
                mode: "threshold",
                selectedRange: initialRange,
                thresholdHandle: limitType === "min" ? "max" : "min",
                onChange: onRangeSelect,
            },
        }),
        [numBins, dataMin, dataMax, max, label, resolvedDisplayOpts, initialRange, limitType, onRangeSelect, yAxisScale]
    );

    useHistogramRender(containerRef, data, overlayData, opts);

    if (data.length === 0) {
        return null;
    }

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div ref={wrapperRef} style={wrapperStyle}>
                <div ref={containerRef} className={styles["histogram-container"]} style={containerStyle} />
            </div>
        </>
    );
};