import React, { ReactNode } from "react";

import { StylingProps } from "./types";
import styles from "./styles/button.module.css";
import { InlineIcon } from "./InlineIcon";

type ButtonVariants = "default" | "icon";
export type ButtonColorVariants = "default" | "primary" | "white";

interface ButtonProps extends StylingProps {
    variant?: ButtonVariants;
    color?: ButtonColorVariants;
    children: ReactNode;
    disabled?: boolean;
    icon?: React.ElementType;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const Button = ({
    children,
    onClick,
    variant = "default",
    color = "default",
    disabled = false,
    className,
    id, // FIXME: look into whether id is naturally included in the ...rest from the HTMLAttributes
    icon,
    ...rest
}: ButtonProps & React.HTMLAttributes<HTMLButtonElement>) => {
    const Icon = icon;
    let classes = [styles.button, styles[variant], color !== "default" && styles[color]].filter(Boolean).join(" ");

    if (className) {
        classes = `${classes} ${className}`;
    }

    return (
        <button id={id} className={classes} disabled={disabled} onClick={onClick} {...rest}>
            {Icon ? <InlineIcon icon={<Icon size={18} />}>{children}</InlineIcon> : children}
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
