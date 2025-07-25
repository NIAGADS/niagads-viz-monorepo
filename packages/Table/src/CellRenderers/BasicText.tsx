import { HelpIconWrapper, renderTooltip } from "@niagads/ui";
import React, { ReactNode, useState } from "react";
import { TextRenderer, buildElementStyle, renderNullValue } from "./TextRenderer";
import { _deepCopy, _get, _hasOwnProperty, _isJSON, _isNA, _isNull } from "@niagads/common";

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

interface TextWithInfoProps {
    text: ReactNode;
    message: string;
    asInfoLink?: boolean; // display as info link instead of as icon
}

export const TextWithInfo = ({ text, message, asInfoLink }: TextWithInfoProps) => {
    if (asInfoLink) {
        const infoLink = <div className={styles.infoLink}>{text}</div>;
        return <>{renderTooltip(infoLink, message)}</>;
    }
    return (
        <HelpIconWrapper message={message} variant={"info"}>
            {text}
        </HelpIconWrapper>
    );
};

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

    // handle NAs
    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props));
    }

    if (_isNA(value)) {
        return renderNullValue();
    }

    // handle large text
    const maxLength = _get("truncateTo", props, DEFAULT_MAX_LENGTH);
    if (value.length > maxLength) {
        return <LargeText props={props} />;
    }

    // styling
    const style = buildElementStyle(props);
    const styledText = <StyledText value={value} style={style} />;

    // tooltips
    if (_hasOwnProperty("tooltip", props)) {
        const asInfoLink = _get("inlineTooltip", props, false); // tooltip
        return <TextWithInfo text={styledText} message={_get("tooltip", props)} asInfoLink={asInfoLink} />;
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

    // styling
    const style = buildElementStyle(props);
    const styledText = <StyledText value={isExpanded ? value : truncatedValue} style={style} />;

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
