import type { ChangeEventHandler, CSSProperties } from "react";

export interface SelectProps {
    /** Array of values, or a { label: value } map. */
    fields: string[] | Record<string, string>;
    id?: string;
    label?: string;
    value?: string;
    defaultValue?: string;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    inline?: boolean;
    variant?: "outline" | "plain" | "underline";
    className?: string;
    style?: CSSProperties;
}

const VARIANTS: Record<string, CSSProperties> = {
    outline: { border: "1px solid var(--gray-300)", borderRadius: "0.5rem", backgroundColor: "var(--gray-50)" },
    plain: { border: 0, backgroundColor: "#fff" },
    underline: { border: 0, borderBottom: "1px solid #000", backgroundColor: "#fff" },
};

/** NIAGADS Select — labeled native select. */
export function Select({
    fields,
    id,
    label,
    value,
    defaultValue,
    onChange,
    inline = false,
    variant = "outline",
    className = "",
    style = {},
}: SelectProps) {
    const options = Array.isArray(fields)
        ? fields.map((v) => (
              <option key={v} value={v}>
                  {v}
              </option>
          ))
        : Object.entries(fields).map(([k, v]) => (
              <option key={k} value={v}>
                  {k}
              </option>
          ));
    return (
        <div
            className={className}
            style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                ...(inline ? { display: "flex", alignItems: "center", gap: "1rem" } : {}),
                ...style,
            }}
        >
            {label && (
                <label htmlFor={id} style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                    {label}
                </label>
            )}
            <select
                id={id}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                style={{
                    display: "block",
                    width: inline ? "auto" : "100%",
                    padding: "0.625rem",
                    color: "var(--gray-900)",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                    ...VARIANTS[variant],
                }}
            >
                <option value="">Select…</option>
                {options}
            </select>
        </div>
    );
}
