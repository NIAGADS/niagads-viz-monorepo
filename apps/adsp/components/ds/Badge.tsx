import type { CSSProperties, ReactNode } from "react";

const COLORS: Record<string, CSSProperties> = {
    secondary: { background: "var(--secondary-blue)", color: "#fff" },
    primary: { background: "var(--primary-blue)", color: "#fff" },
    gold: { background: "var(--niagads-gold)", color: "var(--niagads-dark-blue)" },
    success: { background: "var(--success-green)", color: "#fff" },
    warning: { background: "var(--warning-amber)", color: "#fff" },
    error: { background: "var(--error-red)", color: "#fff" },
    neutral: { background: "var(--gray-200)", color: "var(--gray-700)" },
};

export interface BadgeProps {
    children?: ReactNode;
    icon?: ReactNode;
    iconPosition?: "start" | "end";
    variant?: "badge" | "pill";
    color?: keyof typeof COLORS;
    className?: string;
    style?: CSSProperties;
}

/** NIAGADS Badge — compact label, secondary-blue by default. */
export function Badge({
    children,
    icon,
    iconPosition = "start",
    variant = "badge",
    color = "secondary",
    className = "",
    style = {},
}: BadgeProps) {
    const merged: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.375rem",
        padding: variant === "pill" ? "0.375rem 0.75rem" : "0.375rem 0.625rem",
        borderRadius: variant === "pill" ? "12px" : "0.375rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.5px",
        lineHeight: 1,
        whiteSpace: "nowrap",
        width: "fit-content",
        ...COLORS[color],
        ...style,
    };
    const iconEl = icon ? (
        <span style={{ display: "inline-flex", alignItems: "center", fontSize: "0.875rem" }}>{icon}</span>
    ) : null;
    return (
        <span className={className} style={merged}>
            {iconPosition === "start" && iconEl}
            <span>{children}</span>
            {iconPosition === "end" && iconEl}
        </span>
    );
}
