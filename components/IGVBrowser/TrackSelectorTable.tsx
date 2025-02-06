'use client'
import { useEffect, useState } from "react";

import Table, { TableProps } from "@bug_sam/table"

//import { Alert } from "@bug_sam/ui/Alert"
//import { Button } from "@bug_sam/ui/Button";

export type RowSelectionState = Record<string, boolean>

interface WrapperProps {
    table: TableProps,
    handleRowSelect: any,
    onTableLoad?: any
}

export default function TrackSelectorTable({ table, handleRowSelect }:  WrapperProps) {
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
    const [disableRowSelectAction, setDisableRowSelectAction] =
        useState<boolean>(true);

    const onRowSelect = (rows: RowSelectionState) => {
        setSelectedRows(rows);
    }

    table.options && (table.options.disableColumnFilters = true);
    Object.assign(table.options!.rowSelect!, { onRowSelect: onRowSelect });
    // ideally, you shouldn't end up here unless the table has rowSelect options
    // which is why I'm assuming options.rowSelect is not null

    useEffect(() => {
        if (Object.keys(selectedRows!).length === 0) {
            setDisableRowSelectAction(true);
        } else {
            setDisableRowSelectAction(false);
            handleRowSelect(Object.keys(selectedRows))
        }
    }, [selectedRows]);


    return (
        <main>
            <Table
                id={table.id}
                data={table.data}
                columns={table.columns}
                options={table.options}
            />
        </main>
    )
}
