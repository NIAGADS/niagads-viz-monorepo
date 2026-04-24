import { AxisConfig, DisplayProps } from "../d3/types";
import { HistogramOptions, histogram, updateHistogramHighlight } from "./histogramChart";
import { RangeSlider, Slider } from "@niagads/ui/client";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Range } from "@niagads/common";

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

    return <div ref={containerRef} style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }} />;
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
    const [sliderStepSize, setSliderStepSize] = useState<number | null>(null);
    const [selectedRange, setSelectedRange] = useState<Range>(range);

    const chartWidth = displayOpts?.width || 300;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const dataMin = useMemo(() => Math.floor(Math.min(...data)), [data]);
    const dataMax = useMemo(() => Math.ceil(Math.max(...data)), [data]);
    const hasOverflow = max && dataMax > max;

    const opts: HistogramOptions = {
        numBins: numBins,
        binDomain: { min: dataMin, max: dataMax },
        xAxis: { max: max, label: label },
        displayOpts: updatedDisplayOpts,
        selectedRange: selectedRange,
        selection: {
            mode: "range",
            range: selectedRange,
            onChange: setSelectedRange,
        },
    };

    useEffect(() => {
        if (containerRef.current) {
            const stepSize = histogram(containerRef.current, data, {
                ...opts,
            });
            setSliderStepSize(stepSize!);
            if (selectedRange) {
                updateHistogramHighlight(containerRef.current, selectedRange);
            }
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            updateHistogramHighlight(containerRef.current, selectedRange);
        }
        onRangeSelect && onRangeSelect(selectedRange);
    }, [selectedRange]);

    return (
        <div>
            <div ref={containerRef} style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }} />
            {sliderStepSize && (
                <RangeSlider
                    name="histogram-slider-selection"
                    value={selectedRange}
                    min={dataMin}
                    max={hasOverflow ? max + sliderStepSize : dataMax}
                    step={sliderStepSize}
                    onChange={setSelectedRange}
                    displayRangeLabels={false}
                />
            )}
        </div>
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
    const [sliderStepSize, setSliderStepSize] = useState<number | null>(null);
    const dataMin = useMemo(() => Math.floor(Math.min(...data)), [data]);
    const dataMax = useMemo(() => Math.ceil(Math.max(...data)), [data]);
    const [selectedRange, setSelectedRange] = useState<Range>(() =>
        limitType == "min" ? { min: dataMin, max: limit } : { min: limit, max: dataMax }
    );
    const [selectedLimit, setSelectedLimit] = useState<number>(limit);

    const chartWidth = displayOpts?.width || 300;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 0.66);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const hasOverflow = max && dataMax > max;

    const opts: HistogramOptions = {
        numBins: numBins,
        binDomain: { min: dataMin, max: dataMax },
        xAxis: { max: max, label: label },
        displayOpts: updatedDisplayOpts,
        selectedRange: selectedRange,
        selection: {
            mode: "threshold",
            range: selectedRange,
            thresholdHandle: limitType === "min" ? "max" : "min",
            onChange: setSelectedRange,
        },
    };

    useEffect(() => {
        if (limitType == "min") {
            setSelectedRange({ min: dataMin, max: selectedLimit });
        } else {
            setSelectedRange({ min: selectedLimit, max: dataMax });
        }
    }, [selectedLimit]);

    useEffect(() => {
        if (containerRef.current) {
            const stepSize = histogram(containerRef.current, data, {
                ...opts,
            });
            setSliderStepSize(stepSize!);
            if (selectedRange) {
                updateHistogramHighlight(containerRef.current, selectedRange);
            }
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            updateHistogramHighlight(containerRef.current, selectedRange);
        }

        onRangeSelect && onRangeSelect(selectedRange!);
    }, [selectedRange]);

    return (
        <div>
            <div ref={containerRef} style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }} />
            {sliderStepSize && (
                <Slider
                    name="histogram-slider-selection"
                    value={selectedLimit}
                    min={dataMin}
                    max={hasOverflow ? max + sliderStepSize : dataMax}
                    step={sliderStepSize}
                    variant={limitType}
                    displayRangeLabels={false}
                    onChange={setSelectedLimit}
                />
            )}
        </div>
    );
};
