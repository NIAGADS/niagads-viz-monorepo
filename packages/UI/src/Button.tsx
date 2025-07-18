import React, { ReactNode } from "react";

import { _get } from "@niagads/common";
import styles from "./styles/button.module.css";

type ButtonVariants = "default" | "primary" | "secondary" | "white" | "accent";
type ButtonSizes = "sm" | "md" | "lg";
interface ButtonProps {
    variant?: ButtonVariants;
    size?: ButtonSizes;
    children: ReactNode | string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const Button = ({ variant = "default", size = "md", children, onClick, disabled = false }: ButtonProps) => {
    const classes = [styles["ui-button"], styles[variant], styles[size]].filter(Boolean).join(" ");

    return (
        <button disabled={disabled} className={classes} onClick={onClick}>
            {children}
        </button>
    );
};
