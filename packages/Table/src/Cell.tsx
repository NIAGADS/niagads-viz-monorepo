import React, { ReactNode } from "react";

import { BasicType, Modify, TypeMapper, Expand, NAString } from "@bug_sam/common";
import { _isJSON, _deepCopy, _hasOwnProperty, _get, _isNull, _isNA } from "@bug_sam/common";
import { Color } from "@bug_sam/common";

import { Text, TextList } from "./TextRenderers/BasicText";
import { Link, LinkList } from "./TextRenderers/Link";
import { Float } from "./TextRenderers/Number";
import { GenericColumn } from "./Column";
import { Badge, BooleanBadge, BadgeIconType } from "./TextRenderers/Badge";
import { PercentageBar } from "./TextRenderers/SparkChart";

export const DEFAULT_NA_VALUE = "NA";

export type GenericCell = BasicType | Record<string, any> | null;

export type AbstractCell = {
    type: "abstract";
    value: BasicType | null;
    rowId: number;
    columnId: number;
    nullValue?: BasicType | null; // if not set, treats null as NA
    naValue?: NAString; // (internal) value to assign to NAs for consistency, defaults to `NA`
};

export type StringCell = Expand<Modify<AbstractCell, { type: "string"; value: string }>>;

export type FloatCell = Expand<Modify<AbstractCell, { type: "float"; value: number | null; precision?: number }>>;

export type PValueCell = Expand<Modify<FloatCell, { type: "p_value" }>>;

export type TextCell = Expand<
    Modify<AbstractCell, { type: "text"; truncateTo?: number; color?: Color; tooltip?: string }>
>;

export type TextListCell = Expand<Modify<AbstractCell, { type: "text_list"; value: string; items: TextCell[] }>>;

export type BadgeCell = Expand<
    Modify<
        TextCell,
        {
            type: "badge";
            backgroundColor?: Color;
            borderColor?: Color;
            icon?: BadgeIconType;
        }
    >
>;

export type BooleanCell = Expand<
    Modify<
        BadgeCell,
        {
            type: "boolean";
            value: boolean | null;
            displayText?: BasicType; // what value to display (e.g., TRUE, Yes, Y, Coding, FALSE, N, No, etc)
        }
    >
>;

export type LinkCell = Expand<Modify<AbstractCell, { type: "link"; url: string; tooltip?: string }>>;

export type LinkListCell = Expand<Modify<AbstractCell, { type: "link_list"; value: string; items: LinkCell[] }>>;

export type PercentageBarCell = Expand<Modify<FloatCell, { type: "percentage_bar"; colors?: [Color, Color] }>>;

export type Cell =
    | PercentageBarCell
    | FloatCell
    | PValueCell
    | AbstractCell
    | TextCell
    | TextListCell
    | BadgeCell
    | BooleanCell
    | LinkCell
    | LinkListCell;

// create CellType which is a list string keys corresponding to allowable "types" of cells
type CellTypeMapper = TypeMapper<Cell>;
export type CellType = keyof CellTypeMapper;

// this does not include LinkList & TextList b/c those are internal cell types
const CELL_TYPE_VALIDATION_REFERENCE = [
    "boolean",
    "abstract",
    "float",
    "p_value",
    "text",
    "annotated_text",
    "badge",
    "link",
    "percentage_bar",
];

// validates cell type specified at runtime or by user is valid
// if cell type is undefined, returns "abstract"
export const validateCellType = (ctype: string | undefined): CellType => {
    if (ctype === undefined) {
        return "abstract" as CellType;
    }

    if (typeof ctype === "string" && CELL_TYPE_VALIDATION_REFERENCE.includes(ctype)) {
        return ctype as CellType; // type assertion satisfies compiler
    }

    throw new Error("Invalid data type `" + ctype + "`");
};

// catch NULLs and NAs
const __resolveValue = (props: Cell): BasicType => {
    const naValue = _get("naValue", props, DEFAULT_NA_VALUE);
    const nullValue = _get("nullValue", props, naValue);
    return _isNull(props.value) ? nullValue : _isNA(props.value) ? naValue : _get("value", props);
};

const __resolveBooleanValue = (props: BooleanCell): BasicType => {
    const displayText = _get("displayText", props);
    return displayText ? displayText : __resolveValue(props);
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
            case "p_value":
                return __resolvePValueValue(cellProps as PValueCell);
            default:
                return __resolveValue(cellProps);
        }
    }
};

const __resolveLinkCell = (cell: GenericCell): GenericCell => {
    const value = _get("value", cell);
    const url = _get("url", cell);
    Object.assign(cell as any, { value: value ? value : url, type: "link" });
    return cell;
};

const __resolveListCell = (cells: GenericCell[]) => {
    const values = cells.map((c: GenericCell) => _get("value", c));
    const value = values.join(" // ");

    return { type: "abstract", value: value, items: cells };
};

// assigns parent column cell type to each cell (to facilitate rendering)
// sets cell type to "abstract" if undefined
// does some error checking:
// 1. makes sure user specified a cell type to the parent column if cell value is an object/JSON

export const resolveCell = (cell: GenericCell | GenericCell[], column: GenericColumn): GenericCell | GenericCell[] => {
    let resolvedCellType = _get("type", column, "abstract");
    let resolvedCell: GenericCell = {};

    if (Array.isArray(cell)) {
        if (resolvedCellType == "abstract") {
            throw Error(
                "Cell contains an array; must specify either " +
                    "`text` or `link` as the cell `type` in the column defintion: " +
                    JSON.stringify(cell)
            );
        }

        const cellList = cell.map((c: GenericCell) => resolveCell(c, column) as GenericCell);
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
            console.warn(
                "`type` must be specified in the column defintion to correctly interpret structured values; assuming `" +
                    resolvedCellType +
                    "` cell: " +
                    JSON.stringify(cell)
            );
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
    const fOptions = _get("format", column);
    if (fOptions) {
        if (resolvedCellType == "boolean") {
            const value = _get("value", resolvedCell);
            const trueDisplay = _get("trueValue", fOptions);
            if (trueDisplay && value === true) {
                Object.assign(resolvedCell as BooleanCell, {
                    displayText: trueDisplay,
                });
            }
        }

        if (resolvedCellType == "float") {
            const precision = _get("precision", fOptions);
            if (precision) {
                Object.assign(resolvedCell as FloatCell, { precision: precision });
            }
        }

        // assign common column properties
        Object.assign(resolvedCell as any, {
            nullValue: _get("nullValue", fOptions),
            naValue: _get("naValue", fOptions, DEFAULT_NA_VALUE),
        });
    }

    return resolvedCell;
};

export const renderCell = (cell: Cell) => {
    switch (cell.type) {
        case "abstract":
        case "text":
            return <Text props={cell}></Text>;
        case "link":
            return <Link props={cell}></Link>;
        case "boolean":
            return <BooleanBadge props={cell}></BooleanBadge>;
        case "badge":
            return <Badge props={cell}></Badge>;
        case "float":
        case "p_value":
            return <Float props={cell}></Float>;
        case "percentage_bar":
            return <PercentageBar props={cell}></PercentageBar>;
        case "text_list":
            return <TextList props={cell}></TextList>;
        case "link_list":
            return <LinkList props={cell}></LinkList>;
        default:
            throw Error(`Unknown cell type for rendering: ${JSON.stringify(cell as Cell)}`);
    }
};

export const renderCellHeader = (label: string, helpText: string) => {
    return <div>{label}</div>;
};
