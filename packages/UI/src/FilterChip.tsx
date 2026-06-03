import React, { ReactNode } from "react";

import { StylingProps } from "./types";
import styles from "./styles/filterchip.module.css";

export interface FilterChipProps extends StylingProps {
    label: string;
    value?: string;
    onRemove?: () => void;
    selected?: boolean;
    disabled?: boolean;
}

export const FilterChip = ({
    label,
    value,
    onRemove,
    selected = false,
    className = "",
    style = {},
    disabled = false,
}: FilterChipProps) => {
    return (
        <span
            className={[
                styles["chip"],
                selected && styles["selected"],
                disabled && styles["disabled"],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={style}
        >
            {onRemove && !disabled && (
                <button
                    className={styles["remove-btn"]}
                    onClick={onRemove}
                    aria-label={`Remove ${label}`}
                    tabIndex={0}
                    type="button"
                >
                    x
                </button>
            )}

            <span className={styles["label"]}>{label}</span>
            {value && <span className={styles["value"]}>{value}</span>}
        </span>
    );
};

export interface FilterChipBarProps extends StylingProps {
    children: ReactNode;
    label?: string;
    actions?: ReactNode;
}

export const FilterChipBar = ({ label, children, actions, className = "", style = {} }: FilterChipBarProps) => {
    return (
        <div className={[styles["chip-bar"], className].filter(Boolean).join(" ")} style={style}>
            {label && <span className={styles["chip-bar-label"]}>{label}</span>}

            <div className={styles["chip-bar-items"]}>{children}</div>

            {actions && <div className={styles["chip-bar-actions"]}>{actions}</div>}
        </div>
    );
};