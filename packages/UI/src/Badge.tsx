import { InlineIcon } from "./InlineIcon";
import React from "react";
import { StylingProps } from "./types";
import styles from "./styles/badge.module.css";

interface BadgeProps extends StylingProps {
    text: string;
    icon?: React.ElementType;
    iconPosition?: "start" | "end";
    variant?: "badge" | "pill";
}

export const Badge: React.FC<BadgeProps> = ({
    text,
    icon,
    iconPosition = "start",
    variant = "badge",
    className = "",
}) => {
    const variantClass = variant === "pill" ? styles.pill : styles.badge;
    const Icon = icon;
    return (
        <span className={`${variantClass} ${className}`}>
            <InlineIcon
                icon={Icon ? <Icon size={48} /> : null}
                children={text}
                iconPosition={iconPosition}
            ></InlineIcon>
        </span>
    );
};
