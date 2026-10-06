import type { CSSProperties, MouseEventHandler } from "react";

export interface FilterChipProps {
    label: string;
    value?: string;
    onRemove?: MouseEventHandler<HTMLButtonElement>;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
}

/** NIAGADS FilterChip — rounded filter token; `selected` fills it brand-blue. */
export function FilterChip({
    label,
    value,
    onRemove,
    selected = false,
    disabled = false,
    className = "",
    style = {},
}: FilterChipProps) {
    return (
        <span
            className={className}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                maxWidth: 280,
                minHeight: 26,
                background: selected ? "var(--primary-blue)" : "var(--surface)",
                color: selected ? "var(--text-inverse)" : "var(--text-primary)",
                border: `1px solid ${selected ? "var(--primary-blue)" : "var(--border)"}`,
                borderRadius: 90,
                padding: "3px 7px",
                fontSize: "0.75rem",
                boxShadow: "var(--shadow-sm)",
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
                whiteSpace: "nowrap",
                ...style,
            }}
        >
            {onRemove && !disabled && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${label}`}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 16,
                        height: 16,
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        borderRadius: "50%",
                        fontSize: "0.85rem",
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            )}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
            {value && (
                <span
                    style={{
                        padding: "3px 7px",
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        borderRadius: 999,
                        border: "1px solid var(--secondary-blue)",
                        background: "var(--secondary-blue)",
                        color: "var(--text-inverse)",
                    }}
                >
                    {value}
                </span>
            )}
        </span>
    );
}
