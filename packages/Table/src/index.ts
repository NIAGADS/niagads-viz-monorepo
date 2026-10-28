import "./styles/global.css";

import Table from "./Table";

export type { TableProps as TableConfig } from "./Table";
export type { TableOptions, TableColumn } from "./types";
export type { TableCell } from "./Cells/types";
export { getPvalueStyle } from "./Cells/styling";
export type { RowSelectionState } from "@tanstack/react-table";

export default Table;
