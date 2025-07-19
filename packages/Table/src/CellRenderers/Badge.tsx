import { AlertTriangle, Check, CheckCircle, Info, X, XCircle } from "lucide-react";
import { TextRenderer, buildElementStyle, renderNullValue } from "./TextRenderer";
import { _get, _hasOwnProperty, _isNA, _isNull } from "@niagads/common";

import React from "react";
import { Badge as UIBadge } from "@niagads/ui";
import { renderWithHelpIcon } from "@niagads/ui/client";

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
        return renderNullValue(_get("nullValue", props));
    }

    if (_isNA(value)) {
        return renderNullValue();
    }

    const color = _get("color", props, null);
    const iconId: BadgeIconType = _get("icon", props, null);
    const iconOnly = _get("iconOnly", props, false);

    const Icon = iconId && ICONS[iconId];

    let component;
    if (iconOnly && Icon) {
        component = <Icon color={color} size={24} />;
    } else {
        const badgeStyle = buildElementStyle(props);
        component = (
            <UIBadge style={badgeStyle} icon={Icon ? <Icon color={color} size={18} /> : undefined}>
                {value}
            </UIBadge>
        );
    }

    const tooltip = _hasOwnProperty("tooltip", props);
    return tooltip
        ? renderWithHelpIcon(component, "info", tooltip, `${_get("rowId", props)}-${_get("columnId", props)}`)
        : component;
};

export const BooleanBadge = <T,>({ props }: TextRenderer<T>) => {
    let value = _get("displayText", props, _get("value", props));

    if (_isNull(value)) {
        value = _get("nullValue", props, "NA");
    }

    const displayProps = {
        value: value.toString(),
    };

    if (value === false && !_hasOwnProperty("color", props)) {
        Object.assign(displayProps, {
            color: "rgb(203, 213, 225)", // === var(--gray-300) from .nullValue styling
        });
    }

    return <Badge props={Object.assign(props as any, displayProps)} />;
};
