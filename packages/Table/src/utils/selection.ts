import type { RowSelectionState } from "@tanstack/react-table";

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
