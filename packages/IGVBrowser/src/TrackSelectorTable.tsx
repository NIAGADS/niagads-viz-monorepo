import { useEffect, useState } from "react";

import React from "react";
import Table from "@niagads/table";

export type RowSelectionState = Record<string, boolean>;

export interface TableProps {
    id: string;
    options?: any;
    columns: any;
    data: any;
}

interface WrapperProps {
    table: TableProps;
    handleRowSelect: any;
    onTableLoad?: any;
}

const TrackSelectorTable = ({ table, handleRowSelect }: WrapperProps) => {
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
    const [disableRowSelectAction, setDisableRowSelectAction] = useState<boolean>(true);

    const onRowSelect = (rows: RowSelectionState) => {
        setSelectedRows(rows);
    };

    // Initialize rowSelect if it doesn't exist
    if (!table.options) table.options = {};
    Object.assign(table.options, { rowSelect: { onRowSelect: onRowSelect, enableMultiRowSelect: true, rowId: "id" } });

    useEffect(() => {
        if (Object.keys(selectedRows!).length === 0) {
            setDisableRowSelectAction(true);
        } else {
            setDisableRowSelectAction(false);
            handleRowSelect(Object.keys(selectedRows));
        }
    }, [selectedRows]);

    return (
        <main>
            <Table id={table.id} data={table.data} columns={table.columns} options={table.options} />
        </main>
    );
};

export default TrackSelectorTable;
