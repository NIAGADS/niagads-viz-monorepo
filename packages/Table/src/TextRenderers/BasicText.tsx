import React, { useState } from "react";

import { _deepCopy, _get, _hasOwnProperty, _isJSON, _isNA, _isNull } from "@niagads/common";

import { TextRenderer, renderWithInfo, renderStyledText, renderNullValue, buildElementStyle } from "./TextRenderer";

const DEFAULT_MAX_LENGTH = 100;

export const TextList = <T,>({ props }: TextRenderer<T>) => {
    const items = _get("items", props);
    if (items) {
        const numItems = items.length - 1;
        return items.map((iProps: any, index: number) => (
            <div key={index}>
                <Text props={iProps}></Text>
                {index < numItems ? ` // ` : ""}
            </div>
        ));
    }
    return renderNullValue();
};

export const Text = <T,>({ props }: TextRenderer<T>) => {
    const value = _get("value", props);

    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props));
    }

    if (_isNA(value)) {
        return renderNullValue();
    }

    const maxLength = _get("truncateTo", props, DEFAULT_MAX_LENGTH);
    if (value.length > maxLength) {
        return <LargeText props={props} />;
    }

    const hasTooltip = _hasOwnProperty("tooltip", props);
    const useInfoLink = _get("inlineTooltip", props, false); // tooltip rendered as info link instead of info icon
    const style = buildElementStyle(props);

    const textElement = renderStyledText(value, style, hasTooltip && useInfoLink ? "info-link" : "");

    return hasTooltip ? renderWithInfo(textElement, _get("tooltip", props), useInfoLink) : textElement;
};

export const LargeText = <T,>({ props }: TextRenderer<T>) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const value = _get("value", props);

    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props));
    }

    if (_isNA(value)) {
        return renderNullValue();
    }

    const hasTooltip = _hasOwnProperty("tooltip", props);
    const maxLength = _get("truncateTo", props, DEFAULT_MAX_LENGTH);
    const truncatedValue = `${value.slice(0, maxLength - 3)}...`;

    if (hasTooltip) {
        const newProps = _deepCopy(props);
        newProps.value = truncatedValue;
        return <Text props={newProps} />;
    }

    const style = buildElementStyle(props);
    const textElement = renderStyledText(isExpanded ? value : truncatedValue, style, "");
    const action = isExpanded ? "Show Less" : "Show More";
    return (
        <div className="max-w-[300px] break-words">
            {textElement}
            {"   "}
            <a className="text-xs ui-info-link" onClick={toggleIsExpanded}>
                {action}
            </a>
        </div>
    );
};
