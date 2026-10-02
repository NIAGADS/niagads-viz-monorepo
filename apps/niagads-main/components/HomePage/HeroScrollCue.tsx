import React from "react";
import styles from "./hero-scroll-cue.module.css";

interface HeroScrollCueProps {
    href: string;
    label?: string;
}

export const HeroScrollCue = ({
    href,
    label = "Explore",
}: HeroScrollCueProps) => {
    return (
        <div className={styles["hero-scroll-cue"]}>
            <span className={styles["hero-scroll-label"]}>
                {label}
            </span>

            <a
                href={href}
                className={styles["hero-scroll-button"]}
                aria-label={`Scroll to ${label}`}
            >
                <span aria-hidden="true">⌄</span>
            </a>
        </div>
    );
};