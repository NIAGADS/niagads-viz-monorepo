import React, { useId, useState } from "react";
import { TextRenderer, renderNullValue } from "./TextRenderer";
import { _deepCopy, _get, _hasOwnProperty, _isJSON, _isNA, _isNull } from "@niagads/common";

import { DEFAULT_NA_VALUE } from "../Cell";
import { HelpIconWrapper } from "@niagads/ui";
import { StylingProps } from "@niagads/ui";
import styles from "../styles/cell.module.css";

const DEFAULT_MAX_LENGTH = 100;

interface StyledTextProps extends StylingProps {
    value: string;
}

export const StyledText = ({ value, className = "", style = {} }: StyledTextProps) => {
    return (
        <span className={`${className}`} style={style}>
            {value}
        </span>
    );
};

export const TextList = <T,>({ props }: TextRenderer<T>) => {
    const id = useId();
    const items = _get("items", props);
    if (items) {
        const numItems = items.length - 1;
        return items.map((iProps: any, index: number) => (
            <div key={`item-${id}-${index}`}>
                <Text key={`text-${id}-${index}`} props={iProps}></Text>
                {index < numItems ? ` // ` : ""}
            </div>
        ));
    }
    return renderNullValue(_get("nullValue", props, DEFAULT_NA_VALUE));
};

export const Text = <T,>({ props }: TextRenderer<T>) => {
    const value = _get("value", props);

    // handle NAs
    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props, DEFAULT_NA_VALUE));
    }

    if (_isNA(value)) {
        return renderNullValue(_get("naValue", props, DEFAULT_NA_VALUE));
    }

    // handle large text
    const maxLength = _get("truncateTo", props, DEFAULT_MAX_LENGTH);
    if (value.length > maxLength) {
        return <LargeText props={props} />;
    }

    // styling
    const style = _get("style", props);
    const className = _get("className", props);
    const styledText = <StyledText value={value} style={style} className={className} />;

    // info bubbles
    const info = _get("info", props);
    if (info) {
        return (
            <HelpIconWrapper message={info} variant={"info"}>
                {styledText}
            </HelpIconWrapper>
        );
    }

    return styledText;
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
        return renderNullValue(_get("naValue", props, DEFAULT_NA_VALUE));
    }

    const hasTooltip = _hasOwnProperty("info", props);
    const maxLength = _get("truncateTo", props, DEFAULT_MAX_LENGTH);
    const truncatedValue = `${value.slice(0, maxLength - 3)}...`;

    if (hasTooltip) {
        const newProps = _deepCopy(props);
        newProps.value = truncatedValue;
        return <Text props={newProps} />;
    }

    // styling
    const style = _get("style", props);
    const className = _get("className", props);
    const styledText = <StyledText value={isExpanded ? value : truncatedValue} style={style} className={className} />;

    const action = isExpanded ? "Show Less" : "Show More";
    return (
        <div className={styles.truncatedText}>
            {styledText}
            {"   "}
            <a className={`text-xs ${styles.infoLink}`} onClick={toggleIsExpanded}>
                {action}
            </a>
        </div>
    );
};
