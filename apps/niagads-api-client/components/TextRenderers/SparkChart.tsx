import React from "react"

import { _deepCopy, _get, _hasOwnProperty, _isJSON, _isNA, _isNull, toExponential, toFixedWithoutZeros } from "@/common/utils";

import {
    TextRenderer,
    renderNullValue,
} from "./TextRenderer";
import { formatFloat } from "./Number";

const __TAILWIND_CSS = {
    bar: "h-[20px] inline-block",
    percentage: {
        observed: "bg-green-600",
        remainder: "bg-gray-300",      
    }
}

export const PercentageBar = <T,>({ props }: TextRenderer<T>) => {
    const value = _get('value', props)

    if (_isNull(value)) {
        return renderNullValue(_get('nullValue', props))
    }

    if (_isNA(value)) {
        return renderNullValue()
    }

    const formattedValue = formatFloat(value, _get('precision', props, 2))
    const observed = value > 1 ? value : value * 100.0
    const remainder = 100.0 - observed

    return <>
        <div className="inline-flex">
            <div className={`${__TAILWIND_CSS.bar} w-[35px]`}>{`${formattedValue} `}</div>
            <div className="inline-block w-[100px] mr-2">
                <div className={`${__TAILWIND_CSS.bar} ${__TAILWIND_CSS.percentage.observed}`} 
                    style={ {width: observed}}/>
                <div className={`${__TAILWIND_CSS.bar} ${__TAILWIND_CSS.percentage.remainder}`}
                    style={ {width: remainder}}/>
            </div>
        </div>
    </>
}