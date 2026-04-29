import { DEFAULT_NA_VALUE } from "../../types";
import React from "react";
import { _isNA } from "@niagads/common";
import styles from "./cell.module.css";

export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

export interface TextRenderer<T> {
    props: T;
}

export const renderNullValue = (value: string = DEFAULT_NA_VALUE) => {
    return <span className={styles["null-value"]}>{value}</span>;
};
