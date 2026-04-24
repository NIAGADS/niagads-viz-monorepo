import "./styles/global.css";

import Table from "./Table";

export type { TableProps } from "./Table";
export type { TableOptions as TableConfig } from "./types";
export type { TableColumn as TableColumn } from "./Column";
export type { RowSelectionState } from "@tanstack/react-table";
export * from "./ControlElements";
export * from "./CellRenderers";

export default Table;
