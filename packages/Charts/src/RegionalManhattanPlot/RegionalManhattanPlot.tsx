import React, { useEffect, useMemo, useRef, useState } from "react";

import { AxisConfig, DataPointInfo, DisplayProps } from "../d3/types";
import VisualizationExport from "../d3/VisualizationExport";
import VisualizationInfo, { VisualizationInfoContent } from "../d3/VisualizationInfo";
import chartStyles from "../styles/Charts.module.css";
import styles from "./RegionalManhattanPlot.module.css";
import {
    RegionalManhattanPlotSummary,
    destroyRegionalManhattanPlot,
    regionalManhattanPlot,
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

export interface RegionalManhattanPlotGene {
    gene_symbol: string;
    chr: string;
    start: number;
    end: number;
    strand: "+" | "-";
    flankBp?: number;
}

export interface RegionalManhattanPlotData {
    points: RegionalManhattanPlotDataPoint[];
    gene?: RegionalManhattanPlotGene;
}

export interface RegionalManhattanPlotProps {
    data: RegionalManhattanPlotData;
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
    const { points, gene } = data;
    const derivedColorLabels = useMemo(
        () => colorLabels ?? unique(points.map((datum) => datum.colorCategory)),
        [colorLabels, points]
    );
    const derivedSymbolLabels = useMemo(
        () => symbolLabels ?? unique(points.map((datum) => datum.symbolCategory)),
        [symbolLabels, points]
    );
    const dataExtent = useMemo(() => {
        const positions = points.map((datum) => datum.position);
        const min = xAxis?.min ?? Math.min(...positions);
        const max = xAxis?.max ?? Math.max(...positions);
        return [Number.isFinite(min) ? min : 0, Number.isFinite(max) ? max : 1] as [number, number];
    }, [points, xAxis?.min, xAxis?.max]);
    const initialViewDomain = useMemo(() => {
        if (!gene) return dataExtent;

        const flankBp = gene.flankBp ?? 500_000;
        const min = (Math.min(gene.start, gene.end) - flankBp) / 1_000_000;
        const max = (Math.max(gene.start, gene.end) + flankBp) / 1_000_000;
        const domain = [Math.max(dataExtent[0], min), Math.min(dataExtent[1], max)] as [number, number];
        return domain[0] < domain[1] ? domain : dataExtent;
    }, [dataExtent, gene]);
    const maxScore = useMemo(() => Math.ceil(Math.max(0, ...points.map((datum) => datum.score))), [points]);
    const [selectedColor, setSelectedColor] = useState("all");
    const [selectedSymbol, setSelectedSymbol] = useState("all");
    const [minimumScore, setMinimumScore] = useState(0);
    const [viewDomain, setViewDomain] = useState<[number, number]>(initialViewDomain);
    const [summary, setSummary] = useState<RegionalManhattanPlotSummary>({
        visibleCount: points.length,
    });
    const width = displayOpts?.width ?? 930;
    const numericWidth = typeof width === "number" ? width : 930;
    const height = displayOpts?.height ?? numericWidth * (displayOpts?.aspectRatio ?? 610 / 930);

    useEffect(() => {
        setViewDomain(initialViewDomain);
    }, [initialViewDomain]);

    useEffect(() => {
        if (!chartRef.current) return;

        regionalManhattanPlot(chartRef.current, points, {
            colorLabels: derivedColorLabels,
            symbolLabels: derivedSymbolLabels,
            threshold,
            thresholdLabel,
            xAxis,
            yAxis,
            legend,
            gene,
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
        points,
        derivedColorLabels,
        derivedSymbolLabels,
        threshold,
        thresholdLabel,
        xAxis,
        yAxis,
        legend,
        gene,
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
        setViewDomain(initialViewDomain);
    };

    return (
        <div className={styles["regional-manhattan-plot-wrapper"]}>
            <div className={styles["regional-manhattan-plot-header"]}>
                {title && <div className={chartStyles["chart-title"]}>{title}</div>}
                <div className={styles["regional-manhattan-plot-actions"]}>
                    {visualizationInfo && <VisualizationInfo content={visualizationInfo} />}
                    <VisualizationExport targetRef={chartRef} filename={title ?? "regional-manhattan-plot"} />
                </div>
            </div>
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
                    <span>
                        Minimum {yAxis?.label ?? "score"}: {minimumScore}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={maxScore}
                        step={1}
                        value={minimumScore}
                        onChange={(event) => setMinimumScore(Number(event.target.value))}
                    />
                </label>
                <button type="button" onClick={reset}>
                    Reset
                </button>
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
