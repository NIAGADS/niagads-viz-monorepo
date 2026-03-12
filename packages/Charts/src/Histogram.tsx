import { HistogramOptions, histogram } from "./d3/histogramChart";
import React, { useEffect, useRef } from "react";

import styles from "./styles/Charts.module.css";

interface HistogramProps {
    data: number[];
    opts: HistogramOptions;
}

const Histogram = ({ data, opts }: HistogramProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<ReturnType<typeof histogram> | null>(null);

    // Initialize chart once on mount and destroy on unmount
    useEffect(() => {
        if (containerRef.current) {
            histogram(containerRef.current, data, opts);
        }
    }, [data, opts]);

    return <div ref={containerRef} className={styles.chartContainer} />;
};

export default Histogram;
