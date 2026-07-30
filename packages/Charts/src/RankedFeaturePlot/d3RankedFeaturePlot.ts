import * as d3 from "d3";

import { AxisConfig, DisplayProps } from "../d3/types";

import { RankedFeaturePlotDataPoint } from "./RankedFeaturePlot";

export interface RankedFeaturePlotOptions {
    xAxis?: AxisConfig;
    displayOpts?: DisplayProps;
    note?: string;
    recordUrlTemplate?: string;
    ariaLabel?: string;
}

interface RankedFeature extends RankedFeaturePlotDataPoint {
    rank: number;
}

const DEFAULT_WIDTH = 900;
const DEFAULT_ROW_HEIGHT = 31;
const DEFAULT_MARGIN = { top: 28, right: 80, bottom: 82, left: 155 };

interface RankedFeaturePlotContainer extends HTMLElement {
    __rankedFeaturePlotCleanup__?: () => void;
}

export function getRankedFeaturePlotHeight(rowCount: number, margin = DEFAULT_MARGIN): number {
    return margin.top + rowCount * DEFAULT_ROW_HEIGHT + margin.bottom;
}

const getTooltipLines = (datum: RankedFeature) => [{ label: "Rank", value: datum.rank }, ...(datum.details ?? [])];

export function destroyRankedFeaturePlot(container: HTMLElement): void {
    const chartContainer = container as RankedFeaturePlotContainer;
    chartContainer.__rankedFeaturePlotCleanup__?.();
    delete chartContainer.__rankedFeaturePlotCleanup__;
    d3.select(container).selectAll("*").remove();
}

export function rankedFeaturePlot(
    container: HTMLElement,
    data: RankedFeaturePlotDataPoint[],
    options: RankedFeaturePlotOptions = {}
): void {
    destroyRankedFeaturePlot(container);

    const rankedData: RankedFeature[] = [...data]
        .sort((left, right) => d3.descending(left.score, right.score))
        .map((datum, index) => ({ ...datum, rank: index + 1 }));
    const width = typeof options.displayOpts?.width === "number" ? options.displayOpts.width : DEFAULT_WIDTH;
    const margin = options.displayOpts?.margin ?? DEFAULT_MARGIN;
    const height = options.displayOpts?.height ?? getRankedFeaturePlotHeight(rankedData.length, margin);
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);
    const maximumScore = d3.max(rankedData, (datum) => datum.score) ?? 1;
    const x = d3
        .scaleLinear()
        .domain([options.xAxis?.min ?? 0, options.xAxis?.max ?? maximumScore])
        .nice()
        .range([0, plotWidth]);
    const y = d3
        .scaleBand()
        .domain(rankedData.map((datum) => datum.feature_id))
        .range([0, plotHeight])
        .padding(0.34);
    const scoreLabel = options.xAxis?.label ?? "Score";

    const svg = d3
        .select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr("aria-label", options.ariaLabel ?? "Ranked feature lollipop plot with scores on the horizontal axis.");
    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const tooltip = d3
        .select(container)
        .append("div")
        .attr("class", "ranked-feature-plot-tooltip")
        .attr("role", "tooltip")
        .style("display", "none");

    const positionTooltip = (event: PointerEvent | FocusEvent): void => {
        const containerBounds = container.getBoundingClientRect();
        if (event instanceof PointerEvent) {
            const tooltipNode = tooltip.node();
            const tooltipWidth = tooltipNode?.offsetWidth ?? 260;
            const tooltipHeight = tooltipNode?.offsetHeight ?? 120;
            tooltip
                .style(
                    "left",
                    `${Math.min(event.clientX - containerBounds.left + 14, containerBounds.width - tooltipWidth - 12)}px`
                )
                .style(
                    "top",
                    `${Math.min(Math.max(event.clientY - containerBounds.top - 20, 12), containerBounds.height - tooltipHeight - 12)}px`
                );
            return;
        }
        const targetBounds = (event.currentTarget as SVGGraphicsElement).getBoundingClientRect();
        tooltip
            .style("left", `${targetBounds.right - containerBounds.left + 10}px`)
            .style("top", `${targetBounds.top - containerBounds.top}px`);
    };

    const showTooltip = (event: PointerEvent | FocusEvent, datum: RankedFeature): void => {
        tooltip.html("");
        const title = tooltip.append("div").attr("class", "ranked-feature-plot-tooltip-title");
        title.append("span").text(datum.feature_id);
        if (options.recordUrlTemplate) {
            const recordLink = title
                .append("a")
                .attr("class", "ranked-feature-plot-tooltip-record-link")
                .attr(
                    "href",
                    options.recordUrlTemplate.split("<feature_id>").join(encodeURIComponent(datum.feature_id))
                )
                .attr("target", "_blank")
                .attr("rel", "noopener noreferrer")
                .attr("title", "View record")
                .attr("aria-label", `View record for ${datum.feature_id}`);
            const icon = recordLink
                .append("svg")
                .attr("viewBox", "0 0 24 24")
                .attr("width", 13)
                .attr("height", 13)
                .attr("fill", "none")
                .attr("stroke", "currentColor")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("aria-hidden", "true");
            icon.append("path").attr("d", "M15 3h6v6");
            icon.append("path").attr("d", "M10 14 21 3");
            icon.append("path").attr("d", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6");
        }
        getTooltipLines(datum).forEach((line) => {
            const row = tooltip.append("div").attr("class", "ranked-feature-plot-tooltip-row");
            row.append("span").attr("class", "ranked-feature-plot-tooltip-key").text(line.label);
            row.append("span").text(String(line.value));
        });
        tooltip.style("display", "block");
        positionTooltip(event);
    };

    const ticks = x.ticks(6);
    root.append("g")
        .attr("class", "ranked-feature-plot-grid")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(
            d3
                .axisBottom(x)
                .tickValues(ticks)
                .tickSize(-plotHeight)
                .tickFormat(() => "")
        )
        .call((group) => group.select(".domain").remove());

    const rowHighlight = root
        .append("g")
        .append("rect")
        .attr("class", "ranked-feature-plot-highlight")
        .attr("x", -margin.left + 8)
        .attr("width", width - 24)
        .attr("height", y.bandwidth() + 8)
        .attr("rx", 8)
        .style("display", "none");

    const showRowHighlight = (datum: RankedFeature): void => {
        rowHighlight.attr("y", (y(datum.feature_id) ?? 0) - 4).style("display", null);
    };

    const hideRowHighlight = (): void => {
        rowHighlight.style("display", "none");
    };

    root.append("g")
        .selectAll("line")
        .data(rankedData)
        .join("line")
        .attr("class", "ranked-feature-plot-stem")
        .attr("x1", x(0))
        .attr("x2", (datum) => x(datum.score))
        .attr("y1", (datum) => (y(datum.feature_id) ?? 0) + y.bandwidth() / 2)
        .attr("y2", (datum) => (y(datum.feature_id) ?? 0) + y.bandwidth() / 2);

    const points = root
        .append("g")
        .selectAll("circle")
        .data(rankedData)
        .join("circle")
        .attr("class", "ranked-feature-plot-point")
        .attr("cx", (datum) => x(datum.score))
        .attr("cy", (datum) => (y(datum.feature_id) ?? 0) + y.bandwidth() / 2)
        .attr("r", 8);

    root.append("g")
        .selectAll("text")
        .data(rankedData)
        .join("text")
        .attr("class", "ranked-feature-plot-feature-label")
        .attr("x", -14)
        .attr("y", (datum) => (y(datum.feature_id) ?? 0) + y.bandwidth() / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .text((datum) => datum.feature_id);

    root.append("g")
        .selectAll("text")
        .data(rankedData)
        .join("text")
        .attr("class", "ranked-feature-plot-value-label")
        .attr("x", (datum) => x(datum.score) + 13)
        .attr("y", (datum) => (y(datum.feature_id) ?? 0) + y.bandwidth() / 2)
        .attr("dominant-baseline", "middle")
        .text((datum) => d3.format(".2f")(datum.score));

    const setPointActive = (datum: RankedFeature, active: boolean): void => {
        points
            .filter((point) => point.feature_id === datum.feature_id)
            .classed("ranked-feature-plot-point-active", active);
    };

    const clearActiveRow = (): void => {
        points.classed("ranked-feature-plot-point-active", false);
        hideRowHighlight();
        tooltip.style("display", "none");
    };

    const activateRow = (event: PointerEvent | FocusEvent, datum: RankedFeature): void => {
        points.classed("ranked-feature-plot-point-active", false);
        setPointActive(datum, true);
        showRowHighlight(datum);
        showTooltip(event, datum);
    };

    const rowTargets = root
        .append("g")
        .selectAll("rect")
        .data(rankedData)
        .join("rect")
        .attr("class", "ranked-feature-plot-row-target")
        .attr("x", -margin.left + 8)
        .attr("y", (datum) => (y(datum.feature_id) ?? 0) - 4)
        .attr("width", width - 24)
        .attr("height", y.bandwidth() + 8)
        .attr("rx", 8)
        .attr("tabindex", 0)
        .attr("role", "img")
        .attr("aria-label", (datum) =>
            [
                datum.feature_id,
                `${scoreLabel} ${datum.score}`,
                ...getTooltipLines(datum).map((line) => `${line.label} ${line.value}`),
            ].join(", ")
        )
        .on("pointerenter", (event: PointerEvent, datum) => {
            activateRow(event, datum);
        })
        .on("focus", (event: FocusEvent, datum) => {
            activateRow(event, datum);
        });

    const isWithinActiveUI = (target: EventTarget | null): boolean => {
        if (!(target instanceof Node)) return false;
        return (
            !!tooltip.node()?.contains(target) || rowTargets.nodes().some((node) => (node as Element).contains(target))
        );
    };
    const handleOutsidePointer = (event: PointerEvent): void => {
        if (!isWithinActiveUI(event.target)) clearActiveRow();
    };
    const handleFocusChange = (event: FocusEvent): void => {
        if (!isWithinActiveUI(event.target)) clearActiveRow();
    };
    const handleEscape = (event: KeyboardEvent): void => {
        if (event.key === "Escape") clearActiveRow();
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("keydown", handleEscape);
    (container as RankedFeaturePlotContainer).__rankedFeaturePlotCleanup__ = () => {
        document.removeEventListener("pointerdown", handleOutsidePointer);
        document.removeEventListener("focusin", handleFocusChange);
        document.removeEventListener("keydown", handleEscape);
    };

    root.append("g")
        .attr("class", "ranked-feature-plot-axis")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(d3.axisBottom(x).tickValues(ticks).tickSizeOuter(0));

    root.append("text")
        .attr("class", "ranked-feature-plot-axis-title")
        .attr("x", plotWidth / 2)
        .attr("y", plotHeight + 45)
        .attr("text-anchor", "middle")
        .text(scoreLabel);

    if (options.note) {
        root.append("text")
            .attr("class", "ranked-feature-plot-note")
            .attr("x", 0)
            .attr("y", plotHeight + 70)
            .text(options.note);
    }
}
