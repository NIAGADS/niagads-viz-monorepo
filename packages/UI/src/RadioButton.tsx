import { CheckboxProps as RadioButtonProps } from "./Checkbox";
import React from "react";
import styles from "./styles/checkbox.module.css";

export const RadioButton = ({
    variant = "default",
    label,
    onChange,
    disabled = false,
    checked = false,
    alignCenter = false,
}: RadioButtonProps) => {
    const className = [styles["ui-radio"], styles[variant]].filter(Boolean).join(" ");
    return (
        <div className={alignCenter ? styles["centered"] : ""}>
            <input type="radio" className={className} onChange={onChange} checked={checked} disabled={disabled} />
            {label && <label className={styles["ui-checkbox-label"]}>{label}</label>}
        </div>
    );
};
