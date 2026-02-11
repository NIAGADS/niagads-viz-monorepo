import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";
import React, { useEffect, useState } from "react";
import Table, { TableProps } from "@niagads/table";
import { findTrackConfigs, resolveTrackIds } from "./utils/track_config";

import { Skeleton } from "@niagads/ui";
import { handleUpdateBrowserTracks } from "./utils/browser";
import styles from "./styles/TrackSelectorSection.module.css";

export type { TableProps as SelectorTableProps };

export interface IGVBrowserWithSelectorProps extends IGVBrowserProps {
    selectorTable: TableProps;
}

export default function IGVBrowserWithSelector({
    selectorTable,
    trackConfig,
    defaultTracks,
    ...restBrowserProps
}: IGVBrowserWithSelectorProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>(defaultTracks ? resolveTrackIds(defaultTracks) : []);
    const [browser, setBrowser] = useState<any>(null);

    const handleTrackRemovedFromBrowser = (trackId: string) => {
        setSelectedTracks((tracks) => tracks.filter((id) => id !== trackId));
    };

    useEffect(() => {
        if (browser) {
            const selectedTrackConfigs = findTrackConfigs(trackConfig!, selectedTracks);
            handleUpdateBrowserTracks(browser, selectedTrackConfigs);
        }
    }, [selectedTracks, browser, trackConfig]);

    const handleTrackSelectionChange = (state: any) => {
        console.log(state);
        setSelectedTracks(Object.keys(state));
    };

    const { onBrowserLoad, onTrackRemoved, ...filteredBrowserProps } = restBrowserProps;
    console.log(selectedTracks);
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
                        rowSelection={selectedTracks}
                        onRowSelectionChange={handleTrackSelectionChange}
                        options={{
                            ...(selectorTable.options || {}),
                            enableRowSelect: true,
                            rowSelectColumn: {
                                header: "",
                                description: "toggle row check box to add/remove the track to/from the Genome Browser",
                                enableMultiSelect: true,
                                rowUniqueKey: "id",
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
