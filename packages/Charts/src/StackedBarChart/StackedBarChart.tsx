import React, { useEffect, useMemo, useRef, useState } from "react";
import { COLOR_BLIND_FRIENDLY_PALETTES, _isNA } from "@niagads/common";

import { DisplayProps } from "../d3/types";
import chartStyles from "../styles/Charts.module.css";
import styles from "./StackedBarChart.module.css";
import { destroyStackedBarChart, NA_COLOR, stackedBarChart, StackedBarChartOptions, updateStackedBarChartSelection } from "./d3StackedBarChart";

export interface StackedBarChartValue {
    label: string;
    value: number;
};

export interface StackedBarChartDataRow {
    id: string;
    label?: string;
    values: StackedBarChartValue[];
};

export interface PieChartProps {
    data: StackedBarChartDataRow[];
    onClick?: (key: string) => void;
    displayOpts?: DisplayProps;
    legendPosition?: "right" | "bottom" | "none";
    title?: string;
}

const Legend = ({ data }: { data: StackedBarChartDataRow[] }) => {
    const colorScale = useMemo(() => {
        const scale: Record<string, string> = {};
        data.forEach((d, i) => {
            scale[d.id] = COLOR_BLIND_FRIENDLY_PALETTES.eight_color[i % 8];
        });
        return scale;
    }, [data]);

    return (
        <div className={styles.legend}>
            {data.map((item) => (
                <div key={item.id} className={styles["legend-item"]}>
                    <div
                        className={styles["legend-color"]}
                        style={{
                            backgroundColor: _isNA(item.id) ? NA_COLOR : colorScale[item.id],
                        }}
                    />
                    <span className={styles["legend-label"]}>{item.label || item.id}</span>
                </div>
            ))}
        </div>
    );
};

const StackedBarChart = ({ data, onClick, displayOpts, title, legendPosition = "right" }: PieChartProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<string | undefined>();

    const chartWidth = displayOpts?.width || 300;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 1);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const handleSelect = (label: string) => {
        setSelectedLabel(label);
        onClick?.(label);
    };

    useEffect(() => {
        if (!chartRef.current) return;

        destroyStackedBarChart(chartRef.current);

        const opts: StackedBarChartOptions = {
            displayOpts: updatedDisplayOpts,
            onClick: handleSelect,
            selectedLabel: selectedLabel,
        };

        stackedBarChart(chartRef.current, data, opts);

        return () => {
            if (chartRef.current) {
                destroyStackedBarChart(chartRef.current);
            }
        };
    }, [data, displayOpts]);

    // Update selection styling (runs when selectedId changes)
    useEffect(() => {
        if (chartRef.current && selectedLabel !== undefined) {
            updateStackedBarChartSelection(chartRef.current, selectedLabel);
        }
    }, [selectedLabel]);

    return (
        <>
            {title && <div className={chartStyles["chart-title"]}>{title}</div>}
            <div
                ref={containerRef}
                className={`${styles["pie-chart-wrapper"]} ${styles[`pie-chart-wrapper-${legendPosition}`]}`}
            >
                <div
                    ref={chartRef}
                    style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
                    className={styles["pie-container"]}
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
