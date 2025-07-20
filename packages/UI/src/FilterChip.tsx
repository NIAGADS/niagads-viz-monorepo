import React, { ReactNode } from "react";

import { StylingProps } from "./types";
import styles from "./styles/filterchip.module.css";

export interface FilterChipProps extends StylingProps {
    label: string;
    onRemove?: () => void;
    selected?: boolean;
    disabled?: boolean;
}

export const FilterChip = ({
    label,
    onRemove,
    selected = false,
    className = "",
    style = {},
    disabled = false,
}: FilterChipProps) => {
    return (
        <span
            className={`${styles.chip} ${selected ? styles.selected : ""} ${disabled ? styles.disabled : ""} ${className}`}
            style={style}
        >
            {onRemove && !disabled && (
                <button
                    className={styles.removeBtn}
                    onClick={onRemove}
                    aria-label={`Remove ${label}`}
                    tabIndex={0}
                    type="button"
                >
                    ×
                </button>
            )}
            <span className={styles.label}>{label}</span>
        </span>
    );
};

export interface FilterChipBarProps extends StylingProps {
    children: ReactNode;
    label?: string;
}

export const FilterChipBar = ({ label, children, className = "", style = {} }: FilterChipBarProps) => {
    return (
        <div className={`${styles.chipBar || ""} ${className}`} style={style}>
            {label && <span className={styles.chipBarLabel}>{label}</span>}
            {children}
        </div>
    );
};
