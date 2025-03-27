import { BasicType, NAString } from "@niagads/common";
import { CellType } from "./Cell";

export interface ColumnSortConfig {
    sortingFn?: string; // TODO: should be keys for CustomSortingFunctions / SortingFns
}

export interface ColumnFilterConfig {
    initial?: BasicType | null; // optional: table will be initially filtered by this column / value, missing or null = no initial filter
    filterFn?: string; // TODO: should by keys for CustomFilteringFunctions / FilterFns
}

export interface ColumnValueFormat {
    nullValue?: BasicType | null; // value to assign for nulls; e.g., for booleans, set nullValue = false to treat NULL as FALSE; if not set treats as NA
    naValue?: NAString; // value to assign for NAs; default `NA`
    trueValue?: BasicType; // for booleans; defaults to TRUE
    precision?: number; // for floats
}

// allowable fields provided by users
// TODO: custom sorting /filtering functions?!
export interface GenericColumn {
    header?: string;
    id: string;
    description?: string;
    type?: CellType;
    canFilter?: boolean; // defaults to TRUE
    disableGlobalFilter?: boolean; // defaults to FALSE
    disableSorting?: boolean; // defaults to FALSE
    required?: boolean; // if required = true then cannot be hidden
    format?: ColumnValueFormat;
}

export const getColumn = (columnId: string, columns: GenericColumn[]) => {
    return columns.find((col) => col.id === columnId);
};
