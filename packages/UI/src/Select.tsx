import React from "react";

const __TAILWIND_CSS = {
    root: "bg-gray-50 text-gray-900 text-sm block w-full p-2.5",

    // variants
    outline: "border border-solid border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500",
    plain: "bg-white border-0 focus:bg-gray-100",
    underline:
        "bg-white border-t-0 border-l-0 border-r-0 border-b-[1px] border-solid border-black focus:border-blue-500",

    // label
    label: "block p-2 text-sm font-medium text-gray-900",
    inline: "md:flex md:items-center",
};

interface Select {
    fields: string[] | { [key: string]: string } | number[];
    id: string;
    name?: string;
    label?: string;
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
    defaultValue,
    inline = false,
    onChange,
    variant = "outline",
}: Select) => {
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

    return (
        <>
            <div className={inline ? __TAILWIND_CSS.inline : ""}>
                <div>
                    <label htmlFor={id} className={__TAILWIND_CSS.label}>
                        {label}
                    </label>
                </div>
                <div>
                    <select
                        name={name ? name : id}
                        defaultValue={defaultValue}
                        id={id}
                        onChange={onChange}
                        className={`${__TAILWIND_CSS.root} ${__TAILWIND_CSS[variant]}`}
                    >
                        {Array.isArray(fields) ? _optionsFromArray(fields) : _optionsFromObj(fields)}
                    </select>
                </div>
            </div>
        </>
    );
};
