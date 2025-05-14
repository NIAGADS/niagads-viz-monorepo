import { SortingFn, SortingFnOption } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { TableRow } from "./TableProperties";

const booleanSort: SortingFn<TableRow> = (rowA: Row<TableRow>, rowB: Row<TableRow>, columnId: string) => {
    return _compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
} 

const scientificNotationSort: SortingFn<TableRow> = (rowA: Row<TableRow>, rowB: Row<TableRow>, columnId: string) => {
    let a = rowA.getValue(columnId) as string | number;
    let b = rowB.getValue(columnId) as string | number;

    const naComparison = _resolveNAs(`${a}`, `${b}`);
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
}

const _resolveNAs = (aStr: string, bStr: string) => {
    switch (true) {
        case aStr == "NA" && bStr == "NA":
            return 0;
        case aStr != "NA" && bStr == "NA":
            return -1;
        case aStr == "NA" && bStr != "NA":
            return 1;
        default: // neither na
            return null;
    }
}

const _compareBasic = (a: any, b: any) => {
    const naComparison = _resolveNAs(a, b);
    if (naComparison != null) {
        return naComparison;
    }
    return a === b ? 0 : a > b ? 1 : -1;
}

export const CustomSortingFunctions = {
    'boolean': booleanSort,
    'scientific': scientificNotationSort,
}

export type TableSortingFunctions = keyof typeof CustomSortingFunctions | SortingFnOption<TableRow>;
