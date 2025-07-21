import React from "react";
import { StylingProps } from "./types";
import styles from "./styles/textinput.module.css";

interface TextInputProps extends StylingProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label?: string;
}

export const TextInput = ({ value, onChange, placeholder, className, style }: TextInputProps) => {
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.currentTarget.value);
    return (
        <input
            className={`${styles["ui-text-input"]} ${className}`}
            style={style}
            onChange={handleChange}
            placeholder={placeholder ? placeholder : "Search"}
            type="text"
            value={value}
        />
    );
};
