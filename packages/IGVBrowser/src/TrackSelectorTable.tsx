import React, { useEffect, useState } from "react";
import Table, { type TableProps } from "@niagads/table";

export type RowSelectionState = Record<string, boolean>;
export type { TableProps };

interface TrackSelectorTableProps {
    /** Table configuration and data. */
    table: TableProps;
    /** Track IDs that should be pre-selected in the table. */
    preloadedTrackIds?: string[];
    /** Callback fired when rows are selected. */
    onRowSelect: any;
    /** Callback fired when the table is loaded. */
    onTableLoad: any;
    /** Callback fired when tracks are removed from the browser, to keep the table in sync. */
    onTrackRemoved: (trackIds: string[]) => void;
}

const TrackSelectorTable = ({ table, preloadedTrackIds, onRowSelect, onTableLoad }: TrackSelectorTableProps) => {
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
    const [disableRowSelectAction, setDisableRowSelectAction] = useState<boolean>(true);

    const handleRowSelect = (rows: RowSelectionState) => {
        setSelectedRows(rows);
    };

    // Initialize rowSelect if it doesn't exist
    if (!table.options) table.options = {};
    Object.assign(table.options, {
        onTableLoad: onTableLoad,
        rowSelect: {
            onRowSelect: handleRowSelect,
            enableMultiRowSelect: true,
            rowId: "id",
            ...(preloadedTrackIds ? { selectedValues: preloadedTrackIds } : {}),
        },
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
