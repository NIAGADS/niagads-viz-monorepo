import { BasicType, NAString } from "@niagads/common";
import { CellType, GenericCell } from "./Cell";
import { FilterFnOption, RowData, SortingFnOption } from "@tanstack/react-table";

// initial table state
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

export interface RowSelectOptions {
    header: string; // select column header
    description?: string; // select column description
    enableMultiSelect?: boolean; // optional: allow selection of multiple rows, false if missing
    rowUniqueKey: string; // specify a field containing unique values to return as the row_id
}

export interface TableOptions {
    title?: string;
    description?: string; // optional: descriptive text describing the table for info popup
    initialize?: InitialTableState; // optional: set initial sort and/or filter state for the table
    enableColumnFilters?: boolean; // optional: disables all filtering on table columns when FALSE; defaults to FALSE
    enableExport?: boolean; // optional: disables exporting when FALSE; defaults to FALSE
    enableRowSelect?: boolean; // optional; enables row selection when TRUE; defaults to FALSE
    rowSelectOpts?: RowSelectOptions; // optional: enables row selection and related state change options
    defaultColumns?: string[]; // optional: any column ids not listed will be hidden by default
    onTableLoad?: any;
}

export type TableRow = Record<string, GenericCell | GenericCell[]>;
export type TableData = TableRow[];

export type ColumnFilterType = "histogram" | "pie" | "select" | "multiselect" | "boolean";

export interface ColumnFilteringOpts {
    filterType?: ColumnFilterType; // defaults based on data type in column
    filterFn?: FilterFnOption<TableRow>; // defaults based on data type in  column
    // valueTransformFn?: (value: BasicType) => BasicType; // for transforming value for filter display
}

export interface ColumnStylingOpts {
    getClassName?: (value: any) => string;
    getStyle?: (value: any) => React.CSSProperties;
}

export interface ColumnValueDisplayOpts {
    nullValue?: BasicType | null; // value to assign for nulls; e.g., for booleans, set nullValue = false to treat NULL as FALSE; if not set treats as NA
    naValue?: NAString; // value to assign for NAs; default `NA`
    trueValue?: BasicType; // for booleans; defaults to TRUE
    precision?: number; // for floats
}

// allowable fields provided by users
// TODO: custom sorting /filtering functions?!
export interface TableColumn {
    header?: string;
    id: string;
    description?: string;
    type?: CellType; // defaults to string
    disableGlobalFilter?: boolean; // defaults to FALSE
    disableColumnFilter?: boolean; // defaults to FALSE
    disableSorting?: boolean; // defaults to FALSE
    required?: boolean; // if required = true then cannot be hidden
    filterOpts?: ColumnFilteringOpts;
    valueDisplayOpts?: ColumnValueDisplayOpts;
    styling?: ColumnStylingOpts;
    sortingFn?: SortingFnOption<TableRow>;
}

//allows us to expose some of our custom column properties and access them after they've been converted to tanstack columns
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        type: CellType;
        filterType?: ColumnFilterType;
        naValue?: string;
        trueValue?: BasicType;
        description?: string;
    }

    // This "merges" your custom functions into the existing Column interface
    interface Column<TData extends RowData, TValue> {
        getAllValues: (filterNulls?: boolean, naValue?: string) => TValue[];
    }
}
