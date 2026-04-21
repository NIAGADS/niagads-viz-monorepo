import { TextRenderer, renderNullValue } from "./TextRenderer";
import { _get, _isNA, _isNull } from "@niagads/common";

import { DEFAULT_NA_VALUE } from "../Cell";
import React from "react";
import { formatFloat } from "./Number";
import styles from "../styles/cell.module.css";

export const PercentageBar = <T,>({ props }: TextRenderer<T>) => {
    const value = _get("value", props);

    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props, DEFAULT_NA_VALUE));
    }

    if (_isNA(value)) {
        return renderNullValue(_get("naValue", props, DEFAULT_NA_VALUE));
    }

    const formattedValue = formatFloat(value, _get("precision", props, 2));
    const observed = value > 1 ? value : value * 100.0;
    const remainder = 100.0 - observed;

    return (
        <div className={styles.sparkContainer}>
            <div className={styles.sparkValue}>{`${formattedValue}`}</div>
            <div className={`${styles.spark} ${styles.sparkBar}`}>
                <div
                    className={`${styles.spark} ${styles.sparkBar} ${styles.sparkBarObserved}`}
                    style={{ width: observed }}
                />
                <div
                    className={`${styles.spark} ${styles.sparkBar} ${styles.sparkBarRemainder}`}
                    style={{ width: remainder }}
                />
            </div>
        </div>
    );
};
