import React, { useEffect, useId, useRef, useState } from "react";

import styles from "./VisualizationInfo.module.css";

/** A named visual encoding explained in a chart's information panel. */
export interface VisualizationEncoding {
    /** User-facing encoding name, such as Color, Shape, Size, or Position. */
    label: string;
    /** Explanation of what the encoding represents. */
    description: string;
}

/** Content displayed by the shared visualization information panel. */
export interface VisualizationInfoContent {
    /** Brief explanation of what the visualization shows. */
    description: string;
    /** Essential visual encodings. These supplement rather than replace inline legends. */
    encodings?: VisualizationEncoding[];
    /** Instructions for interacting with the visualization. */
    interactions?: string[];
    /** Filtering, aggregation, or data-handling rules relevant to interpretation. */
    rules?: string[];
}

export interface VisualizationInfoProps {
    /** Structured explanatory content supplied by the chart wrapper. */
    content: VisualizationInfoContent;
}

/**
 * Shared React disclosure for chart explanations.
 *
 * This component intentionally contains no D3 or SVG logic. Chart wrappers place
 * it near their React-rendered title so the same accessible layout works for all
 * visualization renderers. Essential encodings must remain visible in the chart;
 * this panel explains how to read and interact with them.
 */
const VisualizationInfo = ({ content }: VisualizationInfoProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelId = useId();
    const infoRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const closeOutside = (event: PointerEvent | FocusEvent): void => {
            if (event.target instanceof Node && !infoRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent): void => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("focusin", closeOutside);
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("focusin", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    return (
        <div ref={infoRef} className={styles["visualization-info"]}>
            <button
                type="button"
                className={styles["visualization-info-button"]}
                title="About this visualization"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setIsOpen((current) => !current)}
            >
                <span aria-hidden="true">ⓘ</span>
                <span>About this visualization</span>
            </button>
            {isOpen && (
                <section
                    id={panelId}
                    className={styles["visualization-info-panel"]}
                    aria-label="About this visualization"
                >
                    <p>{content.description}</p>
                    {!!content.encodings?.length && (
                        <>
                            <h3>How to read it</h3>
                            <dl>
                                {content.encodings.map((encoding) => (
                                    <div key={encoding.label}>
                                        <dt>{encoding.label}</dt>
                                        <dd>{encoding.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </>
                    )}
                    {!!content.interactions?.length && (
                        <>
                            <h3>Interactions</h3>
                            <ul>
                                {content.interactions.map((interaction) => (
                                    <li key={interaction}>{interaction}</li>
                                ))}
                            </ul>
                        </>
                    )}
                    {!!content.rules?.length && (
                        <>
                            <h3>Filtering and aggregation</h3>
                            <ul>
                                {content.rules.map((rule) => (
                                    <li key={rule}>{rule}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>
            )}
        </div>
    );
};

export default VisualizationInfo;
