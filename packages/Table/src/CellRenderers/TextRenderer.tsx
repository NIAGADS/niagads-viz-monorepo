import React, { ReactNode, useMemo } from "react";

import { _get, _hasOwnProperty, _isNA, _isNull } from "@niagads/common";
import { renderTooltip } from "@niagads/ui/client";

import {
    CheckIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    UserCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

export interface TextRenderer<T> {
    props: T;
}

export const ICONS = {
    check: CheckIcon,
    solidCheck: CheckCircleIcon,
    info: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    user: UserCircleIcon,
    infoOutline: InformationCircleIcon,
    xMark: XCircleIcon,
};

const DEFAULT_NA_STRING = "n/a";

export const renderStyledText = (value: any, style: any, className: string) => {
    return (
        <span className={`cell ${className}`} style={style}>
            {value}
        </span>
    );
};

export const renderNullValue = (value: string = DEFAULT_NA_STRING) => {
    return <span className="cell text-gray-200">{_isNA(value) || !value ? DEFAULT_NA_STRING : value}</span>;
};

/**
 * Add tooltip to textElement
 * @param textElement element to be wrapped
 * @param anchorId tooltip anchor
 * @param infoMessage tooltip message
 * @param useInfoLink flag indicating whether to create info link; if false returns tooltip wrapped info icon
 * @returns textElement with tooltip either as info icon or info link
 */
export const renderWithInfo = (
    textElement: ReactNode | string,
    infoMessage: string,
    anchorId: string,
    useInfoLink: boolean = false
) => {
    if (useInfoLink) {
        return renderTooltip(anchorId, textElement, infoMessage);
    }
    // otherwise draw info icon and attach the tooltip to the icon
    return renderWithIcon(textElement, <InformationCircleIcon className="info-bubble size-3 ml-1" />, {
        prefix: false,
        iconOnly: false,
        tooltip: infoMessage,
        tooltipAnchor: anchorId,
    });
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

/**
 * render text element with inline icon
 * @param textElement
 * @param icon react node or key of ICON to render
 * @param iconOnly render the icon only
 * @param prefix true if icon should be rendered to the left of the text element
 * @returns div containing (textElement) and inline icon
 */

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

export const renderWithIcon = (
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

/**
 * extract style properties and build object to pass to component style
 * @param props text renderer property object
 * @param property specific style property to extract; if null will look for all allowable style properties
 * @returns style object
 */
export const buildElementStyle = (props: any, property: string | null = null) => {
    const VALID_STYLES = property ? [property] : ["color", "backgroundColor", "borderColor"];
    const style = {};
    for (const vStyle of VALID_STYLES) {
        if (_hasOwnProperty(vStyle, props)) {
            Object.assign(style, { [vStyle]: _get(vStyle, props) });
        }
    }

    if (_hasOwnProperty("borderColor", style)) {
        Object.assign(style, { border: "1px solid" });
    }

    return style;
};
