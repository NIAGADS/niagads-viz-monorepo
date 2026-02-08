import { getLoadedTracks, loadTracks, removeTrackById } from "./browser";

import { IGVBrowserTrack } from "../types/data_models";

type SELECTOR_ACTION = "ADD" | "REMOVE";

/**
 * Toggles the selection state of tracks in a track selector instance.
 *
 * @param selector - The track selector table instance with data and toggleRowSelected method.
 * @param action - "add" to select tracks, "remove" to deselect tracks.
 * @param trackIds - Array of track IDs to add or remove from selection.
 *
 * If action is "add", selects the row if found.
 * If action is "remove", deselects the row for each specified track ID.
 * @example
 * Used to update selector when user removes tracks from the browser or when tracks are added
 * via a URL or saved session to select rows in the selector table to match
 */
export async function toggleTrackSelection(selector: any, action: SELECTOR_ACTION, trackIds: string[]) {
    switch (action) {
        case "ADD": {
            // need to validate tracks before trying to add
            const invalidTracks: string[] = [];
            for (const id of trackIds) {
                if (selector.data.some((row: any) => row.row_id === id)) {
                    selector.toggleRowSelected(id, true);
                } else {
                    invalidTracks.push(id);
                }
            }
            if (invalidTracks.length > 0) {
                alert(
                    `Invalid track identifier(s): ${invalidTracks.toString()} specified in URL string or session file.\n` +
                        `NOTE: track identifiers are CASE SENSITIVE.`
                );
            }
            break;
        }
        case "REMOVE": {
            for (const id of trackIds) {
                selector.toggleRowSelected(id, false);
            }
            break;
        }
        default:
            throw new Error(`Unknown track selector action: ${action}`);
    }
}

/**
 * Adds or removes tracks in the IGV browser based on the action provided.
 *
 * @param browser - IGV browser instance.
 * @param action - Either "ADD" or "REMOVE" to specify the operation.
 * @param selectedTrackConfigs - Array of IGVBrowserTrack objects representing the desired tracks to be loaded.
 * @returns Promise resolving to an array of track IDs that were added or removed.
 *
 * @example
 * // In a React component effect:
 * useEffect(() => {
 *   if (!loading && browser) {
 *     selectedTrackConfigs = findTrackConfigs(trackConfig, selectedTracks)
 *     handleUpdateBrowserTracks(browser, action, selectedTrackConfigs)
 *   }
 * }, [action, selectedTracks, loading, browser]);
 */
export async function handleUpdateBrowserTracks(browser: any, selectedTrackConfigs: IGVBrowserTrack[]) {
    const loadedTrackIds = getLoadedTracks(browser, browser.config.alwaysOnTracks);
    await handleAddTracksToBrowser(browser, selectedTrackConfigs, loadedTrackIds);
    await handleRemoveTracksFromBrowser(browser, selectedTrackConfigs, loadedTrackIds);
}

/**
 * Loads selected tracks into the IGV browser that are not already loaded.
 *
 * @param browser - IGV browser instance.
 * @param selectedTrackConfigs - Array of IGVBrowserTrack objects to be loaded.
 * @param loadedTrackIds - Array of track IDs currently loaded in the browser.
 * @returns Promise resolving to an array of newly added track IDs.
 */
export async function handleAddTracksToBrowser(
    browser: any,
    selectedTrackConfigs: IGVBrowserTrack[],
    loadedTrackIds: string[]
): Promise<string[]> {
    const tracksToAdd = selectedTrackConfigs.filter((track: IGVBrowserTrack) => !loadedTrackIds.includes(track.id));
    if (tracksToAdd.length > 0) {
        await loadTracks(browser, tracksToAdd);
        return tracksToAdd.map((track) => track.id);
    }
    return [];
}

/**
 * Removes tracks from the IGV browser that are no longer selected.
 *
 * @param browser - IGV browser instance.
 * @param selectedTrackConfigs - Array of IGVBrowserTrack objects that should remain loaded.
 * @param loadedTrackIds - Array of track IDs currently loaded in the browser.
 * @returns Promise resolving to an array of removed track IDs.
 */
export async function handleRemoveTracksFromBrowser(
    browser: any,
    selectedTrackConfigs: IGVBrowserTrack[],
    loadedTrackIds: string[]
): Promise<string[]> {
    const tracksToRemove = loadedTrackIds.filter(
        (id: string) => !selectedTrackConfigs.some((track) => track.id === id)
    );

    for (const trackId of tracksToRemove) {
        removeTrackById(browser, trackId);
    }

    return tracksToRemove;
}
