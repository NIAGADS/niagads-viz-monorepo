import { AriaProps, StylingProps } from "./types";
import React, { ReactNode } from "react";

import styles from "./styles/button.module.css";

type ButtonVariants = "action" | "link";

interface ButtonProps {
    variant?: ButtonVariants;
    children: ReactNode | string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const Button = ({
    children,
    onClick,
    variant = "action",
    disabled = false,
    ariaLabel,
    className,
}: ButtonProps & StylingProps & AriaProps) => {
    const classes = [styles["button"], styles[variant]].filter(Boolean).join(" ");

    return (
        <button disabled={disabled} className={classes} onClick={onClick}>
            {children}
        </button>
    );
};

interface ButtonWrapperProps {
    children: ReactNode;
}
export const ButtonGroup = ({ children, className }: ButtonWrapperProps & StylingProps) => {
    return <div className={`${styles["button-group"]} ${className ? className : ""}`}>{children}</div>;
};

/* meant to be a group of ButtonGroups */
export const ActionToolbar = ({ children, className }: ButtonWrapperProps & StylingProps) => {
    return <div className={`${styles["action-bar"]} ${className ? className : ""}`}>{children}</div>;
};
