import { AriaProps, StylingProps } from "./types";
import React, { ReactNode } from "react";

import styles from "./styles/inline-icon.module.css";

export interface InlineIconProps {
    icon: ReactNode;
    children: ReactNode;
    iconPosition?: "start" | "end";
}

export const InlineIcon = ({
    icon,
    children,
    iconPosition = "start",
    className = "",
}: InlineIconProps & StylingProps) => {
    return (
        <div className={`${styles.inlineIcon} ${className}`}>
            {iconPosition === "start" && <span className={styles.icon}>{icon}</span>}
            <span className={styles.text}>{children}</span>
            {iconPosition === "end" && <span className={styles.icon}>{icon}</span>}
        </div>
    );
};
