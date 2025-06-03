import { BasicType } from "./types";

// checks if object is defined before checking if object has key
export const _hasOwnProperty = (key: string, object: any) => object !== undefined && object.hasOwnProperty(key);

// wrapper get; allows bypassing of some typescript issues
// e.g., strict nulls, generics with expected properties
// also, allows an alternative (default) value if object does not have the property
export const _get = (key: string, object: any, alt: any = null) => {
    if (_hasOwnProperty(key, object)) {
        // not using _hasOwnProperty here by/c want an error raised if trying to access an undefined object
        return object[key];
    }
    return alt;
};

export function pathJoin(...items: string[]) {
    const pattern = new RegExp("/" + "{1,}", "g"); // matches +1 occurrences of the separator
    return items.join("/").replace(pattern, "/");
}

// trick for deep copy
// see https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
export const _deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const _isObject = (a: any) => a instanceof Object;

export const _isJSON = (value: any) => {
    try {
        value = JSON.parse(value);
    } catch (e) {
        // catch numbers, nulls, booleans
        return _isObject(value) && value != null;
    }

    // catch numbers, nulls, booleans
    return _isObject(value) && value != null;
};

export const _isNA = (value: BasicType | null, nullsAsNA: boolean = false) => {
    const NA_STRINGS = ["NA", "N/A", "NULL", ".", ""];

    if (value && typeof value === "string" && NA_STRINGS.includes(value.toUpperCase())) {
        return true;
    }

    if (nullsAsNA) {
        return _isNull(value);
    }

    return false;
};

export const _isNull = (value: BasicType | null) => {
    return value === null || value === undefined;
};

export const toFixedWithoutZeros = (value: number, precision: number = 2) => {
    return Number.parseFloat(value.toFixed(precision)).toString();
};

export const toExponential = (value: string | number, precision: number = 2) => {
    const snValue = Number.parseFloat(value.toString()).toExponential(precision ? precision : 2);

    let [mantissa, exponent] = (snValue + "").split("e");
    if (parseInt(exponent) > 3 || parseInt(exponent) < -4) {
        mantissa = mantissa.endsWith("0") ? toFixedWithoutZeros(Number.parseFloat(mantissa), precision) : mantissa;
        return `${mantissa}e${exponent}`;
    }
    return value;
};

// adapted from: https://stackoverflow.com/a/196991
export const toTitleCase = (value: string) =>
    value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());

// adapted from https://jsfiddle.net/KJQ9K/554/
export function jsonSyntaxHighlight(json: any) {
    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match: string) {
            var cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
        }
    );
}
