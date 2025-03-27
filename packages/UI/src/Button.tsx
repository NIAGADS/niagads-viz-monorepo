import React, { ReactNode } from "react";
import { _get } from "@niagads/common";

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
    const classes = `ui-button ${variant} ${size}`

    return (
        <button disabled={disabled} className={classes} onClick={onClick}>
            {children}
        </button>
    );
};
