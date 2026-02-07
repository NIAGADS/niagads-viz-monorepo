import React, { useEffect, useState } from "react";
import Table, { type TableProps } from "@niagads/table";

export type RowSelectionState = Record<string, boolean>;
export type { TableProps };

interface TrackSelectorTableProps {
    table: TableProps;
    onRowSelect: any;
    onTableLoad: any;
}

// TODO: EGA - I am not sure of the logic of the `disableRowSelectAction` state
// I think the original intent was to limit then number of selectable rows

const TrackSelectorTable = ({ table, onRowSelect, onTableLoad }: TrackSelectorTableProps) => {
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
    const [disableRowSelectAction, setDisableRowSelectAction] = useState<boolean>(true);

    const handleRowSelect = (rows: RowSelectionState) => {
        setSelectedRows(rows);
    };

    // Initialize rowSelect if it doesn't exist
    if (!table.options) table.options = {};
    Object.assign(table.options, {
        onTableLoad: onTableLoad,
        rowSelect: { onRowSelect: handleRowSelect, enableMultiRowSelect: true, rowId: "id" },
    });

    useEffect(() => {
        if (Object.keys(selectedRows!).length === 0) {
            setDisableRowSelectAction(true);
        } else {
            setDisableRowSelectAction(false);
            onRowSelect(Object.keys(selectedRows));
        }
    }, [selectedRows]);

    return (
        <main>
            <Table id={table.id} data={table.data} columns={table.columns} options={table.options} />
        </main>
    );
};

export default TrackSelectorTable;
