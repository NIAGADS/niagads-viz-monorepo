import { AxisConfig, DisplayProps } from "./d3/types";
import { HistogramOptions, histogram, updateHistogramHighlight } from "./d3/histogramChart";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Slider } from "@niagads/ui/client";
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
    selectionStrategy?: "min" | "max" | "range";
    selectedLowerBound?: number;
    selectedUpperBound?: number;
    onRangeSelect: (range: number[]) => void;
}
/*

const RangeSelectHistogram = ({ data, numBins, xAxis, display }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [binSize, setBinSize] = useState<number | undefined>(undefined);
    const [selectedRange, setSelectedRange] = useState<number[]>(initialSelection);

    useEffect(() => {
        if (containerRef.current) {
            const size = histogram(containerRef.current, data, {
                ...opts,
            });
            setBinSize(size!);
            if (initialSelection) {
                updateHistogramHighlight(containerRef.current, selectedRange);
            }
        }
    }, [data, opts]);

    useEffect(() => {
        if (containerRef.current) {
            updateHistogramHighlight(containerRef.current, selectedRange);
        }
        onRangeSelect && onRangeSelect(selectedRange);
    }, [selectedRange]);

    return (
        <div>
            <div ref={containerRef} className={styles.chartContainer} />
            {enableRangeSelect && binSize && (
                <Slider
                    name="histogram-slider-selection"
                    value={initialSelection ?? []}
                    min={opts.xMin ?? Math.min(...data)}
                    max={opts.xMax ?? Math.max(...data)}
                    step={binSize}
                    variant={rangeSelectionType ?? "max"}
                    onChange={setSelectedRange}
                />
            )}
        </div>
    );
};
*/
