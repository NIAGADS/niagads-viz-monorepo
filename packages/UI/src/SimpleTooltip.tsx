import React, { ReactNode } from "react";
import "./styles/tooltip.css";

interface SimpleTooltipProps {
    children: ReactNode;
    content: string;
}

export const SimpleTooltip = ({ children, content }: SimpleTooltipProps) => {
    return (
        <div className="tooltip">
            {children}
            <div className="tooltip-content" role="tooltip">
                {content}
            </div>
        </div>
    );
};
