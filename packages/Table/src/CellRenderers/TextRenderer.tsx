import { _get, _hasOwnProperty, _isNA, _isNull } from "@niagads/common";

import React from "react";
import styles from "../styles/cell.module.css";

export interface TextRenderer<T> {
    props: T;
}

export const renderNullValue = (value: string = "n/a") => {
    return <span className={styles.nullValue}>{_isNA(value) || value}</span>;
};

/**
 * extract style properties and build object to pass to component style
 * @param props text renderer property object
 * @param property specific style property to extract; if null will look for all allowable style properties
 * @returns style object
 */
export const buildElementStyle = (props: any, property: string | null = null) => {
    const VALID_STYLES = property ? [property] : ["color", "backgroundColor", "borderColor"];
    const style = {};
    for (const vStyle of VALID_STYLES) {
        if (_hasOwnProperty(vStyle, props)) {
            Object.assign(style, { [vStyle]: _get(vStyle, props) });
        }
    }

    if (_hasOwnProperty("borderColor", style)) {
        Object.assign(style, { border: "1px solid" });
    }

    return style;
};
