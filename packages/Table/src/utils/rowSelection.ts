import { Cell } from "../Cells/types";
import type { RowSelectionState } from "@tanstack/react-table";
import { TableData } from "../types";
import { getCellValue } from "../Cells/utils";

/** Reject additions beyond the limit, while allowing removals from any state. */
export function limitRowSelection(
    previous: RowSelectionState,
    next: RowSelectionState,
    maximum?: number
): RowSelectionState {
    if (maximum === undefined) return next;
    const selected = Object.keys(next).filter((id) => next[id]);
    const addsSelection = selected.some((id) => !previous[id]);
    return selected.length > maximum && addsSelection ? previous : next;
}

/* normalize public `rowSelection` array into TanStack RowSelectState */
export const resolveRowSelectionState = (state: RowSelectionState | string[] | undefined): RowSelectionState => {
    if (!state) return {};

    return Array.isArray(state) ? Object.fromEntries(state.map((rowId) => [rowId, true])) : state;
};

/* verifies that a field contains a unique value for each row in table,
allowing it to be used as a `primary key` or `row_id` for row selection */
export const isValidUniqueKey = (data: TableData, columnId: string) => {
    const values = data.map((row) => getCellValue(row[columnId as keyof typeof row] as Cell));
    return Array.from(new Set(values)).length == data.length;
};
