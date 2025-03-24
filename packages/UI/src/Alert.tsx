import React, { ReactNode } from "react";
import { _get } from "@bug_sam/common";

const __TAILWIND_CSS = {
    root: "flex p-4 mb-4 text-sm rounded-lg",

    // variants
    info: "text-blue-800 border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400",
    warning:
        "text-yellow-800 border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-gray-800 dark:text-yellow-300",
    danger: "text-red-800 border-red-300 bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400",
    success: "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400",
    default: "text-gray-800 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400",
};

type AlertVariants = "info" | "warning" | "danger" | "success" | "default";
interface Alert {
    variant?: AlertVariants;
    message: string;
    children?: ReactNode | string;
}

export const Alert = ({ variant = "default", message, children }: Alert) => {
    const classes = `${__TAILWIND_CSS.root} ${__TAILWIND_CSS[variant]}`;

    return (
        <div className={classes} role="alert">
            <svg
                className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
                <span className="font-bold">{message}</span>
                {children && (typeof children === `string` ? <div>{children}</div> : children)}
            </div>
        </div>
    );
};
