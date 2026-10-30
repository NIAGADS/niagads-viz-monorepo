import { FilterFnOption, SortingFnOption } from "@tanstack/react-table";
import { TableColumn, TableRow } from "../types";

/* assign a sorting function based upon column type or user-specified sortingFn */
export const resolveSortingFn = (col: TableColumn): SortingFnOption<TableRow> => {
    if (col.sortingFn) {
        return col.sortingFn;
    }

    if (col.type === "boolean") {
        return "boolean";
    }
    if (col.type === "float") {
        return "scientific";
    }
    return "alphanumeric";
};

/* assing a filter function based on column type, user-specified filterType, 
or user-specified filterFn */
export const resolveFilterFn = (col: TableColumn): FilterFnOption<TableRow> => {
    if (col.filterOpts?.filterType === "multiselect" || col.filterOpts?.filterType === "topics") {
        return "includesAny"; // multiselect & text lists
    }

    if (col.filterOpts?.filterFn) {
        return col.filterOpts.filterFn;
    }

    if (col.type === "pvalue") {
        return "pvalue";
    }

    if (col.type === "float" || col.type === "integer") {
        return "inNumberRange"; // FIXME: not really implemented yet
    }

    if (col.type === "boolean") {
        return "equals";
    }

    // text field filtering; handles text lists, other grouping
    return "includesAny";
};
