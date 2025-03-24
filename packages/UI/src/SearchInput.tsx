import React from "react";

const __TAILWIND_CSS = {
    root: "relative m-0 block w-full rounded border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-blue-500 focus:shadow-inset focus:outline-none motion-reduce:transition-none",
};

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
                className={__TAILWIND_CSS.root}
                placeholder={placeholder || "Search"}
                aria-label="Search"
                onChange={handleChange}
                value={value}
            />
        </div>
    );
};
