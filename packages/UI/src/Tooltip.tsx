import React, { ReactNode } from "react";

import styles from "./styles/tooltip.module.css";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
    position?: TooltipPosition;
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
    return (
        <span className={styles.tooltipWrapper}>
            {children}
            <span className={`${styles.tooltip} ${styles[position]}`}>{content}</span>
        </span>
    );
}

// function that renders simple text only tooltip
export const renderTooltip = (children: any, message: any, position?: TooltipPosition) => {
    return (
        <Tooltip content={message} position={position}>
            {children}
        </Tooltip>
    );
};
