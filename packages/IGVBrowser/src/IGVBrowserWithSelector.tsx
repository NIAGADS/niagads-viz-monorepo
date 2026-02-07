import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";
import React, { useEffect, useState } from "react";
import TrackSelectorTable, { TableProps } from "./TrackSelectorTable";

import type { IGVBrowserTrack } from "./types/data_models";
import { findTrackConfigs } from "./utils/track_config";
import { getLoadedTracks } from "./utils/browser";
import { handleUpdateBrowserTracks } from "./utils/selector_actions";
import styles from "./styles/TrackSelectorSection.module.css";

interface IGVBrowserWithSelectorProps extends IGVBrowserProps {
    selectorTable?: TableProps;
    referenceTracks?: IGVBrowserTrack[];
}

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
    const initializeBrowser = (b: any, state: any) => {
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
            const loadedTracks = getLoadedTracks(browser, browser.config.alwaysOnTracks);
            const selectedTrackConfigs = findTrackConfigs(trackConfig!, selectedTracks);
            handleUpdateBrowserTracks(browser, selectedTrackConfigs);

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
                {...filteredBrowserProps}
            />

            {selectorTable && (
                <div className={styles.trackSelectorSection}>
                    <div className={styles.trackSelectorSectionTitle}>Select Tracks</div>
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
