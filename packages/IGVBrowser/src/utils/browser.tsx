import { ALWAYS_ON_TRACKS } from "../config/_constants";
import { IGVBrowserTrack } from "../types/data_models";
import { getViewTrackIdentifier } from "./views";
import { resolveServiceTrackReader } from "./track_config";

/**
 * Returns the list of loaded track IDs in the browser, excluding always-on tracks.
 * @param browser IGV browser instance.
 * @param alwaysOnTracks Array of track IDs that should always be excluded (default: ALWAYS_ON_TRACKS).
 * @returns Array of loaded track IDs (excluding always-on tracks).
 */
export const getLoadedTracks = (browser: any, alwaysOnTracks: string[] = ALWAYS_ON_TRACKS): string[] =>
    (browser?.trackViews ?? [])
        .map((view: any) => getViewTrackIdentifier(view))
        .filter((track: string) => !alwaysOnTracks.includes(track));

/**
 * Checks if a specific track is loaded in the browser.
 * @param browser IGV browser instance.
 * @param config Track configuration object.
 * @returns True if the track is loaded, false otherwise.
 */
export const trackIsLoaded = (browser: any, config: IGVBrowserTrack) =>
    getLoadedTracks(browser, []).includes(config.id);

/**
 * Removes a track from the browser by its ID. Finds by ID to avoid duplicate names.
 *  from https://github.com/igvteam/igv.js/blob/0dfb1f7b02d9660ff1ef0169899c4711496158e8/js/browser.js#L1104
 * @param browser IGV browser instance.
 * @param trackId ID of the track to remove.
 */
export const removeTrackById = (browser: any, trackId: string) => {
    const trackViews = browser?.trackViews ?? [];
    const trackView = trackViews.filter((view: any) => getViewTrackIdentifier(view) === trackId);
    browser.removeTrack(trackView[0].track);
};

/**
 * Loads a single track into the IGV browser, handling special formats and service types.
 * Dynamically imports decoders/readers as needed based on track properties.
 * @param browser IGV browser instance.
 * @param track Track configuration object to load.
 */
export const loadTrack = async (browser: any, track: IGVBrowserTrack) => {
    if ("format" in track) {
        // does it match bedX+Y?
        if (track.format.match("^bed\\d{1,2}\\+\\d+$") != null) {
            const { default: decodeBedXY } = await import("../decoders/bedDecoder");
            track.decode = decodeBedXY;
        }
    }
    if (track.url.includes("$CHR")) {
        const { default: ShardedBedReader } = await import("../readers/ShardedBedReader");
        track.reader = new ShardedBedReader(track, browser.genome);
    }
    if (track.type.includes("_service")) {
        track.reader = await resolveServiceTrackReader(
            {
                endpoint: track.url,
                track: track.id,
            },
            track.type
        );
    }

    await browser.loadTrack(track);
};

/**
 * Loads multiple tracks into the IGV browser asynchronously.
 * @param browser IGV browser instance.
 * @param tracks Array of track configuration objects to load.
 */
export const loadTracks = async (browser: any, tracks: IGVBrowserTrack[]) => {
    for await (const _ of tracks.map((t) => loadTrack(browser, t)));
};

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
