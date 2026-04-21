import { LinkTarget, TextRenderer } from "./TextRenderer";
import React, { useId } from "react";
import { _get, _hasOwnProperty, _isNull } from "@niagads/common";

import { HelpIconWrapper } from "@niagads/ui";
import { Text } from "./BasicText";
import styles from "../styles/cell.module.css";

const _renderLink = (displayText: string, url: string, props: any) => {
    const target: LinkTarget = _get("target", props, "_blank");
    const className = _get("className", props, styles.cellLink);
    const style = _get("style", props);
    return (
        <a className={className} style={style} href={url} target={target}>
            {displayText}
        </a>
    );
};

export const LinkList = <T,>({ props }: TextRenderer<T>) => {
    const id = useId();
    const items = _get("items", props);
    if (items) {
        const numItems = items.length - 1;
        return items.map((iProps: any, index: number) => (
            <div key={`item-${id}-${index}`}>
                <Link key={`link-${id}-${index}`} props={iProps}></Link>
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

    const component = _renderLink(value ? value : url, url, props);
    const info = _get("info", props);
    if (info) {
        return (
            <HelpIconWrapper message={info} variant={"question"}>
                {component}
            </HelpIconWrapper>
        );
    }

    return component;
};
