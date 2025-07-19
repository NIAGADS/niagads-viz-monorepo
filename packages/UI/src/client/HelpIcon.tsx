import { AlertCircle, HelpCircle, Info } from "lucide-react";
import React, { ReactNode } from "react";

import { InlineIcon } from "../InlineIcon";
import { StylingProps } from "../types";
import { Tooltip } from "../Tooltip";
import { _get } from "@niagads/common";

const ICONS = {
    alert: AlertCircle,
    question: HelpCircle,
    info: Info,
};

type HelpIconVariant = keyof typeof ICONS;

interface HelpIconProps {
    anchorId: string;
    message: ReactNode | string;
    variant: HelpIconVariant;
    className?: string;
}

export const HelpIcon = ({ anchorId, message, variant, className }: HelpIconProps & StylingProps) => {
    const Icon = ICONS[variant] || Info; // fallback to Info

    return (
        <Tooltip anchorId={`help-${anchorId}`} content={message}>
            <div className={className}>
                <Icon size={15} />
            </div>
        </Tooltip>
    );
};

export const renderHelpIcon = (
    anchorId: string,
    message: ReactNode | string,
    variant: HelpIconVariant,
    className: string
) => {
    return <HelpIcon anchorId={anchorId} message={message} variant={variant} className={className} />;
};

/**
 * maps string key to icon components
 * @param key
 * @returns
 */
export const getIconElement = (key: string) => {
    const icon = ICONS[key as keyof typeof ICONS] || Info;
    return icon;
};

export const renderWithHelpIcon = (
    textElement: ReactNode | string,
    variant: HelpIconVariant,
    message: string,
    anchorId: string,
    className = ""
) => {
    return (
        <InlineIcon icon={renderHelpIcon(anchorId, message, variant, className)} iconPosition="end">
            {textElement}
        </InlineIcon>
    );
};
