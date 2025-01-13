import {
    TrackBaseOptions,
    IGVTrackOptions,
} from "@/components/IGVBrowser/types/tracks";
import { decodeBedXY } from "@/components/IGVBrowser/decoders/bedDecoder";
import GWASServiceReader from "@/components/IGVBrowser/readers/GWASServiceReader";
import VariantServiceReader from "@/components/IGVBrowser/readers/VariantServiceReader";

export const resolveTrackReader = (trackType: string, config: any): any => {
    switch (trackType) {
        case "gwas_service":
            return new GWASServiceReader(config);
        case "variant_service":
            return new VariantServiceReader(config);
        default:
            return null;
    }
};

// functions for maninpulating IGV browser object
export const loadTrack = async (config: any, browser: any) => {
    await browser.loadTrack(config);
};

export const loadTracks = (tracks: TrackBaseOptions[], browser: any) => {
    for (const track of tracks as IGVTrackOptions[]) {
        if (track.type.includes("_service")) {
            track.reader = resolveTrackReader(track.type, {
                endpoint: track.url,
                track: track.id,
            });
        }
        if ("format" in track) {
            if (track.format.match("^bed\\d{1,2}\\+\\d+$") != null) {
                // does it match bedX+Y?
                track.decode = decodeBedXY;
            }
        }
        // load
        browser.loadTrack(track);
    }
};


