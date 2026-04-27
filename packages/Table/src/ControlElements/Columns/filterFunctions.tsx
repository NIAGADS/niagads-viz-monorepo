import { Range, negLog10 } from "@niagads/common";

import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

// fuzzy filter for global text search, allow typos, _ delimited words, etc.
export const globalFuzzyFilter: FilterFn<any> = (row, columnId, filterValue) => {
    // Rank the item solely to determine if it passes the threshold
    const itemRank = rankItem(row.getValue(columnId), filterValue);

    // Return the boolean result only
    return itemRank.passed;
};

export const neglog10Filter: FilterFn<any> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId) as number;
    const targetValue: Range | undefined = filterValue as Range;

    // If filter is empty, don't filter anything out
    if (targetValue === undefined) return true;

    return negLog10(rowValue) >= targetValue.min;
};

// for handling multi-selects, accounting for list text fields
export const includesAnyFilter: FilterFn<any> = (row, columnId, filterValue: string[]) => {
    const rowValues = row.getValue(columnId) as string[];

    if (!filterValue || filterValue.length === 0) return true;

    return rowValues.some((value) => {
        const values = value.includes("//") ? value.split(" // ") : [value];
        return filterValue.some((val) => values.includes(val));
    });
};

// for handling list text fields
export const includesFilter: FilterFn<any> = (row, columnId, filterValue: string) => {
    const rowValues = row.getValue(columnId) as string[];

    if (!filterValue) return true;

    return rowValues.some((value) => {
        const values = value.includes("//") ? value.split(" // ") : [value];
        return values.includes(filterValue);
    });
};
