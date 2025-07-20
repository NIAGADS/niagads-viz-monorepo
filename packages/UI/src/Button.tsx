import React, { ReactNode } from "react";

import { StylingProps } from "./types";
import styles from "./styles/button.module.css";

type ButtonVariants = "default" | "icon";
type ButtonColorVariants = "default" | "primary" | "white";

interface ButtonProps extends StylingProps {
    variant?: ButtonVariants;
    color?: ButtonColorVariants;
    children: ReactNode;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const Button = ({
    children,
    onClick,
    variant = "default",
    color = "default",
    disabled = false,
    className,
    id,
    ...rest
}: ButtonProps & React.HTMLAttributes<HTMLButtonElement>) => {
    let classes = [styles.button, styles[variant], color !== "default" && styles[color]].filter(Boolean).join(" ");

    if (className) {
        classes = `${classes} ${className}`;
    }

    return (
        <button id={id} className={classes} disabled={disabled} onClick={onClick} {...rest}>
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
