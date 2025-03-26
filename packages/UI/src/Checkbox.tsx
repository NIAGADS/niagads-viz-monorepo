import React from "react";


export type CheckboxVariants = "default" | "primary" | "secondary" | "pink" | "accent";
export interface CheckboxProps {
    variant?: CheckboxVariants;
    name: string;
    label?: string;
    checked?: boolean;
    value?: string;
    defaultChecked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void | null;
    disabled?: boolean;
    alignCenter?: boolean;
}

export const Checkbox = ({
    variant = "secondary",
    name,
    value,
    label,
    onChange,
    disabled = false,
    checked = false,
    defaultChecked = false,
    alignCenter = false,
}: CheckboxProps) => {
    const className = `ui-checkbox ${variant}`
    return (
        <div className={alignCenter ? "text-center align-middle" : ""}>
            {defaultChecked ? (
                <input
                    type="checkbox"
                    className={className}
                    name={name}
                    onChange={onChange}
                    disabled={disabled}
                    value={value}
                    defaultChecked={defaultChecked}
                />
            ) : (
                <input
                    type="checkbox"
                    className={className}
                    name={name}
                    onChange={onChange}
                    disabled={disabled}
                    checked={checked}
                    value={value}
                />
            )}

            {label && <label className="text-sm ml-2">{label}</label>}
        </div>
    );
};
