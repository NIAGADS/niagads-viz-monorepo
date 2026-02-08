import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";
import React, { Suspense, useEffect, useState } from "react";
import TrackSelectorTable, { TableProps } from "./TrackSelectorTable";

import type { IGVBrowserTrack } from "./types/data_models";
import { Skeleton } from "@niagads/ui";
import { findTrackConfigs } from "./utils/track_config";
import { getLoadedTracks } from "./utils/browser";
import { handleUpdateBrowserTracks } from "./utils/selector_actions";
import styles from "./styles/TrackSelectorSection.module.css";

interface IGVBrowserWithSelectorProps extends IGVBrowserProps {
    selectorTable?: TableProps;
    referenceTracks?: IGVBrowserTrack[];
}

interface IGVBrowserState {
    preloadedTrackIds: string[];
}

export type { IGVBrowserWithSelectorProps };

export default function IGVBrowserWithSelector({
    selectorTable,
    trackConfig,
    ...restBrowserProps
}: IGVBrowserWithSelectorProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [browser, setBrowser] = useState<any>(null);
    const [browserIsLoading, setBrowserIsLoading] = useState<boolean>(true);
    const [trackSelector, setTrackSelector] = useState<string[] | null>(null);
    const [preloadedTrackIds, setPreloadedTrackIds] = useState<string[]>([]);

    const initializeBrowser = (b: any, state: IGVBrowserState) => {
        if (b) {
            setPreloadedTrackIds(state.preloadedTrackIds);
            setBrowser(b);
        }
    };

    useEffect(() => {
        if (browser) {
            console.log(preloadedTrackIds);
            setBrowserIsLoading(false);
        }
    }, [browser]);

    // toggle tracks
    const toggleTrack = (rowSelection: string[]) => {
        setSelectedTracks(rowSelection);
    };

    const handleRemoveTrackFromBrowser = (removedTracks: string[]) => {
        console.log(removedTracks);
    };

    useEffect(() => {
        if (!browserIsLoading) {
            const loadedTracks = getLoadedTracks(browser, browser.config.alwaysOnTracks);
            const selectedTrackConfigs = findTrackConfigs(trackConfig!, selectedTracks);
            handleUpdateBrowserTracks(browser, selectedTrackConfigs);

            // TODO - handle removal of tracks from genome browser->trackselectorstate w/toggleTrackSelection()
            // note that handle load/unload return a list of ids that can be used to pass to toggleTrackSelection
        }
    }, [selectedTracks, browserIsLoading, browser, trackConfig]);

    const { onBrowserLoad, onTrackRemoved, onTrackAdded, ...filteredBrowserProps } = restBrowserProps;

    return (
        <>
            <IGVBrowser
                trackConfig={trackConfig}
                onBrowserLoad={initializeBrowser}
                onTrackRemoved={handleRemoveTrackFromBrowser}
                {...filteredBrowserProps}
            />

            <div className={styles.trackSelectorSection}>
                <div className={styles.trackSelectorSectionTitle}>Select Tracks</div>
                {browserIsLoading || !selectorTable?.data ? (
                    <Skeleton type="table"></Skeleton>
                ) : (
                    <TrackSelectorTable
                        table={selectorTable!}
                        onRowSelect={toggleTrack}
                        onTableLoad={setTrackSelector}
                        onTrackRemoved={handleRemoveTrackFromBrowser}
                        {...(preloadedTrackIds?.length > 0 ? { preloadedTrackIds } : {})}
                    />
                )}
            </div>
        </>
    );
}
