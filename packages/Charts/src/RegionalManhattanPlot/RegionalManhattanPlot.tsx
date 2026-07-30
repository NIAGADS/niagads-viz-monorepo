import React, { useEffect, useMemo, useRef, useState } from "react";

import { AxisConfig, DataPointInfo, DisplayProps } from "../d3/types";
import VisualizationInfo, { VisualizationInfoContent } from "../d3/VisualizationInfo";
import chartStyles from "../styles/Charts.module.css";
import styles from "./RegionalManhattanPlot.module.css";
import {
    destroyRegionalManhattanPlot,
    regionalManhattanPlot,
    RegionalManhattanPlotSummary,
} from "./d3RegionalManhattanPlot";

export interface RegionalManhattanPlotDataPoint {
    position: number;
    score: number;
    colorCategory: string;
    symbolCategory: string;
    feature_id?: string;
    details?: DataPointInfo[];
}

export interface RegionalManhattanPlotLegend {
    colorLabel?: string;
    symbolLabel?: string;
}

export interface RegionalManhattanPlotProps {
    data: RegionalManhattanPlotDataPoint[];
    colorLabels?: string[];
    symbolLabels?: string[];
    threshold?: number;
    thresholdLabel?: string;
    xAxis?: AxisConfig;
    yAxis?: AxisConfig;
    legend?: RegionalManhattanPlotLegend;
    displayOpts?: DisplayProps;
    title?: string;
    visualizationInfo?: VisualizationInfoContent;
    ariaLabel?: string;
}

const unique = (values: string[]): string[] => Array.from(new Set(values));

const getAllLabel = (label: string): string => {
    const noun = label.split(/\s+/).at(-1)?.toLowerCase() ?? label.toLowerCase();
    return `All ${noun.endsWith("s") ? noun : `${noun}s`}`;
};

const RegionalManhattanPlot = ({
    data,
    colorLabels,
    symbolLabels,
    threshold,
    thresholdLabel,
    xAxis,
    yAxis,
    legend,
    displayOpts,
    title,
    visualizationInfo,
    ariaLabel,
}: RegionalManhattanPlotProps) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const derivedColorLabels = useMemo(
        () => colorLabels ?? unique(data.map((datum) => datum.colorCategory)),
        [colorLabels, data]
    );
    const derivedSymbolLabels = useMemo(
        () => symbolLabels ?? unique(data.map((datum) => datum.symbolCategory)),
        [symbolLabels, data]
    );
    const dataExtent = useMemo(() => {
        const positions = data.map((datum) => datum.position);
        const min = xAxis?.min ?? Math.min(...positions);
        const max = xAxis?.max ?? Math.max(...positions);
        return [Number.isFinite(min) ? min : 0, Number.isFinite(max) ? max : 1] as [number, number];
    }, [data, xAxis?.min, xAxis?.max]);
    const maxScore = useMemo(() => Math.ceil(Math.max(0, ...data.map((datum) => datum.score))), [data]);
    const [selectedColor, setSelectedColor] = useState("all");
    const [selectedSymbol, setSelectedSymbol] = useState("all");
    const [minimumScore, setMinimumScore] = useState(0);
    const [viewDomain, setViewDomain] = useState<[number, number]>(dataExtent);
    const [summary, setSummary] = useState<RegionalManhattanPlotSummary>({
        visibleCount: data.length,
    });
    const width = displayOpts?.width ?? 930;
    const numericWidth = typeof width === "number" ? width : 930;
    const height = displayOpts?.height ?? numericWidth * (displayOpts?.aspectRatio ?? 610 / 930);

    useEffect(() => {
        setViewDomain(dataExtent);
    }, [dataExtent]);

    useEffect(() => {
        if (!chartRef.current) return;

        regionalManhattanPlot(chartRef.current, data, {
            colorLabels: derivedColorLabels,
            symbolLabels: derivedSymbolLabels,
            threshold,
            thresholdLabel,
            xAxis,
            yAxis,
            legend,
            displayOpts: { ...displayOpts, height },
            ariaLabel,
            selectedColor,
            selectedSymbol,
            minimumScore,
            fullDomain: dataExtent,
            viewDomain,
            onViewDomainChange: setViewDomain,
            onSummaryChange: setSummary,
        });

        return () => {
            if (chartRef.current) destroyRegionalManhattanPlot(chartRef.current);
        };
    }, [
        data,
        derivedColorLabels,
        derivedSymbolLabels,
        threshold,
        thresholdLabel,
        xAxis,
        yAxis,
        legend,
        displayOpts,
        height,
        ariaLabel,
        selectedColor,
        selectedSymbol,
        minimumScore,
        dataExtent,
        viewDomain,
    ]);

    const reset = () => {
        setSelectedColor("all");
        setSelectedSymbol("all");
        setMinimumScore(0);
        setViewDomain(dataExtent);
    };

    return (
        <div className={styles["regional-manhattan-plot-wrapper"]}>
            {(title || visualizationInfo) && (
                <div className={styles["regional-manhattan-plot-header"]}>
                    {title && <div className={chartStyles["chart-title"]}>{title}</div>}
                    {visualizationInfo && <VisualizationInfo content={visualizationInfo} />}
                </div>
            )}
            <div className={styles["regional-manhattan-plot-controls"]}>
                <label>
                    <span>{legend?.colorLabel ?? "Color"}</span>
                    <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
                        <option value="all">{getAllLabel(legend?.colorLabel ?? "Color")}</option>
                        {derivedColorLabels.map((label) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>{legend?.symbolLabel ?? "Symbol"}</span>
                    <select value={selectedSymbol} onChange={(event) => setSelectedSymbol(event.target.value)}>
                        <option value="all">{getAllLabel(legend?.symbolLabel ?? "Symbol")}</option>
                        {derivedSymbolLabels.map((label) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={styles["regional-manhattan-plot-threshold-control"]}>
                    <span>Minimum {yAxis?.label ?? "score"}: {minimumScore}</span>
                    <input
                        type="range"
                        min={0}
                        max={maxScore}
                        step={1}
                        value={minimumScore}
                        onChange={(event) => setMinimumScore(Number(event.target.value))}
                    />
                </label>
                <button type="button" onClick={reset}>Reset</button>
            </div>
            <div className={styles["regional-manhattan-plot-summary"]} aria-live="polite">
                <div>
                    <span>Visible associations</span>
                    <strong>{summary.visibleCount}</strong>
                </div>
                <div>
                    <span>Strongest association</span>
                    <strong>{summary.strongestScore?.toFixed(1) ?? "—"}</strong>
                </div>
                <div>
                    <span>Lead variant</span>
                    <strong>{summary.leadFeature ?? "—"}</strong>
                </div>
            </div>
            <div
                ref={chartRef}
                className={styles["regional-manhattan-plot-container"]}
                style={{
                    width: typeof width === "number" ? `${width}px` : width,
                    aspectRatio: `${numericWidth} / ${height}`,
                }}
            />
        </div>
    );
};

export default RegionalManhattanPlot;
