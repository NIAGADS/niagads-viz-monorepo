import { CellType, GenericCell } from "./Cell";

import { BasicType } from "@niagads/common";
import { RowData } from "@tanstack/react-table";

export interface RowSelectColumnConfig {
    header: string;
    description?: string;
    enableMultiSelect?: boolean; // optional: allow selection of multiple rows, false if missing
    rowUniqueKey: string; // specify a field containing unique values to return as the row_id
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
    rowSelectColumn?: RowSelectColumnConfig; // optional: enables row selection and related state change options
    defaultColumns?: string[]; // optional: any column ids not listed will be hidden by default
    enableRowSelect?: boolean;
    onTableLoad?: any;
}

export type TableRow = Record<string, GenericCell | GenericCell[]>;
export type TableData = TableRow[];

//allows us to expose some of our custom column properties and access them after they've been converted to tanstack columns
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        type?: CellType;
        description?: string;
    }
}
