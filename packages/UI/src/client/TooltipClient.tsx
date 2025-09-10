import React, { ReactNode, useState } from "react";

import styles from "../styles/tooltip.module.css";

interface TooltipClientProps {
    content: string | ReactNode;
    children: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    openOnClick?: boolean;
}

export function TooltipClient({ content, children, position = "top", openOnClick = false }: TooltipClientProps) {
    const [open, setOpen] = useState(false);

    if (!openOnClick) {
        // fallback to server-compatible Tooltip
        return (
            <span className={styles.tooltipWrapper}>
                {children}
                <span className={`${styles.tooltip} ${styles[position]}`}>{content}</span>
            </span>
        );
    }

    return (
        <span
            className={styles.tooltipWrapper}
            tabIndex={0}
            onClick={() => setOpen((v) => !v)}
            onBlur={() => setOpen(false)}
            style={{ cursor: "pointer" }}
        >
            {children}
            <span
                className={`${styles.tooltip} ${styles[position]}`}
                style={{ visibility: open ? "visible" : "hidden", opacity: open ? 1 : 0 }}
            >
                {content}
            </span>
        </span>
    );
}
