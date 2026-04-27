import { AlertTriangle, Check, CheckCircle, Info, X, XCircle } from "lucide-react";
import { TextRenderer, renderNullValue } from ".";
import { Badge as UIBadge, renderTooltip } from "@niagads/ui";
import { _get, _hasOwnProperty, _isNA, _isNull } from "@niagads/common";

import { DEFAULT_NA_VALUE } from "../../types";
import React from "react";

export const ICONS = {
    check: Check,
    circleCheck: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    xMark: XCircle,
    x: X,
};

export type BadgeIconType = keyof typeof ICONS;

export const Badge = <T,>({ props }: TextRenderer<T>) => {
    const value = _get("value", props);

    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props, DEFAULT_NA_VALUE));
    }

    if (_isNA(value)) {
        return renderNullValue(_get("naValue", props, DEFAULT_NA_VALUE));
    }

    const className = _get("className", props);
    const style = _get("style", props);

    const iconId: BadgeIconType = _get("icon", props, null);
    const iconOnly = _get("iconOnly", props, false);

    const Icon = iconId && ICONS[iconId];

    let component;
    if (iconOnly && Icon) {
        component = <Icon className={className} style={style} size={24} />;
    } else {
        component = (
            <UIBadge variant={"pill"} style={style} className={className} icon={Icon ? <Icon size={18} /> : undefined}>
                {value}
            </UIBadge>
        );
    }

    const info = _get("info", props);
    return info ? renderTooltip(component, info) : component;
};

export const BooleanBadge = <T,>({ props }: TextRenderer<T>) => {
    const isTrue = _get("value", props) === true;

    let value = _get("displayText", props, _get("value", props));

    if (!isTrue) {
        if (_isNull(value)) {
            value = _get("nullValue", props, DEFAULT_NA_VALUE);
        }

        if (_isNA(value)) {
            return renderNullValue(_get("nullValue", props, DEFAULT_NA_VALUE));
        }
    }

    const displayProps = {
        value: value.toString(),
        iconOnly: _hasOwnProperty("icon", props),
    };

    const hasCustomStyling = _hasOwnProperty("classNames", props) || _hasOwnProperty("style", props);
    if (value === false && !hasCustomStyling) {
        return renderNullValue(value);
    }

    return <Badge props={Object.assign(props as any, displayProps)} />;
};
