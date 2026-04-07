import { AxisConfig, DisplayProps } from "./d3/types";
import { HistogramOptions, histogram, updateHistogramHighlight } from "./d3/histogramChart";
import { RangeSlider, Slider } from "@niagads/ui/client";
import React, { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import { Range } from "@niagads/common";
import styles from "./styles/Charts.module.css";

interface HistogramProps extends AxisConfig {
    data: number[];
    numBins: number;
    displayOpts?: DisplayProps;
}

const Histogram = ({ data, numBins, min, max, label, displayOpts }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const opts: HistogramOptions = {
        numBins: numBins,
        xAxis: { min: min, max: max, label: label },
        displayOpts: displayOpts,
    };

    useEffect(() => {
        if (containerRef.current) {
            histogram(containerRef.current, data, {
                ...opts,
            });
        }
    }, []);

    return (
        <div>
            <div ref={containerRef} className={styles.chartContainer} />
        </div>
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
    const [sliderStepSize, setSliderStepSize] = useState<number | null>(null);
    const [selectedRange, setSelectedRange] = useState<Range>(range);

    const dataMin = useMemo(() => Math.min(...data), [data]);
    const dataMax = useMemo(() => Math.max(...data), [data]);
    const hasOverflow = max && dataMax > max;

    const opts: HistogramOptions = {
        numBins: numBins,
        xAxis: { max: max, label: label },
        displayOpts: displayOpts,
        selectedRange: selectedRange,
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
            <div ref={containerRef} className={styles.chartContainer} />
            {sliderStepSize && (
                <RangeSlider
                    name="histogram-slider-selection"
                    value={selectedRange}
                    min={dataMin}
                    max={hasOverflow ? max + sliderStepSize : dataMax}
                    step={sliderStepSize}
                    onChange={setSelectedRange}
                    displayRange={false}
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
    const [selectedRange, setSelectedRange] = useState<Range>();
    const [selectedLimit, setSelectedLimit] = useState<number>(limit);

    const dataMin = useMemo(() => Math.min(...data), [data]);
    const dataMax = useMemo(() => Math.max(...data), [data]);
    const hasOverflow = max && dataMax > max;

    const opts: HistogramOptions = {
        numBins: numBins,
        xAxis: { max: max, label: label },
        displayOpts: displayOpts,
        selectedRange: selectedRange,
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
            <div ref={containerRef} className={styles.chartContainer} />
            {sliderStepSize && (
                <Slider
                    name="histogram-slider-selection"
                    value={selectedLimit}
                    min={dataMin}
                    max={hasOverflow ? max + sliderStepSize : dataMax}
                    step={sliderStepSize}
                    variant={limitType}
                    displayRange={false}
                    onChange={setSelectedLimit}
                />
            )}
        </div>
    );
};
