import { ALWAYS_ON_TRACKS } from "../config/_constants";
import { IGVBrowserTrack } from "../types/data_models";

export const getTrackConfig = (trackIds: string[], config: IGVBrowserTrack[]) =>
    config.filter((c) => trackIds.includes(c.id));

export const getTrackID = (trackView: any) => {
    const track = trackView.track;
    return "id" in track ? track.id : track.config.id;
};

export const getLoadedTracks = (browser: any, alwaysOnTracks: string[] = ALWAYS_ON_TRACKS): string[] =>
    (browser?.trackViews ?? [])
        .map((view: any) => getTrackID(view))
        .filter((track: string) => !alwaysOnTracks.includes(track));

export const trackIsLoaded = (config: any, browser: any) => getLoadedTracks(browser).includes(config.id);

// we want to find track by ID b/c some names may be duplicated; so modeled after:
// https://github.com/igvteam/igv.js/blob/0dfb1f7b02d9660ff1ef0169899c4711496158e8/js/browser.js#L1104
export const removeTrackById = (trackId: string, browser: any) => {
    const trackViews = browser?.trackViews ?? [];
    const trackView = trackViews.filter((view: any) => getTrackID(view) === trackId);
    browser.removeTrack(trackView[0].track);
};

// functions for maninpulating IGV browser object
export const loadTrack = async (track: IGVBrowserTrack, browser: any) => {
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
        track.reader = await resolveServiceTrackReader(track.type, {
            endpoint: track.url,
            track: track.id,
        });
    }

    await browser.loadTrack(track);
};

export const loadTracks = async (tracks: IGVBrowserTrack[], browser: any) => {
    for await (const _ of tracks.map((t) => loadTrack(t, browser)));
};

export const resolveServiceTrackReader = async (trackType: string, config: any) => {
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

/**
Convert FILER metadata specification to IGV tracks
note: FILER metadata specification is unstable, so this may need to be modified
in the future
 */
export const convertFILERMetadataToIGVTrack = (metadata: any) => {
    if (!Array.isArray(metadata)) {
        throw new Error("FILERtoIGV: metadata must be an array");
    }
    return metadata.map((track: any) => {
        const url = track["Processed File Download URL"];

        const igvTrack: Partial<IGVBrowserTrack> = {
            id: track["#Identifier"],
            name: track["trackName"],
            url: url,
            indexURL: url + ".tbi",
            infoURL: "/record",
            format: "bed",
            type: "annotation",
            autoscale: false,
        };
        if (!track["Track Description"].toLowerCase().includes("not applicable")) {
            igvTrack.description = track["Track Description"];
        }
        if (track["Data Category"].includes("QTL")) {
            // expect format = bed bed6+14 qtl -> so need bed6+14, or what ever is in 2nd item
            let format = track["File format"].split(" ")[1];
            Object.assign(igvTrack, { format: format, type: "qtl", autoscale: true });
        }

        return igvTrack as IGVBrowserTrack;
    });
};
