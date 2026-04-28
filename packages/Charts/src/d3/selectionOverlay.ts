import * as d3 from "d3";

import { Range } from "@niagads/common";

export type SelectionMode = "range" | "threshold";
export type ThresholdHandle = "min" | "max";

export interface SelectionOverlayOptions {
    root: d3.Selection<SVGGElement, unknown, null, undefined>;
    xScale: d3.ScaleLinear<number, number>;
    plotHeight: number;
    domain: Range;
    selection: Range;
    mode: SelectionMode;
    step?: number;
    thresholdHandle?: ThresholdHandle;
    onChange?: (selection: Range) => void;
}

export interface SelectionOverlayInstance {
    update(selection: Range): void;
}

const OVERLAY_COLORS = {
    bandFill: "rgba(217, 119, 6, 0.12)",
    bandStroke: "#d97706",
    handleFill: "#ffffff",
    handleStroke: "#a65b00",
    handleGrip: "#d97706",
} as const;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function snap(value: number, domainMin: number, step?: number): number {
    if (!step || step <= 0) {
        return value;
    }
    const steps = Math.round((value - domainMin) / step);
    return domainMin + steps * step;
}

function normalizeRange(selection: Range, domain: Range): Range {
    console.log(`selection - ${selection.min} - ${selection.max}`);
    console.log(`domain - ${domain.min} - ${domain.max}`);
    const min = clamp(selection.min, domain.min, domain.max);
    const max = clamp(selection.max, domain.min, domain.max);
    console.log(`normalized - ${min} - ${max}`);

    return { min: Math.min(min, max), max: Math.max(min, max) };
}

function getHandleValues(selection: Range, mode: SelectionMode, thresholdHandle: ThresholdHandle): number[] {
    if (mode === "range") {
        return [selection.min, selection.max];
    }
    return [thresholdHandle === "min" ? selection.min : selection.max];
}

function getSelectionFromHandle(
    value: number,
    selection: Range,
    domain: Range,
    mode: SelectionMode,
    thresholdHandle: ThresholdHandle,
    handleIndex: number
): Range {
    if (mode === "threshold") {
        return thresholdHandle === "min" ? { min: value, max: domain.max } : { min: domain.min, max: value };
    }

    if (handleIndex === 0) {
        return { min: Math.min(value, selection.max), max: selection.max };
    }
    return { min: selection.min, max: Math.max(value, selection.min) };
}

function getBandBounds(selection: Range, xScale: d3.ScaleLinear<number, number>) {
    return {
        x: xScale(selection.min),
        width: Math.max(0, xScale(selection.max) - xScale(selection.min)),
    };
}

export function createSelectionOverlay(opts: SelectionOverlayOptions): SelectionOverlayInstance {
    const thresholdHandle = opts.thresholdHandle || "max";
    let selection = normalizeRange(opts.selection, opts.domain);

    const overlay = opts.root.append("g").attr("class", "chart-selection-overlay");

    const band = overlay
        .append("rect")
        .attr("class", "chart-selection-band")
        .attr("y", 0)
        .attr("height", opts.plotHeight)
        .attr("fill", OVERLAY_COLORS.bandFill)
        .attr("stroke", OVERLAY_COLORS.bandStroke)
        .attr("stroke-width", 1)
        .attr("pointer-events", "none");

    const handles = overlay
        .append("g")
        .attr("class", "chart-selection-handles")
        .selectAll<SVGGElement, number>(".chart-selection-handle")
        .data(getHandleValues(selection, opts.mode, thresholdHandle))
        .join((enter) => {
            const handle = enter.append("g").attr("class", "chart-selection-handle").style("cursor", "ew-resize");

            handle
                .append("line")
                .attr("class", "chart-selection-handle-line")
                .attr("y1", 0)
                .attr("y2", opts.plotHeight)
                .attr("stroke", OVERLAY_COLORS.handleStroke)
                .attr("stroke-width", 2.5);

            handle
                .append("rect")
                .attr("class", "chart-selection-handle-hitbox")
                .attr("x", -8)
                .attr("y", 0)
                .attr("width", 16)
                .attr("height", opts.plotHeight)
                .attr("fill", "transparent");

            handle
                .append("rect")
                .attr("class", "chart-selection-handle-grip")
                .attr("x", -5)
                .attr("y", Math.max(8, opts.plotHeight / 2 - 18))
                .attr("rx", 4)
                .attr("width", 10)
                .attr("height", 36)
                .attr("fill", OVERLAY_COLORS.handleFill)
                .attr("stroke", OVERLAY_COLORS.handleStroke)
                .attr("stroke-width", 1.5);

            handle
                .append("line")
                .attr("class", "chart-selection-handle-grip-mark")
                .attr("x1", -2)
                .attr("x2", -2)
                .attr("y1", Math.max(16, opts.plotHeight / 2 - 10))
                .attr("y2", Math.max(16, opts.plotHeight / 2 + 10))
                .attr("stroke", OVERLAY_COLORS.handleGrip)
                .attr("stroke-width", 1.5);

            handle
                .append("line")
                .attr("class", "chart-selection-handle-grip-mark")
                .attr("x1", 2)
                .attr("x2", 2)
                .attr("y1", Math.max(16, opts.plotHeight / 2 - 10))
                .attr("y2", Math.max(16, opts.plotHeight / 2 + 10))
                .attr("stroke", OVERLAY_COLORS.handleGrip)
                .attr("stroke-width", 1.5);

            return handle;
        });

    function updateVisuals(nextSelection: Range) {
        selection = normalizeRange(nextSelection, opts.domain);

        const { x, width } = getBandBounds(selection, opts.xScale);
        band.attr("x", x).attr("width", width);

        handles
            .data(getHandleValues(selection, opts.mode, thresholdHandle))
            .attr("transform", (d) => `translate(${opts.xScale(d)},0)`);
    }

    handles.call(
        d3.drag<SVGGElement, number>().on("drag", function (event, _d) {
            const pointerX = clamp(event.x, 0, opts.xScale.range()[1]);
            const atRightEdge = pointerX >= opts.xScale.range()[1];
            const rawValue = atRightEdge ? opts.domain.max : opts.xScale.invert(pointerX);
            const snappedValue = clamp(snap(rawValue, opts.domain.min, opts.step), opts.domain.min, opts.domain.max);

            const handleIndex = handles.nodes().indexOf(this);
            const nextSelection = normalizeRange(
                getSelectionFromHandle(snappedValue, selection, opts.domain, opts.mode, thresholdHandle, handleIndex),
                opts.domain
            );

            updateVisuals(nextSelection);
            opts.onChange?.(nextSelection);
        })
    );

    updateVisuals(selection);

    return {
        update(nextSelection: Range) {
            updateVisuals(nextSelection);
        },
    };
}
