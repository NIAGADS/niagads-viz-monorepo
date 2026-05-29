import { Text, TextRenderer, renderNullValue } from ".";
import { _get, _isNA, _isNull, toExponential, toFixedWithoutZeros } from "@niagads/common";

import { DEFAULT_NA_VALUE } from "../../types";
import React from "react";

export const formatFloat = (value: number, precision: number = 2) => {
    const formattedValue: any = toExponential(value, precision);
    if (precision && !formattedValue.toString().includes("e")) {
        return toFixedWithoutZeros(+formattedValue, precision);
    }
    return formattedValue;
};

export const Float = <T,>({ props }: TextRenderer<T>) => {
    let value = _get("value", props);

    if (_isNull(value)) {
        return renderNullValue(_get("nullValue", props, DEFAULT_NA_VALUE));
    }

    if (_isNA(value)) {
        return renderNullValue(_get("naValue", props, DEFAULT_NA_VALUE));
    }

    // mono font is default for all numeric cells;
    // column-level getStyle spreads after and can override
    const style = { fontFamily: "var(--font-mono)", ...(_get("style", props) || {}) };

    const cellType = _get("type", props);
    if (cellType === "integer") {
        return <Text props={Object.assign(props as any, { value, style })} />;
    }

    const precision = _get("precision", props, null);
    value = formatFloat(value, precision);

    return <Text props={Object.assign(props as any, { value, style })} />;
};