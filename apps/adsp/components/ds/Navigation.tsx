import type { CSSProperties, ReactNode } from "react";
import { A } from "../A";

export interface NavigationProps {
    variant?: "light" | "dark" | "primary" | "secondary";
    brand?: { href?: string; logo?: ReactNode; label?: string };
    items?: { label: string; href: string; target?: string; active?: boolean }[];
    bannerMsg?: ReactNode;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/** NIAGADS Navigation — top bar with the 2px gold underline, brand lockup left, links right. */
export function Navigation({
    variant = "light",
    brand,
    items = [],
    bannerMsg,
    children,
    className = "",
    style = {},
}: NavigationProps) {
    const bg = {
        light: "#fff",
        dark: "var(--niagads-dark-blue)",
        primary: "var(--primary-blue)",
        secondary: "var(--niagads-gold)",
    }[variant];
    const dark = variant === "dark" || variant === "primary";
    const labelColor = dark ? "#fff" : "var(--niagads-dark-blue)";
    const linkColor = dark ? "#fff" : "var(--primary-blue)";
    return (
        <nav
            className={className}
            style={{
                position: "relative",
                width: "100%",
                background: bg,
                borderBottom: `2px solid ${variant === "primary" ? "var(--niagads-dark-blue)" : "var(--niagads-gold)"}`,
                fontFamily: "var(--font-sans)",
                ...style,
            }}
        >
            {bannerMsg && (
                <div
                    style={{
                        background: "var(--niagads-gold)",
                        color: "var(--niagads-dark-blue)",
                        padding: "0.25rem 1rem",
                        fontSize: "1.125rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                    }}
                >
                    {bannerMsg}
                </div>
            )}
            <div
                style={{
                    maxWidth: "var(--content-max-width)",
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 1rem",
                    gap: "1rem",
                }}
            >
                {brand && (
                    <A
                        href={brand.href || "/"}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
                    >
                        {brand.logo}
                        {brand.label && (
                            <span
                                style={{ fontSize: "1.5rem", fontWeight: 600, color: labelColor, whiteSpace: "nowrap" }}
                            >
                                {brand.label}
                            </span>
                        )}
                    </A>
                )}
                {children ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>{children}</div>
                ) : (
                    <ul
                        style={{
                            display: "flex",
                            listStyle: "none",
                            gap: "2rem",
                            margin: 0,
                            padding: 0,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {items.map((item, i) => (
                            <li key={i}>
                                <A
                                    href={item.href}
                                    target={item.target}
                                    aria-current={item.active ? "page" : undefined}
                                    style={{
                                        display: "block",
                                        padding: "0.5rem 0.75rem",
                                        fontSize: "1.125rem",
                                        color: item.active ? "var(--niagads-gold)" : linkColor,
                                        borderRadius: "0.125rem",
                                        textDecoration: "none",
                                        transition: "all .2s",
                                    }}
                                >
                                    {item.label}
                                </A>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}
