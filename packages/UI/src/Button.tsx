import React, { ReactNode } from "react";
import { _get } from "@bug_sam/common";

type ButtonVariants = "default" | "primary" | "secondary" | "white" | "accent";
type ButtonSizes = "sm" | "md" | "lg";
interface Button {
    variant?: ButtonVariants;
    size?: ButtonSizes;
    children: ReactNode | string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const Button = ({ variant = "default", size = "md", children, onClick, disabled = false }: Button) => {
    const classes = `ui-button ${variant} ${size}`

    return (
        <button disabled={disabled} className={classes} onClick={onClick}>
            {children}
        </button>
    );
};
