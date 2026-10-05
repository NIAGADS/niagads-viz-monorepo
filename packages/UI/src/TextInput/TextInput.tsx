import React from "react";
import { StylingProps } from "../types";
import styles from "./textinput.module.css";

interface TextInputProps extends StylingProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label?: string;
    type?: string;
}

export const TextInput = ({ value, onChange, placeholder, className, style, type = "text" }: TextInputProps) => {
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.currentTarget.value);
    return (
        <input
            className={`${styles["ui-text-input"]} ${className}`}
            style={style}
            onChange={handleChange}
            placeholder={placeholder ? placeholder : "Search"}
            type={type}
            value={value}
        />
    );
};
