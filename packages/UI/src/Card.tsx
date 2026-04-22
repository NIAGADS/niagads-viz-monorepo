import React, { ReactNode, ElementType } from "react";

import { StylingProps } from "./types";
import styles from "./styles/card.module.css";

// ─── Sub-components ────────────────────────────────────────────────────────────

interface CardBodyProps {
    children: ReactNode;
}

interface CardHeaderProps {
    children: ReactNode;
}

export const CardBody = ({ children }: CardBodyProps) => (
    <div className={styles["card-body"]}>{children}</div>
);

export const CardHeader = ({ children }: CardHeaderProps) => (
    <div className={styles["card-header"]}>{children}</div>
);

// ─── Types ─────────────────────────────────────────────────────────────────────

type CardSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Visual styling variant.
 * Currently only "default" is available.
 * Extend this union as new variants are needed, e.g. "warning" | "info" | "danger".
 * A matching CSS class (e.g. .card-variant-warning) must be added to card.module.css.
 */
type CardVariant = "default";

// ─── Card ──────────────────────────────────────────────────────────────────────

interface CardProps extends StylingProps, React.HTMLAttributes<HTMLElement> {
    href?: string;

    /**
     * The link component to use when `href` is provided.
     * Pass Next.js `Link`, React Router `Link`, or any compatible component.
     * Falls back to a plain `<a>` with a dev warning if omitted.
     *
     * @example
     * import Link from "next/link";
     * <Card href="/dashboard" LinkComponent={Link} />
     */
    LinkComponent?: ElementType;

    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    children: ReactNode;

    /** Layout: how many columns to span in a 12-col grid. Default: 12. */
    span?: CardSpan;

    /**
     * Visual styling variant (not layout).
     * Extend CardVariant and add matching CSS class when adding new variants.
     */
    variant?: CardVariant;

    hover?: boolean;
    outline?: boolean;
}

// ─── Card ──────────────────────────────────────────────────────────────────────

export const Card = ({
    href,
    LinkComponent,
    onClick,
    children,
    className,
    span = 12,
    variant = "default",
    hover = false,
    outline = true,
    ...rest
}: CardProps) => {
    const isClickable = Boolean(href || onClick);
    const useHoverStyles = hover || isClickable;

    const classes = [
        styles.card,
        styles[`card-span-${span}`],
        styles[`card-variant-${variant}`],
        isClickable && styles["card-link"],
        useHoverStyles && styles["with-hover"],
        outline && styles["with-outline"],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // ── Render as link ──────────────────────────────────────────────────────────
    if (href) {
        if (!LinkComponent) {
            if (process.env.NODE_ENV !== "production") {
                console.warn(
                    "[Card] `href` was provided without a `LinkComponent`. " +
                    "Pass your router's Link component (e.g. Next.js `Link`) to enable " +
                    "client-side navigation. Falling back to a plain <a> tag."
                );
            }
            return (
                <a href={href} className={classes} {...rest}>
                    {children}
                </a>
            );
        }

        return (
            <LinkComponent href={href} className={classes} {...rest}>
                {children}
            </LinkComponent>
        );
    }

    // ── Render as button ────────────────────────────────────────────────────────
    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={classes} {...rest}>
                {children}
            </button>
        );
    }

    // ── Render as plain container ───────────────────────────────────────────────
    return (
        <div className={classes} {...rest}>
            {children}
        </div>
    );
};

// ─── FeatureCard ───────────────────────────────────────────────────────────────

interface FeatureCardProps extends Omit<CardProps, "children">, StylingProps {
    /**
     * Icon component. Must accept `className` and `size` props (Lucide-compatible).
     * If using a different icon library, wrap it to normalise these props.
     */
    icon?: ElementType<{ className?: string; size?: number }>;
    title: string;
    description: string;
}

export const FeatureCard = ({
    icon: Icon,
    title,
    description,
    className,
    ...cardProps
}: FeatureCardProps) => (
    <Card
        {...cardProps}
        className={[className, styles["feature-card"]].filter(Boolean).join(" ")}
    >
        {Icon && <Icon className={styles["feature-icon"]} size={48} />}
        <h3 className={styles["feature-title"]}>{title}</h3>
        <p className={styles["feature-description"]}>{description}</p>
    </Card>
);