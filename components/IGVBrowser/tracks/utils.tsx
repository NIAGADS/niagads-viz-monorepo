"use client";

import get from "lodash.get";
import { ALWAYS_ON_TRACKS } from "../config/_constants";
import IGVBrowserTrack from "./IGVBrowserTrack";

export const getTrackConfig = (trackIds: string[], config: IGVBrowserTrack[]) =>
    config.filter((c) => trackIds.includes(c.id));

export const getTrackID = (trackView: any) => {
    const track = trackView.track;
    return "id" in track ? track.id : track.config.id;
};

export const getLoadedTracks = (browser: any, alwaysOnTracks: string[] = ALWAYS_ON_TRACKS): string[] =>
    get(browser, "trackViews", [])
        .map((view: any) => getTrackID(view))
        .filter((track: string) => !alwaysOnTracks.includes(track));

export const trackIsLoaded = (config: any, browser: any) => getLoadedTracks(browser).includes(config.id);

// we want to find track by ID b/c some names may be duplicated; so modeled after:
// https://github.com/igvteam/igv.js/blob/0dfb1f7b02d9660ff1ef0169899c4711496158e8/js/browser.js#L1104
export const removeTrackById = (trackId: string, browser: any) => {
    const trackViews = get(browser, "trackViews", []);
    const trackView = trackViews.filter((view: any) => getTrackID(view) === trackId);
    browser.removeTrack(trackView[0].track);
};

// functions for maninpulating IGV browser object
export const loadTrack = async (track: IGVBrowserTrack, browser: any) => {
    if (track.type.includes("_service")) {
        track.reader = await resolveTrackReader(track.type, {
            endpoint: track.url,
            track: track.id,
        });
    }
    if ("format" in track) {
        // does it match bedX+Y?
        if (track.format.match("^bed\\d{1,2}\\+\\d+$") != null) {
            const { default: decodeBedXY } = await import("../decoders/bedDecoder");
            track.decode = decodeBedXY;
        }
    }
    await browser.loadTrack(track);
};

export const loadTracks = async (tracks: IGVBrowserTrack[], browser: any) => {
    for await (const _ of tracks.map((t) => loadTrack(t, browser)));
};

export const resolveTrackReader = async (trackType: string, config: any) => {
    // this dynamic importing allows us to deal with the `window does not exist` reference error from igv.js
    const { default: GWASServiceReader } = await import("../readers/GWASServiceReader");
    const { default: VariantServiceReader } = await import("../readers/VariantServiceReader");
    switch (trackType) {
        case "gwas_service":
            return new GWASServiceReader(config);
        case "variant_service":
            return new VariantServiceReader(config);
        default:
            return null;
    }
};
