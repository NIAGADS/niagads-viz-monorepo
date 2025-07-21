import { AlertCircle, HelpCircle, Info, ShieldAlert } from "lucide-react";
import React, { ReactNode } from "react";
import { Tooltip, TooltipPosition } from "./Tooltip";

import { InlineIcon } from "./InlineIcon";
import { StylingProps } from "./types";
import { _get } from "@niagads/common";

const ICONS = {
    alert: AlertCircle,
    question: HelpCircle,
    info: Info,
    shield: ShieldAlert,
};

type HelpIconVariant = keyof typeof ICONS;

interface HelpIconProps {
    message: ReactNode;
    variant: HelpIconVariant;
    className?: string;
    tooltipPosition?: TooltipPosition;
}

export const HelpIcon = ({ message, variant, tooltipPosition = "top", className }: HelpIconProps & StylingProps) => {
    const Icon = ICONS[variant] || Info; // fallback to Info

    return (
        <Tooltip content={message} position={tooltipPosition}>
            <div className={className}>
                <Icon size={15} color={variant === "shield" ? "red" : undefined} />
            </div>
        </Tooltip>
    );
};

export const renderHelpIcon = (
    message: ReactNode,
    variant: HelpIconVariant,
    className: string,
    tooltipPosition: TooltipPosition = "top"
) => {
    return <HelpIcon message={message} variant={variant} className={className} tooltipPosition={tooltipPosition} />;
};

export const getIconElement = (key: string) => {
    const icon = ICONS[key as keyof typeof ICONS] || Info;
    return icon;
};

interface HelpIconWrapperProps extends HelpIconProps {
    children: ReactNode;
}

export const HelpIconWrapper = ({
    children,
    variant,
    message,
    tooltipPosition = "top",
    className = "",
}: HelpIconWrapperProps) => {
    return (
        <InlineIcon icon={renderHelpIcon(message, variant, className, tooltipPosition)} iconPosition="end">
            {children}
        </InlineIcon>
    );
};
