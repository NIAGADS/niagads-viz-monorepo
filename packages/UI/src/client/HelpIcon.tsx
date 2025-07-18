import { AlertCircle, HelpCircle, Info } from "lucide-react";
import React, { ReactNode } from "react";

import { Tooltip } from "../Tooltip";
import { _get } from "@niagads/common";

const ICONS = {
    alert: AlertCircle,
    question: HelpCircle,
    info: Info,
};

type HelpIconType = keyof typeof ICONS;

interface HelpIconProps {
    anchorId: string;
    message: ReactNode | string;
    type: HelpIconType;
}

export const HelpIcon = ({ anchorId, message, type }: HelpIconProps) => {
    const icon =
        type === "info" ? <Info className="inline-info-bubble" /> : <HelpCircle className="inline-info-bubble" />;

    return (
        <Tooltip anchorId={`help-${anchorId}`} content={message}>
            {icon}
        </Tooltip>
    );
};

export const renderHelpIcon = (anchorId: string, message: ReactNode | string, type: HelpIconType) => {
    return <HelpIcon anchorId={anchorId} message={message} type={type} />;
};

/**
 * maps string key to icon components
 * @param key
 * @returns
 */
export const getIconElement = (key: string) => {
    const icon = _get(key, ICONS);
    if (icon === null) {
        throw Error("Error rendering field: invalid icon `" + key + "`");
    }
    return icon;
};

export const renderWithHelpIcon = (
    textElement: ReactNode | string,
    type: HelpIconType,
    message: string,
    anchorId: string
) => {
    return (
        <div className="inline-flex">
            {textElement}
            {renderHelpIcon(anchorId, message, type)}
        </div>
    );
};
