import type { ReactNode } from "react";
import "./tooltip.css";

interface TooltipProps {
    children: ReactNode;
    content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
    return (
        <div className="tooltip">
            {children}
            <div className="tooltip-content" role="tooltip">
                {content}
            </div>
        </div>
    );
}
