import { BasicType, NAString } from "@niagads/common";

import { CellType } from "./Cell";
import { FilterFnOption } from "@tanstack/react-table";
import { TableRow } from "./TableProperties";

export interface ColumnSortConfig {
    sortingFn?: string; // TODO: should be keys for CustomSortingFunctions / SortingFns
}

export type ColumnFilterType = "histogram" | "pie" | "select" | "multiselect";

export interface ColumnFilteringOpts {
    filterType?: ColumnFilterType; // defaults based on data type in column
    filterFn?: FilterFnOption<TableRow>; // defaults based on data type in  column
    // valueTransformFn?: (value: BasicType) => BasicType; // for transforming value for filter display
}

export interface ColumnStylingOpts {
    getClassName?: (value: any) => string;
    getStyle?: (value: any) => React.CSSProperties;
}

export interface ValueDisplayOpts {
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
    enableGlobalFilter?: boolean; // defaults to FALSE
    enableColumnFilter?: boolean; // defaults to TRUE
    enableSorting?: boolean; // defaults to TRUE
    required?: boolean; // if required = true then cannot be hidden
    filterOpts?: ColumnFilteringOpts;
    valueDisplayOpts?: ValueDisplayOpts;
    styling?: ColumnStylingOpts;
}

export const getColumn = (columnId: string, columns: TableColumn[]) => {
    return columns.find((col) => col.id === columnId);
};
