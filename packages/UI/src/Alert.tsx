import { BadgeCheck, HardHat, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import React, { ReactNode } from "react";

import { InlineIcon } from "./InlineIcon";
import { StylingProps } from "./types";
import { _get } from "@niagads/common";
import styles from "./styles/alert.module.css";

interface Alert extends StylingProps {
    variant?: AlertVariants;
    message: string;
    children?: ReactNode;
}

const ICONS = {
    info: Info,
    error: OctagonAlert,
    warning: TriangleAlert,
    success: BadgeCheck,
    construction: HardHat,
};

type AlertVariants = keyof typeof ICONS;

export const Alert = ({ variant = "info", message, children, className, style = {} }: Alert) => {
    const classes = [styles.alert, styles[variant === "construction" ? "warning" : variant]].filter(Boolean).join(" ");

    const Icon = ICONS[variant] || Info;

    return (
        <div className={`${classes} ${className}`} role="alert" style={style}>
            <span className={styles["alert-sr"]}>{variant}</span>
            <InlineIcon icon={<Icon size={18} />}>
                <span className={styles["alert-message"]}>{message}</span>
            </InlineIcon>

            <div>{children && <div className={styles["alert-content"]}>{children}</div>}</div>
        </div>
    );
};
