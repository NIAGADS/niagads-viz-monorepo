import React from "react";

import { _deepCopy, _get, _hasOwnProperty, _isJSON, _isNA, _isNull } from "@niagads/common";

import { TextRenderer, renderNullValue } from "./TextRenderer";
import { formatFloat } from "./Number";

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
        <div className="flex flex-row">
            <div className="tr-spark-value">{`${formattedValue}`}</div>
            <div className="tr-spark tr-spark-bar">
                <div className="tr-spark tr-spark-bar-observed" style={{ width: observed }} />
                <div className="tr-spark tr-spark-bar-remainder" style={{ width: remainder }} />
            </div>
        </div>
    );
};
