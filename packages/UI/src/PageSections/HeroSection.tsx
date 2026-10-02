import React, { ReactNode } from "react";

import { StylingProps } from "../types";
import styles from "./hero-section.module.css";

// TODO: handle styling/props overloads

interface HeroSectionProps extends StylingProps {
    title: ReactNode;
    subtitle?: string;
    search?: ReactNode;
    belowSearch?: ReactNode;
    children?: ReactNode;
    image?: ReactNode;
    scrollCue?: ReactNode;
    classNames?: {
        grid?: string;
        content?: string;
        title?: string;
        subtitle?: string;
        search?: string;
        belowSearch?: string;
        rightPanel?: string;
        divider?: string;
        scrollCue?: string;
    };
}

export const HeroSection = ({
    title,
    subtitle,
    search,
    belowSearch,
    image,
    children,
    scrollCue,
    className = "",
    classNames = {},
    style = {},
    id,
}: HeroSectionProps) => {
    const hasRightPanel = children != null || image != null;

    return (
        <section id={id} className={`${styles["hero-section"]} ${className}`} style={style}>
            <div
                className={`${styles["hero-grid"]} ${!hasRightPanel ? styles["hero-grid-single"] : ""} ${classNames.grid || ""}`}
            >
                <div className={`${styles["hero-content"]} ${classNames.content || ""}`}>
                    <h1 className={`${styles["hero-title"]} ${classNames.title || ""}`}>{title}</h1>
                    {subtitle && (
                        <p className={`${styles["hero-subtitle"]} ${classNames.subtitle || ""}`}>{subtitle}</p>
                    )}
                    {search && <div className={`${styles["hero-search"]} ${classNames.search || ""}`}>{search}</div>}
                    {belowSearch && <div className={classNames.belowSearch || ""}>{belowSearch}</div>}
                </div>
                {hasRightPanel && <hr className={`${styles["hero-divider"]} ${classNames.divider || ""}`} />}
                {hasRightPanel && (
                    <div className={`${styles["hero-right-panel"]} ${classNames.rightPanel || ""}`}>
                        {children}
                        {image && <div className={styles["hero-graphic"]}>{image}</div>}
                    </div>
                )}
            </div>
            {scrollCue && (
                <div className={`${styles["hero-scroll-cue"]} ${classNames.scrollCue || ""}`}>{scrollCue}</div>
            )}
        </section>
    );
};
