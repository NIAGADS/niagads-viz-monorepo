import React from "react";

import { CheckboxProps as RadioButtonProps } from "./Checkbox";

export const RadioButton = ({
    variant = "default",
    label,
    onChange,
    disabled = false,
    checked = false,
    alignCenter = false,
}: RadioButtonProps) => {
    const className = `ui-radio ${variant}`
    return (
        <div className={alignCenter ? "text-center align-middle" : ""}>
            <input type="radio" className={className} onChange={onChange} checked={checked} disabled={disabled} />
            {label && <label className="text-sm ml-2">{label}</label>}
        </div>
    );
};
