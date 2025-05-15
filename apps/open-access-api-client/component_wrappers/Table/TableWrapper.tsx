'use client'
import Table, { TableProps } from "@/components/Table/Table";
import { Alert } from "@/components/UI/Alert";
import { getRowSelectAction } from "@/validators/table";
import DataAccessTable from "./DataAccessTable";
import { TableWrapperProps } from "./types";
import GenomeBrowserTrackTable from "./GenomeBrowserTrackTable";
import LocusZoomTable from "./LocusZoomTable";

// 'ACCESS_ROW_DATA' |  'UPDATE_GENOME_BROWSER' | 'UPDATE_LOCUS_ZOOM'

export default function TableWrapper({ table, endpoint, parameters }:  TableWrapperProps) {
    // FIXME: make sure column filters are disbled until implemented
    table.options && (table.options.disableColumnFilters = true);

    const rowSelectAction = table.options?.rowSelect
        ? getRowSelectAction(table.options.rowSelect)
        : null

    const renderTable = () => {
        switch(rowSelectAction) {
            case 'ACCESS_ROW_DATA':
                return <DataAccessTable table={table} endpoint={endpoint} parameters={parameters}/>
            case 'UPDATE_GENOME_BROWSER':
                return <GenomeBrowserTrackTable table={table} endpoint={endpoint} parameters={parameters}/>
            case 'UPDATE_LOCUS_ZOOM':
                return <LocusZoomTable table={table} endpoint={endpoint} parameters={parameters}/>
            default:
                return <Table id={table.id} data={table.data} columns={table.columns} options={table.options}/>
        }
    }

    return (
        <main>
            <>
            {/*<Alert message="table wrapper"/>*/}
            {renderTable()}
            </>
        </main>
    )
}
