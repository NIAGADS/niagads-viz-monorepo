import React, { ReactNode } from "react";
import { _get } from "@niagads/common";

type AlertVariants = "info" | "warning" | "danger" | "success" | "default";
interface Alert {
    variant?: AlertVariants;
    message: string;
    children?: ReactNode | string;
}

export const renderInfoIcon = () => (
    <svg
        className="ui-alert-icon"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
    </svg>
);

export const Alert = ({ variant = "default", message, children }: Alert) => {
    const classes = `ui-alert ${variant}`;

    return (
        <div className={classes} role="alert">
            {renderInfoIcon()}
            <span className="sr-only">{variant}</span>
            <div>
                <span className="font-bold">{message}</span>
                {children && (typeof children === `string` ? <div>{children}</div> : children)}
            </div>
        </div>
    );
};
