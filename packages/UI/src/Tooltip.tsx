import React, { ReactNode } from "react";

interface Tooltip {
    message: string | ReactNode;
    children: string | ReactNode;
}

export function Tooltip({ message, children }: Tooltip) {
    return (
        <div className="group relative flex">
            {children}
            <span className="z-50 absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                {message}
            </span>
        </div>
    );
}

// function that renders default (bottom) tooltip
export const renderTooltip = (children: any, message: any) => {
    return <Tooltip message={message}>{children}</Tooltip>;
};
