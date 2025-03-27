import React from "react";


interface TextInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label?: string;
}

export const TextInput = ({ value, onChange, placeholder }: TextInputProps) => {
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.currentTarget.value);

    return (
        <input
            className="ui-text-input"
            onChange={handleChange}
            placeholder={placeholder ? placeholder : "Search"}
            type="text"
            value={value}
        />
    );
};
