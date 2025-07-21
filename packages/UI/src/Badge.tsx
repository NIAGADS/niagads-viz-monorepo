import React, { ReactNode } from "react";

import { InlineIcon } from "./InlineIcon";
import { StylingProps } from "./types";
import styles from "./styles/badge.module.css";

interface BadgeProps extends StylingProps {
    children: ReactNode;
    icon?: ReactNode;
    iconPosition?: "start" | "end";
    variant?: "badge" | "pill";
}

export const Badge = ({
    children,
    icon,
    iconPosition = "start",
    variant = "badge",
    className = "",
    style = {},
}: BadgeProps) => {
    const variantClass = variant === "pill" ? `${styles.badge} ${styles.pill}` : styles.badge;

    if (icon) {
        return (
            <span className={`${variantClass} ${className}`} style={style}>
                <InlineIcon icon={icon} children={children} iconPosition={iconPosition}></InlineIcon>
            </span>
        );
    }

    return (
        <span className={`${variantClass} ${className}`} style={style}>
            {children}
        </span>
    );
};
