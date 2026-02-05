import { useEffect, useState } from "react";

import React from "react";
import Table, { type TableProps } from "@niagads/table";
import type { IGVBrowserTrack } from "./types/data_models";
import { getTrackConfig, loadTracks, removeTrackById } from "./tracks/utils";

export type RowSelectionState = Record<string, boolean>;
export type { TableProps };

/**
 * Load selected tracks into the browser
 *
 * @param selectedTracks - Array of track IDs that should be loaded
 * @param loadedTracks - Array of track IDs currently loaded in the browser
 * @param config - Track configuration array
 * @param browser - IGV browser instance
 * @returns Promise resolving to array of newly added track IDs
 *
 * @example
 * // In a component effect:
 * useEffect(() => {
 *   if (!loading && browser) {
 *     const loadedTracks = getLoadedTracks(browser);
 *     handleLoadTracks(selectedTracks, loadedTracks, config, browser);
 *   }
 * }, [selectedTracks, loading, browser, config]);
 */
export async function handleLoadTracks(
    selectedTracks: string[],
    loadedTracks: string[],
    config: IGVBrowserTrack[],
    browser: any
): Promise<string[]> {
    const addedTrackIds: string[] = [];
    const tracksToAdd = selectedTracks.filter((id: string) => !loadedTracks.includes(id));
    if (tracksToAdd.length > 0) {
        await loadTracks(getTrackConfig(tracksToAdd, config), browser);
        addedTrackIds.push(...tracksToAdd);
    }
    return addedTrackIds;
}

/**
 * Remove unselected tracks from the browser
 *
 * @param selectedTracks - Array of track IDs that should remain loaded
 * @param loadedTracks - Array of track IDs currently loaded in the browser
 * @param config - Track configuration array
 * @param browser - IGV browser instance
 * @returns Promise resolving to array of removed track IDs
 *
 * @example
 * // In a component effect:
 * useEffect(() => {
 *   if (!loading && browser) {
 *     const loadedTracks = getLoadedTracks(browser);
 *     handleUnloadTracks(selectedTracks, loadedTracks, config, browser);
 *   }
 * }, [selectedTracks, loading, browser, config]);
 */
export async function handleUnloadTracks(
    selectedTracks: string[],
    loadedTracks: string[],
    config: IGVBrowserTrack[],
    browser: any
): Promise<string[]> {
    const removedTrackIds: string[] = [];
    const removedTracks = loadedTracks.filter((track) => !selectedTracks.includes(track));
    removedTracks.forEach((trackKey: string) => {
        config
            .filter((track: any) => track.id === trackKey)
            .forEach((track: any) => {
                removeTrackById(track.id, browser);
                removedTrackIds.push(track.id);
            });
    });
    return removedTrackIds;
}

interface TrackSelectorTableProps {
    table: TableProps;
    handleRowSelect: any;
    onTableLoad?: any;
}

const TrackSelectorTable = ({ table, handleRowSelect }: TrackSelectorTableProps) => {
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
    const [disableRowSelectAction, setDisableRowSelectAction] = useState<boolean>(true);

    const onRowSelect = (rows: RowSelectionState) => {
        setSelectedRows(rows);
    };

    // Initialize rowSelect if it doesn't exist
    if (!table.options) table.options = {};
    Object.assign(table.options, { rowSelect: { onRowSelect: onRowSelect, enableMultiRowSelect: true, rowId: "id" } });

    useEffect(() => {
        if (Object.keys(selectedRows!).length === 0) {
            setDisableRowSelectAction(true);
        } else {
            setDisableRowSelectAction(false);
            handleRowSelect(Object.keys(selectedRows));
        }
    }, [selectedRows]);

    return (
        <main>
            <Table id={table.id} data={table.data} columns={table.columns} options={table.options} />
        </main>
    );
};

export default TrackSelectorTable;
