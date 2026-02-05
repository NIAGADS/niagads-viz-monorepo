"use client";

import { IGVBrowser, IGVBrowserTrack, TableProps, TrackSelectorTable, VariantReferenceTrack } from "@niagads/igv";

interface IGVBrowserWrapperProps {
    config: IGVBrowserTrack[];
    inclVariantReference: boolean;
    table?: TableProps;
}

export default function IGVBrowserWrapper({ config, inclVariantReference, table }: IGVBrowserWrapperProps) {
    const tracks = inclVariantReference ? [VariantReferenceTrack] : undefined;

    return (
        <>
            <IGVBrowser
                genome={"GRCh38"}
                searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}
                tracks={tracks}
            />

            {table && (
                <div style={{ marginTop: "4rem" }}>
                    <div
                        style={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            marginBottom: "0.75rem",
                            background: "#f1f5f9",
                            padding: "0.75rem 1.25rem",
                            borderRadius: 8,
                            boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.04)",
                            border: "1px solid #e2e8f0",
                            color: "#1e293b",
                            letterSpacing: "0.2px",
                            width: "100%",
                            textAlign: "left",
                            display: "block",
                        }}
                    >
                        Select Tracks
                    </div>
                    <TrackSelectorTable table={table} handleRowSelect={undefined} />
                </div>
            )}
        </>
    );
}
