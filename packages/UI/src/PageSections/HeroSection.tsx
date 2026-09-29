import React, { ReactNode } from "react";

import { StylingProps } from "../types";
import styles from "./HeroSection.module.css";

// TODO: handle styling/props overloads

interface HeroSectionProps extends StylingProps {
    title: string;
    subtitle?: string;
    search?: ReactNode;
    children?: ReactNode;
    image?: ReactNode;
}

export const HeroSection = ({
    title,
    subtitle,
    search,
    image,
    children,
    className = "",
    style = {},
    id,
}: HeroSectionProps) => {
    const hasRightPanel = children != null || image != null;

    return (
        <section id={id} className={`${styles["hero-section"]} ${className}`} style={style}>
            <div className={`${styles["hero-grid"]} ${!hasRightPanel ? styles["hero-grid-single"] : ""}`}>
                <div className={styles["hero-content"]}>
                    <h1 className={styles["hero-title"]}>{title}</h1>
                    {subtitle && <p className={styles["hero-subtitle"]}>{subtitle}</p>}
                    {search && <div className={styles["hero-search"]}>{search}</div>}
                </div>
                {hasRightPanel && <hr className={styles["hero-divider"]} />}
                {hasRightPanel && (
                    <div className={styles["hero-right-panel"]}>
                        {children}
                        {image && <div className={styles["hero-graphic"]}>{image}</div>}
                    </div>
                )}
            </div>
        </section>
    );
};
