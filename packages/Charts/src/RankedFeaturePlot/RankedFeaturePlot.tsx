import React, { useEffect, useRef } from "react";

import { AxisConfig, DataPointInfo, DisplayProps } from "../d3/types";
import VisualizationInfo, { VisualizationInfoContent } from "../d3/VisualizationInfo";
import chartStyles from "../styles/Charts.module.css";
import styles from "./RankedFeaturePlot.module.css";
import {
    destroyRankedFeaturePlot,
    getRankedFeaturePlotHeight,
    rankedFeaturePlot,
} from "./d3RankedFeaturePlot";

export interface RankedFeaturePlotDataPoint {
    feature_id: string;
    score: number;
    details?: DataPointInfo[];
}

export interface RankedFeaturePlotProps {
    data: RankedFeaturePlotDataPoint[];
    xAxis?: AxisConfig;
    displayOpts?: DisplayProps;
    title?: string;
    note?: string;
    recordUrlTemplate?: string;
    visualizationInfo?: VisualizationInfoContent;
    ariaLabel?: string;
}

const RankedFeaturePlot = ({
    data,
    xAxis,
    displayOpts,
    title,
    note,
    recordUrlTemplate,
    visualizationInfo,
    ariaLabel,
}: RankedFeaturePlotProps) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const width = displayOpts?.width ?? 900;
    const numericWidth = typeof width === "number" ? width : 900;
    const height = displayOpts?.height ?? getRankedFeaturePlotHeight(data.length, displayOpts?.margin);

    useEffect(() => {
        if (!chartRef.current) return;

        rankedFeaturePlot(chartRef.current, data, {
            xAxis,
            displayOpts: { ...displayOpts, height },
            note,
            recordUrlTemplate,
            ariaLabel,
        });

        return () => {
            if (chartRef.current) destroyRankedFeaturePlot(chartRef.current);
        };
    }, [data, xAxis, displayOpts, height, note, recordUrlTemplate, ariaLabel]);

    return (
        <div className={styles["ranked-feature-plot-wrapper"]}>
            {(title || visualizationInfo) && (
                <div className={styles["ranked-feature-plot-header"]}>
                    {title && <div className={chartStyles["chart-title"]}>{title}</div>}
                    {visualizationInfo && <VisualizationInfo content={visualizationInfo} />}
                </div>
            )}
            <div
                ref={chartRef}
                className={styles["ranked-feature-plot-container"]}
                style={{
                    width: typeof width === "number" ? `${width}px` : width,
                    aspectRatio: `${numericWidth} / ${height}`,
                }}
            />
        </div>
    );
};

export default RankedFeaturePlot;
