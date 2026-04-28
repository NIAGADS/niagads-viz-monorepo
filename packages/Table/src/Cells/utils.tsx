import { Badge, BooleanBadge, Float, Link, LinkList, PercentageBar, Text, TextList } from "./CellRenderers";
import { BasicType, _deepCopy, _get, _hasOwnProperty, _isJSON, _isNA, _isNull } from "@niagads/common";
import { BooleanCell, CELL_TYPES, Cell, CellType, FloatCell, PValueCell, TableCell } from "./types";
import { DEFAULT_NA_VALUE, TableColumn } from "../types";

import React from "react";

// validates cell type specified at runtime or by user is valid
// if cell type is undefined, returns "abstract"
// this does not include LinkList & TextList b/c those are internal cell types

export const validateCellType = (ctype: string | undefined): CellType => {
    if (ctype === undefined) {
        return "abstract" as CellType;
    }

    if (CELL_TYPES.includes(ctype)) {
        return ctype as CellType; // type assertion satisfies compiler
    }

    throw new Error("Invalid table cell type `" + ctype + "`");
};

// catch NULLs and NAs
const __resolveValue = (props: Cell): BasicType => {
    const naValue = _get("naValue", props, DEFAULT_NA_VALUE);
    const nullValue = _get("nullValue", props, naValue);
    return _isNull(props.value) ? nullValue : _isNA(props.value) ? naValue : _get("value", props);
};

const __resolveBooleanValue = (props: BooleanCell): BasicType => {
    const displayText = _get("displayText", props);
    return displayText ? displayText : `${__resolveValue(props)}`;
};

const __resolveFloatValue = (props: FloatCell): BasicType => {
    const displayText = _get("displayText", props);
    return displayText ? displayText : +__resolveValue(props);
};

//TODO: properly handle P Value values as numbers or handle them with neg_log10_pvalue
const __resolvePValueValue = (props: PValueCell): BasicType => {
    const displayText = _get("displayText", props);
    return displayText ? displayText : +__resolveValue(props);
};

// cell accessor function; gets the value; resolves nulls
// will always return a string or number, possibly boolean if we refactor `__resolveBooleanCell`
// has to return "any" to satisfy react table accessorFn
export const getCellValue = (cellProps: Cell | Cell[]): any => {
    if (Array.isArray(cellProps)) {
        // recursively get the values from the list items
        // and concatenate w/ '//' delimiter
        return cellProps.map((item) => getCellValue(item)).join(" // ");
    } else {
        const cellType: CellType = cellProps.type;
        switch (cellType) {
            case "boolean":
                return __resolveBooleanValue(cellProps as BooleanCell);
            case "float":
                return __resolveFloatValue(cellProps as FloatCell);
            case "pvalue":
                return __resolvePValueValue(cellProps as PValueCell);
            default:
                return __resolveValue(cellProps);
        }
    }
};

const __resolveLinkCell = (cell: TableCell): TableCell => {
    const value = _get("value", cell);
    const url = _get("url", cell);
    Object.assign(cell as any, { value: value ? value : url, type: "link" });
    return cell;
};

const __resolveListCell = (cells: TableCell[]) => {
    const values = cells.map((c: TableCell) => _get("value", c));
    const value = values.join(" // ");

    return { type: "abstract", value: value, items: cells };
};

// assigns parent column cell type to each cell (to facilitate rendering)
// sets cell type to "abstract" if undefined
// does some error checking:
// 1. makes sure user specified a cell type to the parent column if cell value is an object/JSON

export const resolveCell = (
    cell: TableCell | TableCell[],
    column: TableColumn,
    rowId: number
): TableCell | TableCell[] => {
    let resolvedCellType = _get("type", column, "abstract");
    let resolvedCell: TableCell = {};

    if (Array.isArray(cell)) {
        if (resolvedCellType == "abstract") {
            throw Error(
                "Cell contains an array; must specify either " +
                    "`text` or `link` as the cell `type` in the column defintion: " +
                    JSON.stringify(cell)
            );
        }

        const cellList = cell.map((c: TableCell) => resolveCell(c, column, rowId) as TableCell);
        if (resolvedCellType == "text") {
            resolvedCell = __resolveListCell(cellList);
            resolvedCellType = "text_list";
        } else if (resolvedCellType == "link") {
            resolvedCell = __resolveListCell(cellList);
            resolvedCellType = "link_list";
        } else {
            throw Error(
                "Arrays of values are only supported for " +
                    "`text` or `link` table cell types: " +
                    JSON.stringify(cell)
            );
        }
    } else if (_isJSON(cell)) {
        resolvedCell = _deepCopy(cell);

        if (resolvedCellType == "link") {
            resolvedCell = __resolveLinkCell(resolvedCell);
        }

        if (resolvedCellType === "abstract") {
            if (_hasOwnProperty("url", cell)) {
                resolvedCellType = "link";
                resolvedCell = __resolveLinkCell(resolvedCell);
            } else {
                resolvedCellType = "text";
            }
        }

        if (_get("value", resolvedCell) == null) {
            throw Error("unable to infer `value` for cell: " + JSON.stringify(cell));
        }
    } else {
        // we have a raw value, so create the 'value' k-v pair
        Object.assign(resolvedCell as any, { value: cell });
    }

    if (resolvedCellType === "abstract") {
        resolvedCellType = "text";
    }

    Object.assign(resolvedCell as any, { type: resolvedCellType });

    // assign column formatting based on cell type
    const formattingOpts = column.valueDisplayOpts;
    if (formattingOpts) {
        Object.assign(resolvedCell as any, {
            nullValue: _get("nullValue", formattingOpts),
            naValue: _get("naValue", formattingOpts, DEFAULT_NA_VALUE),
        });

        if (resolvedCellType == "boolean") {
            const value = _get("value", resolvedCell);
            const trueDisplay = _get("trueValue", formattingOpts);
            if (trueDisplay && value === true) {
                Object.assign(resolvedCell as BooleanCell, {
                    displayText: trueDisplay,
                });
            }
        }
        if (resolvedCellType == "float") {
            const precision = _get("precision", formattingOpts);
            if (precision) {
                Object.assign(resolvedCell as FloatCell, { precision: precision });
            }
        }
    }

    // assign styling opts; but let local cell values override column level valus
    const stylingOpts = column.styling;
    if (stylingOpts) {
        if (stylingOpts.getClassName) {
            const className = [_get("className", resolvedCell), stylingOpts.getClassName(_get("value", resolvedCell))]
                .filter(Boolean)
                .join(" ");
            Object.assign(resolvedCell as any, {
                className: className || null,
            });
        }

        if (stylingOpts.getStyle) {
            const style = {
                ...(stylingOpts.getStyle(_get("value", resolvedCell)) || {}),
                ...(_get("style", resolvedCell) || {}),
            };

            Object.assign(resolvedCell as any, {
                style: Object.keys(style).length ? style : null,
            });
        }
    }

    Object.assign(resolvedCell as any, { columnId: column.id, rowId: rowId });

    return resolvedCell;
};

export const renderCell = (cell: Cell) => {
    switch (cell.type) {
        case "abstract":
        case "text":
            return <Text key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></Text>;
        case "link":
            return <Link key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></Link>;
        case "boolean":
            return <BooleanBadge key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></BooleanBadge>;
        case "badge":
            return <Badge key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></Badge>;
        case "float":
        case "pvalue":
            return <Float key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></Float>;
        case "integer":
            return <Float key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></Float>;
        case "percentage_bar":
            return <PercentageBar key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></PercentageBar>;
        case "text_list":
            return <TextList key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></TextList>;
        case "link_list":
            return <LinkList key={`cell-${cell.rowId}-${cell.columnId}`} props={cell}></LinkList>;
        default:
            throw Error(`Unknown cell type for rendering: ${JSON.stringify(cell as Cell)}`);
    }
};

export const renderCellHeader = (label: string, helpText: string) => {
    return <div>{label}</div>;
};
