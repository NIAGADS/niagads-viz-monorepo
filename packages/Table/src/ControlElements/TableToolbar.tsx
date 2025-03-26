import React, { useMemo, useCallback } from "react";

import { Column as ReactTableColumn, Table as ReactTable } from "@tanstack/react-table";

import { SearchInput } from "@bug_sam/ui";
import { TableRow } from "../TableProperties";
import { TableExportControls, exportTable } from "./TableExportControls";
import { _get } from "@bug_sam/common";
import { ColumnControls } from "./ColumnControls";

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
        <div className="relative flex justify-end gap-2 m-2">
            <SearchInput value={table.getState().globalFilter} onChange={(val) => table.setGlobalFilter(val)} />
            {canToggleColumns && (
                <ColumnControls columns={table.getAllLeafColumns()} onSelect={() => console.log("selected")} />
            )}
            {enableExport && <TableExportControls onSubmit={handleTableExport} isFiltered={tableIsFiltered} />}
        </div>
    );
};
