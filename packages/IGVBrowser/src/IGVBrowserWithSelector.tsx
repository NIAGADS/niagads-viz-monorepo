import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";
import React, { useEffect, useState } from "react";
import TrackSelectorTable, { TableProps, handleLoadTracks, handleUnloadTracks } from "./TrackSelectorTable";

import type { IGVBrowserTrack } from "./types/data_models";
import { getLoadedTracks } from "./tracks/utils";

interface IGVBrowserWithSelectorProps extends Partial<IGVBrowserProps> {
    selectorTable?: TableProps;
    referenceTracks?: IGVBrowserTrack[];
}

type FileTrackConfig = Partial<IGVBrowserTrack>;

export type { IGVBrowserWithSelectorProps };

export default function IGVBrowserWithSelector({
    selectorTable,
    trackConfig,
    ...restBrowserProps
}: IGVBrowserWithSelectorProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [browser, setBrowser] = useState<any>(null);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [trackSelector, setTrackSelector] = useState<string[] | null>(null);

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
            handleLoadTracks(selectedTracks, loadedTracks, trackConfig!, browser);
            handleUnloadTracks(selectedTracks, loadedTracks, trackConfig!, browser);
            // TODO - handle removal of tracks from genome browser->trackselectorstate w/toggleTrackSelection()
            // note that handle load/unload return a list of ids that can be used to pass to toggleTrackSelection
        }
    }, [selectedTracks, loading, browser, trackConfig]);

    const { onBrowserLoad, onTrackRemoved, onTrackAdded, ...filteredBrowserProps } = restBrowserProps;
    return (
        <>
            <IGVBrowser
                trackConfig={trackConfig}
                onBrowserLoad={initializeBrowser}
                onTrackRemoved={toggleTrack}
                onTrackAdded={toggleTrack}
                {...filteredBrowserProps}
            />

            {selectorTable && (
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
                    <TrackSelectorTable
                        table={selectorTable}
                        onRowSelect={toggleTrack}
                        onTableLoad={setTrackSelector}
                    />
                </div>
            )}
        </>
    );
}
