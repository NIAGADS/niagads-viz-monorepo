import { TextRenderer, formatFloat, renderNullValue } from ".";
import { _get, _isNA, _isNull } from "@niagads/common";

import { DEFAULT_NA_VALUE } from "../../types";
import React from "react";
import styles from "./cell.module.css";

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
        <div className={styles["spark-container"]}>
            <div className={styles["spark-value"]}>{`${formattedValue}`}</div>
            <div className={`${styles.spark} ${styles["spark-bar"]}`}>
                <div
                    className={`${styles.spark} ${styles["spark-bar"]} ${styles["spark-bar-observed"]}`}
                    style={{ width: observed }}
                />
                <div
                    className={`${styles.spark} ${styles["spark-bar"]} ${styles["spark-bar-remainder"]}`}
                    style={{ width: remainder }}
                />
            </div>
        </div>
    );
};
