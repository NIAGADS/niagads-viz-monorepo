import { BadgeIconType, LinkTarget } from "./CellRenderers";
import {
    BasicType,
    Expand,
    Modify,
    NAString,
    TypeMapper,
    _deepCopy,
    _get,
    _hasOwnProperty,
    _isJSON,
    _isNA,
    _isNull,
} from "@niagads/common";

import { CSSProperties } from "react";

export type TableCell = BasicType | Record<string, any> | null;

export type AbstractCell = {
    type: "abstract";
    value: BasicType | null;
    rowId: number;
    columnId: number;
    nullValue?: BasicType | null; // if not set, treats null as NA
    naValue?: NAString; // (internal) value to assign to NAs for consistency, defaults to `NA`
    className?: string;
    style?: CSSProperties;
};

export type IntegerCell = Expand<Modify<AbstractCell, { type: "integer"; value: number | null }>>;

export type FloatCell = Expand<Modify<AbstractCell, { type: "float"; value: number | null; precision?: number }>>;

export type PValueCell = Expand<Modify<FloatCell, { type: "pvalue" }>>;

export type TextCell = Expand<Modify<AbstractCell, { type: "text"; truncateTo?: number; info?: string }>>;

export type TextListCell = Expand<Modify<AbstractCell, { type: "text_list"; value: string; items: TextCell[] }>>;

export type BadgeCell = Expand<
    Modify<
        TextCell,
        {
            type: "badge";
            icon?: BadgeIconType;
            iconOnly?: boolean;
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

export type LinkCell = Expand<Modify<AbstractCell, { type: "link"; url: string; info?: string; target?: LinkTarget }>>;

export type LinkListCell = Expand<Modify<AbstractCell, { type: "link_list"; value: string; items: LinkCell[] }>>;

export type PercentageBarCell = Expand<Modify<FloatCell, { type: "percentage_bar" }>>;

export type Cell =
    | PercentageBarCell
    | FloatCell
    | IntegerCell
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

// for run time validation
export const CELL_TYPES = [
    "percentage_bar",
    "float",
    "text",
    "abstract",
    "integer",
    "pvalue",
    "badge",
    "boolean",
    "link",
];
