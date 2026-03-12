import { HistogramOptions, histogram } from "./d3/histogramChart";
import React, { useEffect, useRef, useState } from "react";

import { Slider } from "../../UI/src/client/Slider";
import styles from "./styles/Charts.module.css";

interface HistogramProps {
    data: number[];
    enableRangeSelect?: boolean;
    rangeSelectionType?: "min" | "max" | "range";
    initialSelection?: number[];
    onRangeSelect: (range: number[]) => void;
    opts: HistogramOptions;
}

const Histogram = ({
    data,
    enableRangeSelect,
    rangeSelectionType,
    initialSelection,
    onRangeSelect,
    opts,
}: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [binSize, setBinSize] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (containerRef.current) {
            const size = histogram(containerRef.current, data, opts);
            setBinSize(size!);
        }
    }, [data, opts]);

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
                    onChange={onRangeSelect}
                />
            )}
        </div>
    );
};

export default Histogram;
