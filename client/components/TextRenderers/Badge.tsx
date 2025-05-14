import React from "react"
import { _get, _hasOwnProperty, _isNA, _isNull } from "@/common/utils";
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

const __TAILWIND_CSS = {
    root: "px-2 rounded-full py-1",
    icon: "size-5 py-1",
    icon_only_badge: "size-5 m-auto" 
}

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
    const className = backgroundIsStyled ? __TAILWIND_CSS.root : ""

    let textElement = renderStyledText(value, textStyle, className)

    if (_hasOwnProperty('icon', props)) {
        const iconOnly = _get('iconOnly', props, false)
        const iconStyle =  _get('iconStyle', props, false)
        const iconClassName = iconOnly ? __TAILWIND_CSS.icon_only_badge : __TAILWIND_CSS.icon
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