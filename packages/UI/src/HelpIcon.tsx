import React, { ReactNode, useMemo } from "react";

import { InformationCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import { renderTooltip, Tooltip } from "./Tooltip";
import { _get } from "@niagads/common";


interface HelpIconProps {
    anchorId: string;
    message: ReactNode | string;
    type: "question" | "info";
}

export const HelpIcon = ({ anchorId, message, type }: HelpIconProps) => {
    const icon =
        type === "info" ? (
            <InformationCircleIcon className="ml-1 size-4 text-blue-600" />
        ) : (
            <QuestionMarkCircleIcon className="ml-1 size-4 text-blue-600" />
        );

    return <Tooltip anchorId={`help-${anchorId}`} content={message}>{icon}</Tooltip>;
};

export const renderHelpIcon = (anchorId: string, message: ReactNode | string, type: "question" | "info" = "question") => {
    return <HelpIcon anchorId={anchorId} message={message} type={type} />;
};

interface RenderIconOptions {
    iconOnly?: boolean;
    prefix?: boolean;
    className?: string;
    iconClassName?: string;
    style?: any;
    iconStyle?: any;
    tooltip?: string;
    tooltipAnchor?: string;
}

const ICONS = {
    info: ExclamationCircleIcon,
    question: QuestionMarkCircleIcon,
    infoOutline: InformationCircleIcon,
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
    icon: ReactNode | string,
    options: RenderIconOptions
) => {
    const IconComponent = typeof icon === "string" ? getIconElement(icon) : undefined;
    const prefix = _get("prefix", options, true);
    const iconOnly = _get("iconOnly", options, false);
    const className = _get("className", options, "");
    const iconClassName = _get("iconClassName", options, "");
    const style = _get("style", options, {});
    const iconStyle = _get("iconStyle", options);

    const renderIcon = useMemo(
        () => (IconComponent ? <IconComponent className={iconClassName} style={iconStyle} /> : icon),
        []
    );

    return prefix ? (
        <div className={`flex ${className}`} style={style}>
            {options.tooltip ? renderTooltip(options.tooltipAnchor!, renderIcon, options.tooltip) : renderIcon}
            {!iconOnly && textElement}
        </div>
    ) : (
        <div className={`flex ${className}`} style={style}>
            {!iconOnly && textElement}
            {options.tooltip ? renderTooltip(options.tooltipAnchor!, renderIcon, options.tooltip) : renderIcon}
        </div>
    );
};