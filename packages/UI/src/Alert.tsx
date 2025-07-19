import { BadgeCheck, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import React, { ReactNode } from "react";

import { InlineIcon } from "./InlineIcon";
import { _get } from "@niagads/common";
import styles from "./styles/alert.module.css";

interface Alert {
    variant?: AlertVariants;
    message: string;
    children?: ReactNode | string;
}

const ICONS = {
    info: Info,
    error: OctagonAlert,
    warning: TriangleAlert,
    success: BadgeCheck,
};

type AlertVariants = keyof typeof ICONS;

export const Alert = ({ variant = "info", message, children }: Alert) => {
    const classes = [styles.alert, styles[variant]].filter(Boolean).join(" ");

    const Icon = ICONS[variant] || Info;

    return (
        <div className={classes} role="alert">
            <span className={styles["alert-sr"]}>{variant}</span>
            <InlineIcon icon={<Icon size={18} />}>
                <span className={styles["alert-message"]}>{message}</span>
            </InlineIcon>

            <div>{children && <div className={styles["alert-content"]}>{children}</div>}</div>
        </div>
    );
};
