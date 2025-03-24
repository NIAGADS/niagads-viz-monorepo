import React from "react"
import { _get, _hasOwnProperty, _isNA, _isNull } from "@bug_sam/common";
import {
    TextRenderer,
    buildElementStyle,
    renderNullValue,
    renderStyledText,
    renderWithIcon,
    renderWithInfo,
    ICONS
} from "./TextRenderer"


export type BadgeIconType = keyof typeof ICONS;

export const Badge = <T,>({ props }: TextRenderer<T>) => {
    const value = _get('value', props)

    if (_isNull(value)) {
        return renderNullValue(_get('nullValue', props))
    }

    if (_isNA(value)) {
        return renderNullValue()
    }

    const badgeStyle = buildElementStyle(props)
    const textStyle = buildElementStyle(props, 'color')
    const backgroundIsStyled = _hasOwnProperty('backgroundColor', badgeStyle) || _hasOwnProperty('borderColor', badgeStyle)
    const className = "tr-badge";

    let textElement = renderStyledText(value, textStyle, className)

    if (_hasOwnProperty('icon', props)) {
        const iconOnly = _get('iconOnly', props, false)
        const iconStyle =  _get('iconStyle', props, false)
        const iconClassName = iconOnly ? "tr-icon-only-badge" : "tr-badge-icon"
        textElement = renderWithIcon(textElement, _get('icon', props),
            {
                iconOnly: iconOnly,
                iconClassName: iconClassName,
                className: className,
                style: badgeStyle
            })
    }

    const hasTooltip = _hasOwnProperty('tooltip', props)
    return hasTooltip
        ? renderWithInfo(textElement, _get('tooltip', props), true)
        : textElement
}

export const BooleanBadge = <T,>({ props }: TextRenderer<T>) => {
    let value = _get('displayText', props, _get('value', props))

    if (_isNull(value)) {
        value = _get('nullValue', props, 'NA')
    }

    const displayProps = {
        'value': value.toString(),
    }

    if (value === false && !_hasOwnProperty('color', props)) {
        Object.assign(displayProps, {
            'color': 'rgb(229, 231, 235)' // same as the n/a color
        })
    }

    if (_hasOwnProperty('icon', props)) {
        const iconStyle = buildElementStyle(props, 'color')
        Object.assign(displayProps, { 'iconOnly': true, iconStyle: iconStyle})
    }

    return <Badge props={Object.assign(props as any, displayProps)} />

}