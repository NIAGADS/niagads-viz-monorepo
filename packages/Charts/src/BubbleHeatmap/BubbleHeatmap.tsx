import React, { useEffect, useRef } from "react";

import { DataPointInfo, DisplayProps } from "../d3/types";
import VisualizationExport from "../d3/VisualizationExport";
import VisualizationInfo, { VisualizationInfoContent } from "../d3/VisualizationInfo";
import chartStyles from "../styles/Charts.module.css";
import styles from "./BubbleHeatmap.module.css";
import { bubbleHeatmap, destroyBubbleHeatmap } from "./d3BubbleHeatmap";

export interface BubbleHeatmapAxisLabel {
    value: string;
    secondaryLabel?: string;
}

export interface BubbleHeatmapDataPoint {
    x: string;
    y: string;
    value: number;
    size: number;
    feature_id?: string;
    tooltipInfo?: DataPointInfo[];
}

export interface BubbleHeatmapLegend {
    label?: string;
    colorDescription?: string;
    sizeDescription?: string;
}

export interface BubbleHeatmapProps {
    data: BubbleHeatmapDataPoint[];
    xLabels?: Array<string | BubbleHeatmapAxisLabel>;
    yLabels?: Array<string | BubbleHeatmapAxisLabel>;
    displayOpts?: DisplayProps;
    title?: string;
    visualizationInfo?: VisualizationInfoContent;
    legend?: BubbleHeatmapLegend;
    ariaLabel?: string;
    showLabels?: boolean;
}

const DEFAULT_INTERACTIONS = ["Hover or focus a circle to inspect the association details."];
const DEFAULT_RULES = [
    "Blank grid intersections indicate that no association is present.",
    "Color and size scales are calculated from the supplied data.",
];

const BubbleHeatmap = ({
    data,
    xLabels,
    yLabels,
    displayOpts,
    title,
    visualizationInfo,
    legend,
    ariaLabel,
    showLabels = false,
}: BubbleHeatmapProps) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const width = displayOpts?.width ?? 920;
    const numericWidth = typeof width === "number" ? width : 920;
    const height = displayOpts?.height ?? numericWidth * (displayOpts?.aspectRatio ?? 510 / 920);
    const visualizationInfoContent = visualizationInfo
        ? {
              ...visualizationInfo,
              interactions: visualizationInfo.interactions ?? DEFAULT_INTERACTIONS,
              rules: visualizationInfo.rules ?? DEFAULT_RULES,
          }
        : undefined;

    useEffect(() => {
        if (!chartRef.current) return;

        bubbleHeatmap(chartRef.current, data, {
            xLabels,
            yLabels,
            displayOpts: { ...displayOpts, height },
            legend,
            ariaLabel,
            showLabels,
        });

        return () => {
            if (chartRef.current) destroyBubbleHeatmap(chartRef.current);
        };
    }, [data, xLabels, yLabels, displayOpts, height, legend, ariaLabel, showLabels]);

    return (
        <div className={styles["bubble-heatmap-wrapper"]}>
            <div className={styles["bubble-heatmap-header"]}>
                {title && <div className={chartStyles["chart-title"]}>{title}</div>}
                <div className={styles["bubble-heatmap-actions"]}>
                    {visualizationInfoContent && <VisualizationInfo content={visualizationInfoContent} />}
                    <VisualizationExport targetRef={chartRef} filename={title ?? "bubble-heatmap"} />
                </div>
            </div>
            <div
                ref={chartRef}
                className={styles["bubble-heatmap-container"]}
                style={{
                    width: typeof width === "number" ? `${width}px` : width,
                    aspectRatio: `${numericWidth} / ${height}`,
                }}
            />
        </div>
    );
};

export default BubbleHeatmap;
