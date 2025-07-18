import { CheckboxProps as RadioButtonProps } from "./Checkbox";
import React from "react";

export const RadioButton = ({
    variant = "default",
    label,
    onChange,
    disabled = false,
    checked = false,
    alignCenter = false,
}: RadioButtonProps) => {
    const className = `ui-radio ${variant}`;
    return (
        <div className={alignCenter ? "centered" : ""}>
            <input type="radio" className={className} onChange={onChange} checked={checked} disabled={disabled} />
            {label && <label className="ui-checkbox-label">{label}</label>}
        </div>
    );
};
