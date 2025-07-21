import { _get, _hasOwnProperty, _isNull } from "@niagads/common";

import { HelpIconWrapper } from "@niagads/ui";
import React from "react";
import { Text } from "./BasicText";
import { TextRenderer } from "./TextRenderer";
import styles from "../styles/cell.module.css";

const _renderLink = (displayText: string, url: string, newWindow: boolean = false) => {
    if (newWindow) {
        return (
            <a className={styles.cellLink} href={url} target="_blank" rel="noopener noreferrer">
                {displayText}
            </a>
        );
    }
    return (
        <a className={styles.cellLink} href={url}>
            {displayText}
        </a>
    );
};

export const LinkList = <T,>({ props }: TextRenderer<T>) => {
    const items = _get("items", props);
    if (items) {
        const numItems = items.length - 1;
        return items.map((iProps: any, index: number) => (
            <div key={index}>
                <Link props={iProps}></Link>
                {index < numItems ? ` // ` : ""}
            </div>
        ));
    }
    return <Text props={{ value: null }} />;
};

export const Link = <T,>({ props }: TextRenderer<T>) => {
    let url: string = _get("url", props);
    const value: string = _get("value", props);

    if (_isNull(url)) {
        if (value.startsWith("http")) {
            url = value;
        } else {
            // render as text
            return <Text props={props} />;
        }
    }

    const component = _renderLink(value ? value : url, url);
    const tooltip = _get("tooltip", props);
    if (tooltip) {
        return (
            <HelpIconWrapper message={tooltip} variant={"question"}>
                {component}
            </HelpIconWrapper>
        );
    }

    return component;
};
