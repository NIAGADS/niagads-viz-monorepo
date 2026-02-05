"use client";

import {
    IGVBrowser,
    IGVBrowserTrack,
    TableProps,
    TrackSelectorTable,
    VariantReferenceTrack,
    getLoadedTracks,
    handleLoadTracks,
    handleUnloadTracks,
} from "@niagads/igv";
import { useEffect, useState } from "react";

interface IGVBrowserWrapperProps {
    config: IGVBrowserTrack[];
    inclVariantReference: boolean;
    table?: TableProps;
    searchParams?: Record<string, string | string[]>;
}

export default function IGVBrowserWrapper({
    config,
    inclVariantReference,
    table,
    searchParams,
}: IGVBrowserWrapperProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [browser, setBrowser] = useState<any>(null);
    const [loading, setIsLoading] = useState<boolean>(true);
    const tracks = inclVariantReference ? [VariantReferenceTrack] : undefined;
    // initialize browser state
    const initializeBrowser = (b: any) => {
        b && setBrowser(b);
    };

    useEffect(() => {
        if (browser) {
            setIsLoading(false);
        }
    }, [browser]);

    // toggle tracks
    const toggleTrack = (rowSelection: string[]) => {
        setSelectedTracks(rowSelection);
    };

    useEffect(() => {
        if (!loading && browser) {
            const loadedTracks = getLoadedTracks(browser);
            handleLoadTracks(selectedTracks, loadedTracks, config, browser);
            handleUnloadTracks(selectedTracks, loadedTracks, config, browser);
        }
    }, [selectedTracks, loading, browser, config]);
    return (
        <>
            <IGVBrowser
                genome={"GRCh38"}
                searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}
                tracks={tracks}
                onBrowserLoad={initializeBrowser}
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
                    <TrackSelectorTable table={table} handleRowSelect={toggleTrack} />
                </div>
            )}
        </>
    );
}
