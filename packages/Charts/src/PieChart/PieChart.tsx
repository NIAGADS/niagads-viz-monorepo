import { PieChartOptions, pieChart, updatePieChartSelection } from "../PieChart/pieChart";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { COLOR_BLIND_FRIENDLY_PALETTES } from "@niagads/common";
import { DisplayProps } from "../d3/types";
import styles from "./PieChart.module.css";

export interface PieChartDataRow {
    id: string;
    label: string;
    value: number;
}

export interface PieChartProps {
    data: PieChartDataRow[];
    onClick?: (key: string) => void;
    displayOpts?: DisplayProps;
    legendPosition?: "top" | "right" | "bottom" | "left" | "none";
}

const Legend = ({ data }: { data: PieChartDataRow[] }) => {
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
                            backgroundColor: colorScale[item.id],
                        }}
                    />
                    <span className={styles["legend-label"]}>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const PieChart = ({ data, onClick, displayOpts, legendPosition = "right" }: PieChartProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const chartWidth = displayOpts?.width || 300;
    const chartHeight = chartWidth * (displayOpts?.aspectRatio || 1);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        onClick?.(id);
    };

    // Initial chart draw (runs once on mount)
    useEffect(() => {
        if (chartRef.current && data.length > 0) {
            const opts: PieChartOptions = {
                displayOpts: displayOpts,
                onClick: handleSelect,
            };
            pieChart(chartRef.current, data, opts);
        }
    }, []);

    // Update selection styling (runs when selectedId changes)
    useEffect(() => {
        if (chartRef.current && selectedId !== undefined) {
            updatePieChartSelection(chartRef.current, selectedId);
        }
    }, [selectedId]);

    return (
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
    );
};

export default PieChart;
