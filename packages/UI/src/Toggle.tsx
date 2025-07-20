import React from "react";
import { StylingProps } from "./types";
import styles from "./styles/toggle.module.css";

type ToggleVariant = "default" | "primary";

interface ToggleProps extends StylingProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    variant: ToggleVariant;
}

export const Toggle = ({
    checked,
    onChange,
    disabled = false,
    label = "",
    variant = "default",
    className = "",
    style = {},
}: ToggleProps) => {
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
            {label && <span className={styles.toggleLabel}>{label}</span>}
        </label>
    );
};

export interface ToggleGroupProps {
    toggles: (ToggleProps & { key: string | number })[];
    className?: string;
    style?: React.CSSProperties;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ toggles, className = "", style = {} }) => {
    const isGrid = toggles.length > 5;
    return (
        <div
            className={`${styles.toggleGroup} ${isGrid ? styles.toggleGroupGrid : styles.toggleGroupColumn} ${className}`}
            style={style}
        >
            {toggles.map(({ key, ...toggleProps }) => (
                <Toggle key={key} {...toggleProps} />
            ))}
        </div>
    );
};
