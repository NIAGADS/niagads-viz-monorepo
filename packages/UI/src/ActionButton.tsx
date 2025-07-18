import React, { ReactNode } from "react";

import { _get } from "@niagads/common";
import styles from "./styles/action-button.module.css";

type ButtonVariants = "primary";
interface ActionButtonProps {
    variant?: ButtonVariants;
    children: ReactNode | string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const ActionButton = ({ variant, children, onClick, disabled = false }: ActionButtonProps) => {
    const classes = [styles["ui-action-button"], variant && styles[variant]].filter(Boolean).join(" ");
    return (
        <button disabled={disabled} className={classes} onClick={onClick}>
            {children}
        </button>
    );
};
