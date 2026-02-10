import Table, { TableProps } from "@niagads/table";
import React, { useEffect, useState } from "react";
import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";

import { Skeleton } from "@niagads/ui";
import styles from "./styles/TrackSelectorSection.module.css";
import { getLoadedTracks, handleUpdateBrowserTracks } from "./utils/browser";
import { findTrackConfigs, resolveTrackIds } from "./utils/track_config";

export type { TableProps as SelectorTableProps };

export interface IGVBrowserWithSelectorProps extends IGVBrowserProps {
    selectorTable: TableProps;
}

type RowSelectionState = Record<string, boolean>;

export default function IGVBrowserWithSelector({
    selectorTable,
    trackConfig,
    ...restBrowserProps
}: IGVBrowserWithSelectorProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [browser, setBrowser] = useState<any>(null);
    const [trackSelector, setTrackSelector] = useState<any>(null);

    const handleRowSelect = (rows: RowSelectionState) => {
        setSelectedTracks(Object.keys(rows));
    };

    const handleTrackRemovedFromBrowser = (trackId: string) => {
        //toggleRowSelected(trackId, false);
        console.log(`Removed track: ${trackId}`);
    };

    useEffect(() => {
        if (browser) {
            const selectedTrackConfigs = findTrackConfigs(trackConfig!, selectedTracks);
            handleUpdateBrowserTracks(browser, selectedTrackConfigs);
        }
    }, [selectedTracks, browser, trackConfig]);

    const { onBrowserLoad, onTrackRemoved, defaultTracks, ...filteredBrowserProps } = restBrowserProps;

    return (
        <>
            <IGVBrowser
                trackConfig={trackConfig}
                onBrowserLoad={setBrowser}
                onTrackRemoved={handleTrackRemovedFromBrowser}
                {...filteredBrowserProps}
            />

            <div className={styles.trackSelectorSection}>
                <div className={styles.trackSelectorSectionTitle}>Select Tracks</div>

                {!browser ? (
                    <Skeleton type="table"></Skeleton>
                ) : (
                    <Table
                        id={selectorTable.id}
                        columns={selectorTable.columns}
                        data={selectorTable.data}
                        options={{
                            ...(selectorTable.options || {}),
                            rowSelect: {
                                header: "",
                                onRowSelect: handleRowSelect,
                                description: "toggle row check box to add/remove the track to/from the Genome Browser",
                                enableMultiRowSelect: true,
                                rowId: "id",
                                ...(defaultTracks ? { selectedValues: resolveTrackIds(defaultTracks) } : {}),
                            },
                            disableExport: true,
                            disableColumnFilters: true,
                        }}
                    ></Table>
                )}
            </div>
        </>
    );
}
