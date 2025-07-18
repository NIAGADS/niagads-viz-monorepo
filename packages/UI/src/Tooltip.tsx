import React, { ReactNode } from "react";

import { Tooltip as ReactTooltip, PlacesType, VariantType } from "react-tooltip";

interface TooltipProps {
    anchorId: string;
    content: string | ReactNode;
    children: string | ReactNode;
    variant?: VariantType;
    place?: PlacesType;
    openOnClick?: boolean; // tooltip opens on click instead of hover
}

export function Tooltip({
    anchorId,
    content,
    children,
    place = "top",
    variant = "dark",
    openOnClick = false,
}: TooltipProps) {
    const friendlyAnchorId = "tooltip-" + anchorId.replace(" ", "_");
    return (
        <>
            <div data-tooltip-id={friendlyAnchorId} data-tooltip-variant={variant}>
                {children}
            </div>
            <ReactTooltip className="font-normal text-xs" id={friendlyAnchorId} openOnClick={openOnClick} place={place}>
                {content}
            </ReactTooltip>
        </>
    );
}

// function that renders simple text only tooltip
export const renderTooltip = (anchorId: string, children: any, message: any) => {
    return (
        <Tooltip anchorId={anchorId} content={message}>
            {children}
        </Tooltip>
    );
};
