// TODO: fix loading fallback handling; it is incorrect

import { ALWAYS_ON_TRACKS, DEFAULT_FLANK, FEATURE_SEARCH_URL } from "./config/_constants";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { resolveTrackConfigs, resolveTrackIds } from "./utils/track_config";

import { IGVBrowserTrack } from "./types/data_models";
import { Skeleton } from "@niagads/ui";
import { _genomes } from "./config/_igvGenomes";
import { loadTracks } from "./utils/browser";
import { trackPopover } from "./tracks/feature_popovers";

/**
 * cleans up range-based locus
 */
function standardizeRange(locus: string): string {
    if (!locus) return locus;
    // , or ... in a range, clean it up
    return locus.replace(/,/g, "").replace("...", "-");
}

/**
 * Bulk load all initial tracks (reference, default and file-based) into the IGV browser.
 * @param browser IGV browser instance.
 * @param config PreloadedTrackConfig object containing tracks and files to load.
 * @returns Promise resolving to an array of loaded track IDs (from config.tracks).
 */
async function loadInitialTracks(browser: any, config: PreloadedTrackConfig) {
    const allTracks: IGVBrowserTrack[] = [...(config?.tracks ?? []), ...((config?.files ?? []) as IGVBrowserTrack[])];
    await loadTracks(browser, allTracks);
    return config.tracks ? resolveTrackIds(config.tracks) : [];
}

interface FileTrackUrls {
    urls: string[];
    indexed: boolean;
}

export interface IGVBrowserProps {
    /** Genome assembly identifier (e.g., "GRCh38") */
    genome?: string;
    /** URL endpoint for feature search queries, should take a `feature` and a `flank` parameter;
     *  defaults to NIAGADS Open Access API feature search */
    searchUrl?: string;
    /** Array of track configuration objects to load */
    trackConfig?: IGVBrowserTrack[];
    /** Additional Reference tracks (not removable) */
    referenceTracks?: string[] | IGVBrowserTrack[];
    /** Tracks to load by default (list of trackIds) */
    defaultTracks?: string[] | IGVBrowserTrack[];
    /** URLs of files to load & flag indicating if they are indexed*/
    files?: FileTrackUrls;
    /** Initial locus (region or gene name) to display */
    locus?: string;
    /** Flag to hide browser navigation controls */
    hideNavigation?: boolean;
    /** Callback fired when tracks are removed */
    onTrackRemoved?: (trackIds: string[]) => void;
    /** Callback fired when tracks are added (e.g., from url parameter) */
    onTrackAdded?: (trackIds: string[]) => void;
    /** Callback fired when browser is loaded */
    onBrowserLoad?: (browser: any) => void;
    /** Callback fired when locus changes */
    onLocusChanged?: (browser: any) => void;
}

type FileTrackConfig = Partial<IGVBrowserTrack>;

interface PreloadedTrackConfig {
    tracks?: IGVBrowserTrack[];
    files?: FileTrackConfig[];
}

const IGVBrowser: React.FC<IGVBrowserProps> = ({
    genome = "GRCh38",
    searchUrl = FEATURE_SEARCH_URL,
    locus,
    trackConfig,
    referenceTracks,
    defaultTracks,
    files = { urls: [], indexed: true },
    hideNavigation = false,
    onBrowserLoad,
    onTrackRemoved,
    onTrackAdded,
    onLocusChanged,
}) => {
    const [isClient, setIsClient] = useState(false);
    const [igv, setIGV] = useState<any>(null);
    const [browserIsLoading, setBrowserIsLoading] = useState<boolean>(true);
    // const [browser, setBrowser] = useState<any>(null);

    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const opts: any = useMemo(() => {
        const genomeReference = _genomes.find((g) => g.id === genome);
        let browserOpts: any = {
            locus: standardizeRange(locus || "ABCA7"),
            showAllChromosomes: false,
            flanking: DEFAULT_FLANK,
            minimumBases: 40,
            showNavigation: !hideNavigation,
            search: {
                url: searchUrl,
            },
            reference: genomeReference,
            loadDefaultGenomes: false,
            genomeList: [genomeReference],
            alwaysOnTracks: [
                ...ALWAYS_ON_TRACKS,
                ...(referenceTracks
                    ? resolveTrackConfigs(trackConfig, referenceTracks)
                          .filter((t) => t.removable !== true)
                          .map((t) => t.id)
                    : []),
            ],
        };

        return browserOpts;
    }, [genome, locus]);

    const initialTrackConfiguration = useMemo<PreloadedTrackConfig>(() => {
        const ptConfig: PreloadedTrackConfig = {};

        if (trackConfig) {
            let tracks: IGVBrowserTrack[] = referenceTracks ? resolveTrackConfigs(trackConfig, referenceTracks) : [];
            if (defaultTracks) {
                tracks.push(...resolveTrackConfigs(trackConfig, defaultTracks));
            }
            const seen = new Set();
            ptConfig.tracks = tracks.filter((track) => !seen.has(track.id) && seen.add(track.id));

            if (files) {
                const uniqueUrls = Array.from(new Set(files.urls));
                ptConfig.files = uniqueUrls.map((url: string) => {
                    const id = "file_" + url.split("/").pop()!.replace(/\..+$/, "");
                    return files.indexed
                        ? { url: url, indexURL: `${url}.tbi`, name: `USER: ${id}`, id: id }
                        : { url: url, name: `USER: ${id}`, id: id };
                });
            }
        }
        return ptConfig;
    }, [referenceTracks, defaultTracks, files, trackConfig]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useLayoutEffect(() => {
        if (isClient && containerRef.current) {
            // lazy load of igv library to avoid `window is not defined` ReferenceError
            async function loadIGV() {
                const { default: mod } = await import("igv/dist/igv.esm");
                setIGV(mod);
            }

            async function registerTracks() {
                const { default: VariantServiceTrack } = await import("./tracks/VariantServiceTrack");
                const { default: VariantPValueTrack } = await import("./tracks/VariantPValueTrack");
                igv.registerTrackClass("gwas_service", VariantPValueTrack);
                igv.registerTrackClass("qtl", VariantPValueTrack);
                igv.registerTrackClass("variant_service", VariantServiceTrack);
            }

            if (!igv) {
                loadIGV();
            } else {
                // register custom track classes
                const targetDiv = containerRef.current;
                registerTracks();

                if (opts != null) {
                    igv.createBrowser(targetDiv, opts).then(async function (browser: any) {
                        // custom track popovers
                        browser.on("trackclick", trackPopover);

                        // handle track removed
                        browser.on("trackremoved", function (track: any) {
                            if (onTrackRemoved) {
                                onTrackRemoved([track.config.id]);
                            }
                        });

                        // handle locus change; useful for saving a session
                        browser.on("locuschange", function (referenceFrameList: any) {
                            if (!isDragging.current) {
                                let loc = referenceFrameList.map((rf: any) => rf.getLocusString()).join("%20");
                                onLocusChanged && onLocusChanged(loc);
                            }
                        });

                        // track when dragging ends so can accurately register a locus change
                        browser.on("trackdrag", () => {
                            isDragging.current = true;
                        });

                        browser.on("trackdragend", () => {
                            isDragging.current = false;
                            let loc = browser.referenceFrameList.map((rf: any) => rf.getLocusString()).join("%20");
                            onLocusChanged && onLocusChanged(loc);
                        });

                        await loadInitialTracks(browser, initialTrackConfiguration);

                        // add browser to state
                        // setBrowser(browser);
                        setBrowserIsLoading(false);

                        // callback to parent component, if exist
                        if (onBrowserLoad) {
                            onBrowserLoad(browser);
                        }
                    });
                }
            }
        }
    }, [isClient, igv]);

    return !isClient && browserIsLoading ? (
        <Skeleton type="table" />
    ) : (
        <div ref={containerRef} className="w-full" id="genome-browser"></div>
    );
};

// FIXME: which one should be default?
export const MemoIGVBrowser = React.memo(IGVBrowser);
export default IGVBrowser;
