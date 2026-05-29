import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

import { _isNA } from "@niagads/common";
import { NA_COLOR, PieChartOptions, destroyPieChart, pieChart, updatePieChartSelection } from "./d3PieChart";

import { DisplayProps } from "../d3/types";
import chartStyles from "../styles/Charts.module.css";
import styles from "./PieChart.module.css";

export interface PieChartDataRow {
    id: string;
    label?: string;
    value: number;
}

export interface PieChartProps {
    data: PieChartDataRow[];
    referenceData?: PieChartDataRow[];
    onClick?: (key: string) => void;
    displayOpts?: DisplayProps;
    legendPosition?: "right" | "bottom" | "none";
    title?: string;
}

const getCombinedData = (data: PieChartDataRow[], referenceData?: PieChartDataRow[]): PieChartDataRow[] => {
    const combinedData = new Map<string, PieChartDataRow>();

    referenceData?.forEach((d) => combinedData.set(d.id, d));
    data.forEach((d) => {
        if (!combinedData.has(d.id)) {
            combinedData.set(d.id, d);
        }
    });

    return Array.from(combinedData.values());
};

const Legend = ({ data, referenceData }: { data: PieChartDataRow[]; referenceData?: PieChartDataRow[] }) => {
    const legendData = useMemo(() => getCombinedData(data, referenceData), [data, referenceData]);

    const colorScale = useMemo(() => {
        const scale: Record<string, string> = {};
        legendData.forEach((d, i) => {
            scale[d.id] = d3.schemeCategory10[i % d3.schemeCategory10.length];
        });
        return scale;
    }, [legendData]);

    return (
        <div className={styles.legend}>
            {legendData.map((item) => (
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

const PieChart = ({ data, referenceData, onClick, displayOpts, title, legendPosition = "right" }: PieChartProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const chartWidth = displayOpts?.width || 300;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 1);

    const updatedDisplayOpts = {
        ...displayOpts,
        width: chartWidth,
        height: chartHeight,
    };

    const handleSelect = (id: string) => {
        setSelectedId(id);
        onClick?.(id);
    };

    useEffect(() => {
        if (!chartRef.current) return;

        destroyPieChart(chartRef.current);

        const opts: PieChartOptions = {
            displayOpts: updatedDisplayOpts,
            referenceData,
            onClick: handleSelect,
            selectedId,
        };
        pieChart(chartRef.current, data, opts);

        return () => {
            if (chartRef.current) {
                destroyPieChart(chartRef.current);
            }
        };
    }, [data, referenceData, displayOpts]);

    // Update selection styling (runs when selectedId changes)
    useEffect(() => {
        if (chartRef.current && selectedId !== undefined) {
            updatePieChartSelection(chartRef.current, selectedId);
        }
    }, [selectedId]);

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
                        <Legend data={data} referenceData={referenceData} />
                    </div>
                )}
            </div>
        </>
    );
};

export default PieChart;
