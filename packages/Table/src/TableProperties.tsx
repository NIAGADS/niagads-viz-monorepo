import { BasicType } from "@niagads/common";
import { CellType, GenericCell } from "./Cell";
import { RowSelectionState, RowData, ColumnFiltersState } from "@tanstack/react-table";
import { ColumnFilterType } from "./Column";

export type RowSelectAction = "ACCESS_ROW_DATA" | "UPDATE_GENOME_BROWSER" | "UPDATE_LOCUS_ZOOM";
export interface RowSelectOptions {
    onRowSelect: (rowSelection: RowSelectionState) => void; // behavior on select
    onRowSelectAction?: RowSelectAction;
    header: string;
    description?: string;
    enableMultiRowSelect?: boolean; // optional: allow selection of multiple rows, false if missing
    selectedValues?: string[]; // a list of unique row identifiers the be selected in advance
    rowId: string; // specify a field containing unique values to return as the row_id (e.g., browser track key) instead of the index
}

export interface ColumnFilterOptions {
    externalColumnFilters: ColumnFiltersState;
}

interface SortConfig {
    [column: string]: "asc" | "desc";
}
interface FilterConfig {
    [column: string]: BasicType;
}

interface InitialTableState {
    sort?: SortConfig;
    filter?: FilterConfig;
}

export interface TableConfig {
    title?: string;
    initialize?: InitialTableState; // optional: set initial sort and/or filter state for the table
    description?: string; // optional: descriptive text describing the table for info popup
    disableColumnFilters?: boolean; // optional: disables all filtering on table columns when TRUE
    disableExport?: boolean; // optional: disables exporting
    rowSelect?: RowSelectOptions; // optional: enables row selection and related state change options
    columnFilters?: ColumnFilterOptions;
    defaultColumns?: string[]; // optional: any column ids not listed will be hidden by default
    onTableLoad?: any;
    disableMultiSelect?: boolean; //optional: only allows a single row to be selected; uses radio buttons instead of checkboxes
}

export type TableRow = Record<string, GenericCell | GenericCell[]>;
export type TableData = TableRow[];

//allows us to expose some of our custom column properties and access them after they've been converted to tanstack columns
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        type?: CellType;
        filterType?: ColumnFilterType;
        description?: string;
    }
}
