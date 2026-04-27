import { Row } from "@tanstack/react-table";
import { SortingFn } from "@tanstack/react-table";
import { TableRow } from "../../types";
import { _isNA } from "@niagads/common";

export const booleanSort: SortingFn<TableRow> = (rowA: Row<TableRow>, rowB: Row<TableRow>, columnId: string) => {
    return __compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
};

export const scientificNotationSort: SortingFn<TableRow> = (
    rowA: Row<TableRow>,
    rowB: Row<TableRow>,
    columnId: string
) => {
    let a = rowA.getValue(columnId) as string | number;
    let b = rowB.getValue(columnId) as string | number;

    const naComparison = __resolveNAs(`${a}`, `${b}`);
    if (naComparison != null) {
        return naComparison;
    }

    a = a === null || a === undefined ? -Infinity : a;
    b = b === null || b === undefined ? -Infinity : b;

    // tests to see if the value is a string in scientific notation (x.xe-x)
    // if so, convert to number
    a = /\d(\.\d+)?e-\d+/.test(a as string) ? +a : a;
    b = /\d(\.\d+)?e-\d+/.test(b as string) ? +b : b;

    if (a > b) return 1;
    if (a < b) return -1;

    return 0;
};

const __resolveNAs = (aStr: string, bStr: string) => {
    const a_isNA = _isNA(aStr);
    const b_isNA = _isNA(bStr);
    switch (true) {
        case a_isNA && b_isNA:
            return 0;
        case !a_isNA && b_isNA:
            return -1;
        case a_isNA && !b_isNA:
            return 1;
        default: // neither na
            return null;
    }
};

const __compareBasic = (a: any, b: any) => {
    const naComparison = __resolveNAs(a, b);
    if (naComparison != null) {
        return naComparison;
    }
    return a === b ? 0 : a > b ? 1 : -1;
};
