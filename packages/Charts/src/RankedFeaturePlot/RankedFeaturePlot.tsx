import React, { useEffect, useRef } from "react";

import { AxisConfig, DataPointInfo, DisplayProps } from "../d3/types";
import VisualizationExport from "../d3/VisualizationExport";
import VisualizationInfo, { VisualizationInfoContent } from "../d3/VisualizationInfo";
import chartStyles from "../styles/Charts.module.css";
import styles from "./RankedFeaturePlot.module.css";
import { destroyRankedFeaturePlot, getRankedFeaturePlotHeight, rankedFeaturePlot } from "./d3RankedFeaturePlot";

export interface RankedFeaturePlotDataPoint {
    feature_id: string;
    score: number;
    tooltipInfo?: DataPointInfo[];
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
    const defaultInteractions = [
        "Hover or focus a ranked row to inspect its rank and additional details.",
        ...(recordUrlTemplate ? ["Use View record in the persistent tooltip to open the feature record."] : []),
        "Click outside the tooltip, move focus away, or press Escape to close it.",
    ];
    const visualizationInfoContent = visualizationInfo
        ? {
              ...visualizationInfo,
              interactions: visualizationInfo.interactions ?? defaultInteractions,
          }
        : undefined;

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
            <div className={styles["ranked-feature-plot-header"]}>
                {title && <div className={chartStyles["chart-title"]}>{title}</div>}
                <div className={styles["ranked-feature-plot-actions"]}>
                    {visualizationInfoContent && <VisualizationInfo content={visualizationInfoContent} />}
                    <VisualizationExport targetRef={chartRef} filename={title ?? "ranked-feature-plot"} />
                </div>
            </div>

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
