import React, { ReactNode } from "react";

import { StylingProps } from "../types";
import styles from "./action-button.module.css";

export interface ActionButtonProps extends StylingProps, React.HTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: ReactNode;
}

/** A compact, icon-leading control for contextual actions. */
export const ActionButton = ({ children, className, icon, id, style, ...rest }: ActionButtonProps) => (
    <button type="button" id={id} className={`${styles["action-button"]} ${className ?? ""}`} style={style} {...rest}>
        {icon}
        <span>{children}</span>
    </button>
);
