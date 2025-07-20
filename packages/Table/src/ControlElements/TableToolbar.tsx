import { ButtonGroup, TextInput } from "@niagads/ui";
import React, { useCallback, useMemo } from "react";
import { Table as ReactTable, Column as ReactTableColumn } from "@tanstack/react-table";
import { TableExportControls, exportTable } from "./TableExportControls";

import { ColumnControls } from "./ColumnControls";
import { TableRow } from "../TableProperties";
import { _get } from "@niagads/common";
import styles from "../styles/controls.module.css";

interface ToolbarProps {
    table: ReactTable<TableRow>;
    tableId: string;
    enableExport: boolean;
}

// if all columns are required, then cannot toggle column visibility for the table
const __canToggleColumns = (columns: ReactTableColumn<TableRow>[]) => {
    const requiredColumns = columns.map((col) => !col.getCanHide());
    return requiredColumns.some((x) => x === false);
};

export const TableToolbar = ({ table, tableId, enableExport }: ToolbarProps) => {
    const canToggleColumns = useMemo(() => __canToggleColumns(table.getAllColumns()), []);
    const tableIsFiltered: boolean =
        table.getState().globalFilter !==
        ""; /* && table.getState().columnFilters ? -> array so not sure what to test yet */

    const handleTableExport = useCallback((options: any) => {
        // FIXME:? Not sure if useCallback is necessary here
        exportTable(table, tableId, _get("filtered_only", options, false), options.format);
    }, []);

    return (
        <div className={styles["table-toolbar-container"]}>
            <TextInput value={table.getState().globalFilter} onChange={(val) => table.setGlobalFilter(val)} />
            <ButtonGroup>
                {canToggleColumns && (
                    <ColumnControls columns={table.getAllLeafColumns()} onSelect={() => console.log("selected")} />
                )}
                {enableExport && <TableExportControls onSubmit={handleTableExport} isFiltered={tableIsFiltered} />}
            </ButtonGroup>
        </div>
    );
};
