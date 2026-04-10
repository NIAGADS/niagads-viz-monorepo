import { IGVBrowserTrack } from "../types/data_models";

/**
 * Filters IGVBrowserTrack configs to include only those whose id is in trackIds.
 * @param config Array of IGVBrowserTrack objects.
 * @param trackIds Array of track IDs to filter by.
 * @returns Array of IGVBrowserTrack objects matching the given IDs.
 */
export const findTrackConfigs = (config: IGVBrowserTrack[], trackIds: string[]) =>
    config.filter((c) => trackIds.includes(c.id));

/**
 * Dynamically imports and instantiates a service track reader based on trackType.
 * Handles window reference errors from igv.js by using dynamic import.
 * @param config Configuration object for the reader.
 * @param trackType Type of track reader to resolve (e.g., 'gwas_service', 'variant_service').
 * @returns Instance of the resolved reader, or null if trackType is unsupported.
 */
export const resolveServiceTrackReader = async (config: any, trackType: string) => {
    // this dynamic importing allows us to deal with the `window does not exist` reference error from igv.js

    switch (trackType) {
        case "gwas_service":
            const { default: GWASServiceReader } = await import("../readers/GWASServiceReader");
            return new GWASServiceReader(config);
        case "variant_service":
            const { default: VariantServiceReader } = await import("../readers/VariantServiceReader");
            return new VariantServiceReader(config);
        default:
            return null;
    }
};

/**
 * Resolves an array of track IDs or track objects to an array of IGVBrowserTrack objects.
 * If given track IDs, filters the config array to match those IDs.
 * If given track objects, returns them directly.
 * @param tracks Array of track IDs (string[]) or IGVBrowserTrack objects.
 * @param config Array of IGVBrowserTrack objects to filter from.
 * @returns Array of IGVBrowserTrack objects.
 */
export function resolveTrackConfigs(
    config: IGVBrowserTrack[] | undefined,
    tracks: string[] | IGVBrowserTrack[]
): IGVBrowserTrack[] {
    if (typeof tracks[0] === "string") {
        if (!config) {
            throw new Error("resolveTrackConfigs: config must be provided when tracks is a string[]");
        }
        return findTrackConfigs(config, tracks as string[]);
    }
    return tracks as IGVBrowserTrack[];
}

/**
 * Resolves an array of track IDs or track objects to an array of track IDs (string[]).
 * If given track IDs, returns them directly.
 * If given track objects, extract the IDs.
 * @param tracks Array of track IDs (string[]) or IGVBrowserTrack objects.
 * @returns Array of track IDs (string[]).
 */
export function resolveTrackIds(tracks: string[] | IGVBrowserTrack[]): string[] {
    if (typeof tracks[0] === "string") {
        return tracks as string[];
    }
    return (tracks as IGVBrowserTrack[]).map((t) => t.id);
}
