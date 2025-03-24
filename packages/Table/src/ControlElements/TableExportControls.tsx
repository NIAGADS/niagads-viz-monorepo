import React, { useState, useEffect, useId } from "react"
import { Table as ReactTable } from "@tanstack/react-table"
import exportFromJSON from "export-from-json"

import { Button, Checkbox, Select, Tooltip } from "@bug_sam/ui"
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"
import { FileFormat, EXPORT_FILE_FORMATS } from "@bug_sam/common"

export const exportTable = (table: ReactTable<any>, tableId: string, filteredRowsOnly: boolean, format: FileFormat) => {
    const isFiltered: boolean = table.getState().globalFilter !== '' /* && table.getState().columnFilters ? -> array so not sure what to test yet */
    const columnIds: string[] = table.getVisibleFlatColumns().filter(col => col.id != 'select-col').map((col) => col.id)
    const rows = isFiltered ? (filteredRowsOnly ? table.getSortedRowModel().rows : table.getPreFilteredRowModel().rows)
        : table.getSortedRowModel().rows

    /*  NOTE: Row models are applied as follows:
        getCoreRowModel -> getFilteredRowModel -> getGroupedRowModel 
            -> getSortedRowModel -> getExpandedRowModel -> getPaginationRowModel -> getRowModel
        so, SortedRowModel will be filtered, but filtered is not sorted (so pre-filtered is not sorted either);
        i.e. if a filter is applied, it is not possible to get a pre-filtered, sorted list of rows from ReactTables
    */

    const exportData: any = rows.map(r => (
        Object.fromEntries(columnIds.map(colId => [colId, r.getValue(colId)])
        )))

    exportFromJSON({
        data: exportData,
        fileName: tableId,
        withBOM: true,
        extension: format,
        delimiter: format == 'txt' ? '\t' : ',',
        exportType: format == 'txt' ? 'csv' : format
    })
}


interface ExportMenuOptions {
    onSubmit?: any
    isFiltered: boolean
}

// working from https://www.creative-tim.com/twcomponents/component/pure-css-dropdown-using-focus-within
// idea to create a drop down menu w/select which data and which format

export const TableExportControls = ({ isFiltered, onSubmit }: ExportMenuOptions) => {
    const [filteredOnly, setFilteredOnly] = useState<boolean>(isFiltered);
    const formId = useId()

    const x: FileFormat = 'csv'

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit(Object.fromEntries(formData))
    };

    useEffect(() => {
        setFilteredOnly(isFiltered)
    }, [isFiltered])

    return (
        <div className="relative inline-block text-left dropdown">

            <Button variant="white">
                <ArrowDownTrayIcon className="icon-button"></ArrowDownTrayIcon>
                <span className="ml-2 uppercase">Export</span>
            </Button>


            <div className="hidden dropdown-menu">
                <div className="z-50 absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby={`${formId}-headlessui-menu-button}`} id={`${formId}-headlessui-menu-items`} role="menu">
                    <div className="px-4 py-3">
                        <form id={formId} onSubmit={handleSubmit}>
                            {isFiltered &&
                                <Checkbox name='filtered_only' variant="accent"
                                    value={filteredOnly.toString()}
                                    label="Filtered Rows Only" checked={filteredOnly}
                                    onChange={() => setFilteredOnly(!filteredOnly)}></Checkbox>
                            }

                            <Select id={`${formId}_select_export_format"`}
                                name="format"
                                fields={EXPORT_FILE_FORMATS}
                                label="Export table data as"></Select>

                            <div className="mt-2 flex justify-center">
                                <Button size="md">Export</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}