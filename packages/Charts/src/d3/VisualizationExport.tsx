import React, { RefObject } from "react";

import styles from "./VisualizationExport.module.css";

export interface VisualizationExportProps {
    /** Element containing the SVG to export. */
    targetRef: RefObject<HTMLElement | null>;
    /** Download filename. The `.svg` extension is added when omitted. */
    filename?: string;
}

const SVG_STYLE_PROPERTIES = [
    "color",
    "display",
    "dominant-baseline",
    "fill",
    "fill-opacity",
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "letter-spacing",
    "opacity",
    "shape-rendering",
    "stroke",
    "stroke-dasharray",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-opacity",
    "stroke-width",
    "text-anchor",
    "visibility",
] as const;

const getFilename = (filename: string): string => {
    const safeFilename = filename
        .trim()
        .replace(/\.svg$/i, "")
        .replace(/[^a-z0-9_-]+/gi, "-")
        .replace(/^-+|-+$/g, "");
    return `${safeFilename || "visualization"}.svg`;
};

const inlinePresentationStyles = (source: SVGSVGElement, clone: SVGSVGElement): void => {
    const sourceElements = [source, ...Array.from(source.querySelectorAll<SVGElement>("*"))];
    const clonedElements = [clone, ...Array.from(clone.querySelectorAll<SVGElement>("*"))];

    sourceElements.forEach((element, index) => {
        const clonedElement = clonedElements[index];
        if (!clonedElement) return;

        const computedStyle = window.getComputedStyle(element);
        SVG_STYLE_PROPERTIES.forEach((property) => {
            const value = computedStyle.getPropertyValue(property);
            if (value) clonedElement.style.setProperty(property, value);
        });
    });
};

/**
 * Shared React control for downloading a chart's rendered SVG.
 *
 * The export clones the first SVG inside `targetRef` and inlines its computed
 * presentation styles so the downloaded file does not depend on application CSS.
 */
const VisualizationExport = ({
    targetRef,
    filename = "visualization.svg",
}: VisualizationExportProps) => {
    const exportSvg = (): void => {
        const source = targetRef.current?.querySelector<SVGSVGElement>("svg");
        if (!source) return;

        const clone = source.cloneNode(true) as SVGSVGElement;
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        if (source.viewBox.baseVal.width > 0 && source.viewBox.baseVal.height > 0) {
            clone.setAttribute("width", String(source.viewBox.baseVal.width));
            clone.setAttribute("height", String(source.viewBox.baseVal.height));
        }
        inlinePresentationStyles(source, clone);

        const serializedSvg = new XMLSerializer().serializeToString(clone);
        const blob = new Blob([serializedSvg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = getFilename(filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
    };

    return (
        <button
            type="button"
            className={styles["visualization-export-button"]}
            title="Export visualization as SVG"
            onClick={exportSvg}
        >
            <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
            </svg>
            <span>Export SVG</span>
        </button>
    );
};

export default VisualizationExport;
