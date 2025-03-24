import React from "react";

const __TAILWIND_CSS = {
    root: "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 my-2.5",
};

type TextInputSizes = "sm" | "md" | "lg";
interface TextInput {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label?: string;
}

export const TextInput = ({ value, onChange, placeholder }: TextInput) => {
    const classes = `${__TAILWIND_CSS.root}`;
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.currentTarget.value);

    return (
        <input
            className={classes}
            onChange={handleChange}
            placeholder={placeholder ? placeholder : "Search"}
            type="text"
            value={value}
        />
    );
};
