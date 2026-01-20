import React from "react";
import styles from "./styles/select.module.css";

interface SelectProps {
    fields: string[] | { [key: string]: string } | number[];
    id: string;
    name?: string;
    label?: string;
    value?: string;
    defaultValue?: string;
    inline?: boolean;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    variant?: "outline" | "underline" | "plain"; // select design: one of `outline`, `underline`, or `plain`
}

export const Select = ({
    fields,
    id,
    label,
    name,
    value,
    defaultValue,
    inline = false,
    onChange,
    variant = "outline",
}: SelectProps) => {
    const _optionsFromArray = (values: string[] | number[]) =>
        values.map((v) => (
            <option key={v.toString()} value={v}>
                {v}
            </option>
        ));

    const _optionsFromObj = (fieldMap: any) =>
        Object.entries(fieldMap).map(([k, v]) => (
            <option key={k} value={v as string}>
                {k}
            </option>
        ));


    const wrapperClassName = `${styles["select-wrapper"]} ${inline ? styles["select-inline"] : ""}`;
    const labelClassName = `${styles["select-label"]} ${inline ? styles["select-inline"] : ""}`;

    return (
        <div className={wrapperClassName}>
            <div>
                <label htmlFor={id} className={labelClassName}>
                    {label}
                </label>
            </div>
            <div>
                <select
                    name={name ? name : id}
                    defaultValue={defaultValue}
                    id={id}
                    onChange={onChange}
                    className={`${styles.select} ${styles[variant]}`}
                    value={value}
                >
                    <option key="default" value="">Select...</option>
                    {Array.isArray(fields) ? _optionsFromArray(fields) : _optionsFromObj(fields)}
                </select>
            </div>
        </div>
    );
};
