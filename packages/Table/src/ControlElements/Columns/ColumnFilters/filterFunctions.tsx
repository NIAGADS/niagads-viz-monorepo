import { Range, negLog10 } from "@niagads/common";
import { rankItem, rankings } from "@tanstack/match-sorter-utils";

import { FilterFn } from "@tanstack/react-table";

// fuzzy filter for global text search, allow typos, _ delimited words, etc.
export const globalFuzzyFilter: FilterFn<any> = (row, columnId, filterValue: string) => {
    // Rank the item and determine ranking type, pass contains
    const itemRank = rankItem(row.getValue(columnId), filterValue);
    return itemRank.rank >= rankings.CONTAINS;
};

export const neglog10Filter: FilterFn<any> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId) as number;
    const targetValue: number | undefined = filterValue;

    // If filter is empty, don't filter anything out
    if (targetValue === undefined) return true;

    return negLog10(rowValue) >= targetValue;
};

// for handling multi-selects, accounting for list text fields
// and anything that might have "Other", so basically, all text fields
export const includesAnyFilter: FilterFn<any> = (row, columnId, filterValue: string[]) => {
    const rowValue = row.getValue(columnId) as string;

    if (!filterValue || filterValue.length === 0) return true;
    const values = rowValue.includes("//") ? rowValue.split(" // ") : [rowValue];
    return filterValue.some((val) => values.includes(val));
};
