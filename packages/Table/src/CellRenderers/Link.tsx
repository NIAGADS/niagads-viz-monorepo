import React from "react";

import { TextRenderer, renderWithInfo } from "./TextRenderer";
import { Text } from "./BasicText";

import { _get, _hasOwnProperty, _isNull } from "@niagads/common";

const _renderLink = (displayText: string, url: string, newWindow: boolean = false) => {
    if (newWindow) {
        return (
            <a className="cell cell-link" href={url} target="_blank" rel="noopener noreferrer">
                {displayText}
            </a>
        );
    }
    return <a className="cell cell-link" href={url}>{displayText}</a>;
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
    const url = _get("url", props);
    const value = _get("value", props);

    if (_isNull(url)) {
        // render as text
        return <Text props={props} />;
    }

    const linkElement = _renderLink(value ? value : url, url);
    const hasTooltip = _hasOwnProperty("tooltip", props);
    if (hasTooltip) {
        const anchorId = `${_get("rowId", props)}-${_get("columnId", props)}`;
        return renderWithInfo(linkElement, _get("tooltip", props), anchorId, true);
    }

    return linkElement;
};
