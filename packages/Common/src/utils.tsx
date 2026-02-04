import React, { JSX } from "react";

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

export const _isEmpty = (value: Record<string, any> | null | undefined) => {
    const check = (o: typeof value) => {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };

    return value === null || value === undefined || check(value);
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

export function caseInsensitiveIncludes(array: string[], value: string) {
    const lcValue = value.toLowerCase();
    return array.some((item) => item.toLowerCase().includes(lcValue));
}

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

export function linkify(text: string): string {
    // find a link in a string and replace with a <a></a> element
    // Regex to match URLs (http, https, www)
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith("http") ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

export function formatMultiline(text: string | string[], delimiter: string = "\n"): JSX.Element[] {
    // takes a string or list of strings and breaks it into multiple lines for pretty printing
    // If text is an array, map directly
    if (Array.isArray(text)) {
        return text.map((line, idx) => <p key={`${idx}-${line}`}>{line}</p>);
    }
    // If text is not a string, convert to string (handles null/undefined gracefully)
    if (typeof text !== "string") {
        text = text == null ? "" : String(text);
    }
    // Split string by delimiter and map
    return text.split(delimiter).map((line, idx) => <p key={`${idx}-${line}`}>{line}</p>);
}

export function getUrlParam(url: string, param: string): string | null {
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        // url needs to be full url, but most of the time we just have paths
        // this is hacky, but it gets around that issue
        parsed = new URL(url, "https://google.com");
    }
    return parsed.searchParams.get(param);
}
