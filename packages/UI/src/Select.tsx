import React from "react";

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
            <div className={inline ? "md:flex md:items-center" : ""}>
                <div>
                    <label htmlFor={id} className="ui-select-label">
                        {label}
                    </label>
                </div>
                <div>
                    <select
                        name={name ? name : id}
                        defaultValue={defaultValue}
                        id={id}
                        onChange={onChange}
                        className={`ui-select ${variant}`}
                    >
                        {Array.isArray(fields) ? _optionsFromArray(fields) : _optionsFromObj(fields)}
                    </select>
                </div>
            </div>
        </>
    );
};
