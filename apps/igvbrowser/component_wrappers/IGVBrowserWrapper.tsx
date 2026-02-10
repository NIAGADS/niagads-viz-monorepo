"use client";

import { IGVBrowser, IGVBrowserWithSelector, VariantReferenceTrack } from "@niagads/igv";

import Table from "@niagads/table";

interface IGVBrowserWrapperProps {
    trackConfig: any;
    selectorTable?: any;
    inclVariantReference: boolean;
    queryParams?: any;
}

export default function IGVBrowserWrapper({
    trackConfig,
    selectorTable,
    inclVariantReference,
    queryParams,
}: IGVBrowserWrapperProps) {
    const referenceTracks = inclVariantReference ? [VariantReferenceTrack] : undefined;
    const handleRowSelect = (rows: any) => {
        alert(rows);
    };
    return (
        <>
            <IGVBrowserWithSelector
                trackConfig={trackConfig}
                selectorTable={selectorTable}
                referenceTracks={referenceTracks}
                genome={"GRCh38"}
                searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}
            />
            <Table
                id={selectorTable.id}
                columns={selectorTable.columns}
                data={selectorTable.data}
                options={{
                    ...(selectorTable.options || {}),
                    // onTableLoad: setTrackSelector,
                    rowSelect: {
                        header: "Select",
                        onRowSelect: handleRowSelect,
                        enableMultiRowSelect: true,
                        rowId: "id",
                        // ...(preloadedTrackIds ? { selectedValues: preloadedTrackIds } : {}),
                    },
                    disableExport: true,
                    disableColumnFilters: true,
                }}
            ></Table>
        </>
    );
}
