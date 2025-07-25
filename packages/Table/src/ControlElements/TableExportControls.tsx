import { Button, Checkbox, Select } from "@niagads/ui";
import React, { useEffect, useId, useState } from "react";

import { ActionMenu } from "@niagads/ui/client";
import { Download } from "lucide-react";
import { Table as ReactTable } from "@tanstack/react-table";
import exportFromJSON from "export-from-json";
import styles from "../styles/controls.module.css";

const EXPORT_FILE_FORMATS = Object.keys(exportFromJSON.types).filter((f) => !["css", "html"].includes(f));
type FileFormat = Exclude<keyof typeof exportFromJSON.types, "css" | "html">;

export const exportTable = (table: ReactTable<any>, tableId: string, filteredRowsOnly: boolean, format: FileFormat) => {
    const isFiltered: boolean =
        table.getState().globalFilter !==
        ""; /* && table.getState().columnFilters ? -> array so not sure what to test yet */
    const columnIds: string[] = table
        .getVisibleFlatColumns()
        .filter((col) => col.id != "select-col")
        .map((col) => col.id);
    const rows = isFiltered
        ? filteredRowsOnly
            ? table.getSortedRowModel().rows
            : table.getPreFilteredRowModel().rows
        : table.getSortedRowModel().rows;

    /*  NOTE: Row models are applied as follows:
        getCoreRowModel -> getFilteredRowModel -> getGroupedRowModel 
            -> getSortedRowModel -> getExpandedRowModel -> getPaginationRowModel -> getRowModel
        so, SortedRowModel will be filtered, but filtered is not sorted (so pre-filtered is not sorted either);
        i.e. if a filter is applied, it is not possible to get a pre-filtered, sorted list of rows from ReactTables
    */

    const exportData: any = rows.map((r) => Object.fromEntries(columnIds.map((colId) => [colId, r.getValue(colId)])));

    exportFromJSON({
        data: exportData,
        fileName: tableId,
        withBOM: true,
        extension: format,
        delimiter: format == "txt" ? "\t" : ",",
        exportType: format == "txt" ? "csv" : format,
    });
};

interface ExportMenuOptions {
    onSubmit?: any;
    isFiltered: boolean;
}

// working from https://www.creative-tim.com/twcomponents/component/pure-css-dropdown-using-focus-within
// idea to create a drop down menu w/select which data and which format

export const TableExportControls = ({ isFiltered, onSubmit }: ExportMenuOptions) => {
    const [filteredOnly, setFilteredOnly] = useState<boolean>(isFiltered);
    const formId = useId();

    const x: FileFormat = "csv";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit(Object.fromEntries(formData));
    };

    useEffect(() => {
        setFilteredOnly(isFiltered);
    }, [isFiltered]);

    return (
        <ActionMenu label={"Export"} icon={Download} buttonColor="primary">
            <div className={styles["export-control-container"]}>
                {" "}
                <form id={formId} onSubmit={handleSubmit} className={styles["export-control-form"]}>
                    {isFiltered && (
                        <Checkbox
                            name="filtered_only"
                            variant="accent"
                            value={filteredOnly.toString()}
                            label="Filtered Rows Only"
                            checked={filteredOnly}
                            onChange={() => setFilteredOnly(!filteredOnly)}
                        ></Checkbox>
                    )}

                    <Select
                        id={`${formId}_select_export_format"`}
                        name="format"
                        fields={EXPORT_FILE_FORMATS}
                        label="Format"
                        inline={true}
                    ></Select>

                    <Button color="primary" className={styles["export-control-button"]}>
                        Export
                    </Button>
                </form>
            </div>
        </ActionMenu>
    );
};
