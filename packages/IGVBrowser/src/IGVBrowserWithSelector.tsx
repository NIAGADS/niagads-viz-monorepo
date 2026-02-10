import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";
import React, { useEffect, useState } from "react";
import Table, { TableProps } from "@niagads/table";

import { findTrackConfigs } from "./utils/track_config";
import { handleUpdateBrowserTracks } from "./utils/selector_actions";
import styles from "./styles/TrackSelectorSection.module.css";

export type { TableProps as SelectorTableProps };

export interface IGVBrowserWithSelectorProps extends IGVBrowserProps {
    selectorTable: TableProps;
}

interface IGVBrowserState {
    preloadedTrackIds: string[];
}

type RowSelectionState = Record<string, boolean>;

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

    const handleRowSelect = (rows: RowSelectionState) => {
        setSelectedTracks(Object.keys(rows));
    };

    const initializeBrowser = (b: any, state: IGVBrowserState) => {
        if (b) {
            // setPreloadedTrackIds(state.preloadedTrackIds);
            setBrowser(b);
        }
    };

    useEffect(() => {
        if (browser) {
            setBrowserIsLoading(false);
        }
    }, [browser]);

    const handleRemoveTrackFromBrowser = (removedTracks: string[]) => {
        console.log(removedTracks);
    };

    useEffect(() => {
        if (!browserIsLoading) {
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
                // onTrackRemoved={handleRemoveTrackFromBrowser}
                {...filteredBrowserProps}
            />

            <div className={styles.trackSelectorSection}>
                <div className={styles.trackSelectorSectionTitle}>Select Tracks</div>

                <Table
                    id={selectorTable.id}
                    columns={selectorTable.columns}
                    data={selectorTable.data}
                    options={{
                        // ...(selectorTable.options || {}),
                        // onTableLoad: setTrackSelector,
                        rowSelect: {
                            header: "",
                            onRowSelect: handleRowSelect,
                            enableMultiRowSelect: true,
                            rowId: "id",
                            // ...(preloadedTrackIds ? { selectedValues: preloadedTrackIds } : {}),
                        },
                        disableExport: true,
                        disableColumnFilters: true,
                    }}
                ></Table>
            </div>
        </>
    );
}

//  {...(preloadedTrackIds?.length > 0 ? { preloadedTrackIds } : {})}
/*
 */
