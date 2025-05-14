"use client";
import { useEffect, useState, useRef } from "react";
import { RowSelectionState, selectRowsFn } from "@tanstack/react-table";
import Table, { TableProps } from "@/components/Table/Table";
import { Button } from "@/components/UI/Button";
import { TableWrapperProps } from "./types";
import { renderTooltip } from "@/components/UI";
import { useRouter } from "next/router";

const TRACK_DATA_REDIRECT_ENDPOINT = "/filer/data?";
const GENOME_BROWSER_REDIRECT_ENDPOINT = "/view/igvbrowser/?";

export default function DataAccessTable({
    table,
    endpoint,
    parameters,
}: TableWrapperProps) {
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
    const [disableRowSelectAction, setDisableRowSelectAction] =
        useState<boolean>(true);
    //const router = useRouter()

    const handleGetTrackData = () => {
        const redirectParameters =
            `format=table&loc=${parameters.loc}&track=` +
            Object.keys(selectedRows).join(",");
        const requestUrl = TRACK_DATA_REDIRECT_ENDPOINT + redirectParameters;
        window.open(requestUrl); // will open a new tab
        // router.push(requestUrl) // will open in same tab
    };

    const handleGenomeBrowserView = () => {
        const redirectParameters =
            `locus=${parameters.loc}&tracks=` +
            Object.keys(selectedRows).join(",");
        const requestUrl =
            GENOME_BROWSER_REDIRECT_ENDPOINT + redirectParameters;
        window.open(requestUrl);
    };

    const handleRowSelect = (rows: RowSelectionState) => setSelectedRows(rows);
    Object.assign(table.options!.rowSelect!, { onRowSelect: handleRowSelect });
    // ideally, you shouldn't end up here unless the table has rowSelect options
    // which is why I'm assuming options.rowSelect is not null

    useEffect(() => {
        if (Object.keys(selectedRows!).length === 0) {
            setDisableRowSelectAction(true);
        } else {
            setDisableRowSelectAction(false);
        }
    }, [selectedRows]);

    const renderRowSelectActionButton = (disabled: boolean) => {
        return (
            <div className="flex flex-row gap-2">
                <Button
                    variant="primary"
                    disabled={disabled}
                    onClick={handleGetTrackData}>
                    <span>
                        Get <span className="underline">selected</span> track
                        data in the region {parameters.loc}
                    </span>
                </Button>
                {parameters.assembly === "GRCh38" && (
                    <Button
                        variant="primary"
                        disabled={disabled}
                        onClick={handleGenomeBrowserView}>
                        <span>
                            View <span className="underline">selected</span>{" "}
                            track data on the NIAGADS Genome Browser
                        </span>
                    </Button>
                )}
            </div>
        );
    };

    return (
        <main>
            {disableRowSelectAction == true
                ? renderTooltip(
                      renderRowSelectActionButton(disableRowSelectAction),
                      "Select tracks from the table below"
                  )
                : renderRowSelectActionButton(disableRowSelectAction)}
            <Table
                id={table.id}
                data={table.data}
                columns={table.columns}
                options={table.options}
            />
        </main>
    );
}
