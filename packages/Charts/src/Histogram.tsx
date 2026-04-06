import { AxisConfig, DisplayProps } from "./d3/types";
import { HistogramOptions, histogram, updateHistogramHighlight } from "./d3/histogramChart";
import { RangeSlider, Slider } from "@niagads/ui/client";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
    }, [data, opts]);

    return (
        <div>
            <div ref={containerRef} className={styles.chartContainer} />
        </div>
    );
};

export default Histogram;

interface RangeSelectHistogramProps extends HistogramProps {
    selectionStrategy: "min" | "max" | "range";
    initialSelection: Range;
    onRangeSelect: (range: Range) => void;
}

export const RangeSelectHistogram = ({
    data,
    numBins,
    min,
    max,
    label,
    displayOpts,
    selectionStrategy,
    initialSelection,
    onRangeSelect,
}: RangeSelectHistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [sliderStepSize, setSliderStepSize] = useState<number | null>(null);
    const [selection, setSelection] = useState<Range>(initialSelection);

    const opts: HistogramOptions = {
        numBins: numBins,
        xAxis: { min: min, max: max, label: label },
        displayOpts: displayOpts,
        selectedRange: selection,
    };

    useEffect(() => {
        if (containerRef.current) {
            const stepSize = histogram(containerRef.current, data, {
                ...opts,
            });
            setSliderStepSize(stepSize!);
            if (selection) {
                updateHistogramHighlight(containerRef.current, selection);
            }
        }
    }, [data, opts]);

    useEffect(() => {
        if (containerRef.current) {
            updateHistogramHighlight(containerRef.current, selection);
        }
        onRangeSelect && onRangeSelect(selection);
    }, [selection]);

    return (
        <div>
            <div ref={containerRef} className={styles.chartContainer} />
            {sliderStepSize && (
                <RangeSlider
                    name="histogram-slider-selection"
                    value={selection}
                    min={min ?? Math.min(...data)}
                    max={max ?? Math.max(...data)}
                    step={sliderStepSize}
                    variant={selectionStrategy ?? "range"}
                    onChange={setSelection}
                />
            )}
        </div>
    );
};
