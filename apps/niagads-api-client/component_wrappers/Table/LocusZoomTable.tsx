'use client'
import Table, { TableProps } from "@/components/Table/Table";
import { Alert } from "@/components/UI/Alert";
import { Button } from "@/components/UI/Button";
import { TableWrapperProps } from "./types";

export default function LocusZoomTable({ table, endpoint, parameters }:  TableWrapperProps) {
    if (table.options?.rowSelect) {
        const rowSelectAction = table.options.rowSelect.onRowSelectAction
        if (!rowSelectAction) {
            // FIXME: make error alert component w/url etc
            return <Alert variant="danger" message="InternalServerError">
                <div>
                    <p>Please report this error to our GitHub Issue Tracker</p>
                </div>
            </Alert>
        }
        else {
            //HERE
            //table.options.onRowSelect = resolveRowSelectionAction(rowSelectAction)
        }
    }

    table.options && (table.options.disableColumnFilters = true);

    return (
        <main>
            
            {table.options?.rowSelect && <Button variant="secondary">Fetch Data</Button>}
            <Table
                id={table.id}
                data={table.data}
                columns={table.columns}
                options={table.options}
            />
        </main>
    )
}
