import "./styles/global.css";

import Table from "./Table";

export type { TableProps } from "./Table";
export type { TableConfig } from "./TableProperties";
export type { GenericColumn } from "./Column";
export type { RowSelectionState } from "@tanstack/react-table";
export * from "./ControlElements";
export * from "./CellRenderers";

export default Table;
