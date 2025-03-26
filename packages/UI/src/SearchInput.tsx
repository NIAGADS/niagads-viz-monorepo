import React from "react";

interface SearchInput {
    onChange: (val: string) => void;
    placeholder?: string;
    value: string;
}

export const SearchInput = ({ onChange, placeholder, value }: SearchInput) => {
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.currentTarget.value);

    return (
        <div className="relative">
            <input
                type="search"
                className="ui-search-input"
                placeholder={placeholder || "Search"}
                aria-label="Search"
                onChange={handleChange}
                value={value}
            />
        </div>
    );
};
