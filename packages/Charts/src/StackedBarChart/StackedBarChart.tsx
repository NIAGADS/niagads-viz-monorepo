import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

import { _isNA } from "@niagads/common";

import { DisplayProps } from "../d3/types";
import chartStyles from "../styles/Charts.module.css";
import styles from "./StackedBarChart.module.css";
import {
    destroyStackedBarChart,
    getStackedBarChartHeight,
    NA_COLOR,
    stackedBarChart,
    StackedBarChartOptions,
} from "./d3StackedBarChart";

export interface StackedBarChartValue {
    label: string;
    value: number;
}

export interface StackedBarChartDataRow {
    id: string;
    label?: string;
    values: StackedBarChartValue[];
}

export interface StackedBarChartProps {
    data: StackedBarChartDataRow[];
    onClick?: (key: string) => void;
    displayOpts?: DisplayProps;
    legendPosition?: "right" | "bottom" | "none";
    title?: string;
}

const Legend = ({ data }: { data: StackedBarChartDataRow[] }) => {
    const legendItems = useMemo(() => {
        const labels = new Set<string>();
        data.forEach((row) => {
            row.values.forEach((value) => {
                labels.add(value.label);
            });
        });
        return Array.from(labels);
    }, [data]);

    const colorScale = useMemo(() => {
        const scale: Record<string, string> = {};
        legendItems.forEach((label, i) => {
            scale[label] = d3.schemeCategory10[i % d3.schemeCategory10.length];
        });
        return scale;
    }, [legendItems]);

    return (
        <div className={styles.legend}>
            {legendItems.map((item) => (
                <div key={item} className={styles["legend-item"]}>
                    <div
                        className={styles["legend-color"]}
                        style={{
                            backgroundColor: _isNA(item) ? NA_COLOR : colorScale[item],
                        }}
                    />
                    <span className={styles["legend-label"]}>{item}</span>
                </div>
            ))}
        </div>
    );
};

const StackedBarChart = ({ data, displayOpts, title, legendPosition = "right" }: StackedBarChartProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(displayOpts?.width ?? 420);

    const chartHeight = getStackedBarChartHeight(data.length, displayOpts?.margin);

    useEffect(() => {
        if (!containerRef.current || displayOpts?.width) return;

        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width ?? 0;

            if (width > 0) {
                setContainerWidth(Math.max(width, 420));
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [displayOpts?.width]);

    const legendWidth = legendPosition === "right" ? 140 : 0;
    const chartWidth = displayOpts?.width ?? Math.max(containerWidth - legendWidth - 10, 420);

    const updatedDisplayOpts = useMemo(
        () => ({
            ...displayOpts,
            width: chartWidth,
        }),
        [chartWidth, displayOpts]
    );

    useEffect(() => {
        if (!chartRef.current) return;

        destroyStackedBarChart(chartRef.current);

        stackedBarChart(chartRef.current, data, {
            displayOpts: updatedDisplayOpts,
        });

        return () => {
            if (chartRef.current) {
                destroyStackedBarChart(chartRef.current);
            }
        };
    }, [data, updatedDisplayOpts]);

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div
                ref={containerRef}
                className={`${styles["stacked-bar-chart-wrapper"]} ${styles[`stacked-bar-chart-wrapper-${legendPosition}`]}`}
            >
                <div
                    ref={chartRef}
                    style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
                    className={styles["stacked-bar-container"]}
                />
                {legendPosition !== "none" && (
                    <div className={styles["legend-wrapper"]}>
                        <Legend data={data} />
                    </div>
                )}
            </div>
        </>
    );
};

export default StackedBarChart;
