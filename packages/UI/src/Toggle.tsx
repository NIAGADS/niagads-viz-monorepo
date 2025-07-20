import React, { ReactNode } from "react";

import { StylingProps } from "./types";
import styles from "./styles/toggle.module.css";

type ToggleVariant = "default" | "primary";

interface ToggleProps extends StylingProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    variant: ToggleVariant;
    truncateLabel?: boolean;
}

function truncate(label: string, maxLength = 15): string {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength) + "...";
}

export const Toggle = ({
    checked,
    onChange,
    disabled = false,
    label = "",
    variant = "default",
    truncateLabel = false,
    className = "",
    style = {},
}: ToggleProps) => {
    const displayLabel = truncateLabel ? truncate(label) : label;
    const isTruncated = label !== displayLabel;
    return (
        <label className={`${styles.toggleSwitch} ${className}`} style={style}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className={styles.toggleInput}
            />
            <span className={`${styles.toggleSlider} ${variant !== "default" ? styles[variant] : ""}`} />
            {label && (
                <span className={styles.toggleLabel} title={isTruncated ? label : undefined}>
                    {displayLabel}
                </span>
            )}
        </label>
    );
};

export interface ToggleGroupProps extends StylingProps {
    children: ReactNode;
    asGrid: boolean;
}

export const ToggleGroup = ({ children, asGrid = false, className = "", style = {} }: ToggleGroupProps) => {
    return (
        <div
            className={`${styles.toggleGroup} ${asGrid ? styles.toggleGroupGrid : styles.toggleGroupColumn} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};
