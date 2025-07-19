import { TextRenderer, renderNullValue } from "./TextRenderer";
import { _get, _isNA, _isNull } from "@niagads/common";

import React from "react";
import { formatFloat } from "./Number";
import styles from "../styles/cell.module.css";

export const PercentageBar = <T,>({ props }: TextRenderer<T>) => {
    const value = _get("value", props);

    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props));
    }

    if (_isNA(value)) {
        return renderNullValue();
    }

    const formattedValue = formatFloat(value, _get("precision", props, 2));
    const observed = value > 1 ? value : value * 100.0;
    const remainder = 100.0 - observed;

    return (
        <div className={styles.sparkContainer}>
            <div className={styles.sparkValue}>{`${formattedValue}`}</div>
            <div className={`${styles.spark} ${styles.sparkBar}`}>
                <div className={`${styles.sparkBar} ${styles.sparkBarObserved}`} style={{ width: observed }} />
                <div className={`${styles.sparkBar} ${styles.sparkBarRemainder}`} style={{ width: remainder }} />
            </div>
        </div>
    );
};
