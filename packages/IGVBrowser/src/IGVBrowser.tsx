// TODO: fix loading fallback handling; it is incorrect

import { ALWAYS_ON_TRACKS, DEFAULT_FLANK, FEATURE_SEARCH_URL } from "./config/_constants";
import { IGVBrowserQueryParams, IGVBrowserTrack } from "./types/data_models";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { findTrackConfigs, resolveTrackConfigs } from "./utils/track_config";

import { Skeleton } from "@niagads/ui";
import { _genomes } from "./config/_igvGenomes";
import { loadTracks } from "./utils/browser";
import { trackPopover } from "./tracks/feature_popovers";

/**
 * cleans up range-based locus
 */
function standardizeRange(locus: string): string {
    if (!locus) return locus;

    // , or ... in a range, replace them
    return locus.replace(/,/g, "").replace("...", "-");
}

/**
 * Loads all tracks (both reference and file-based) into the IGV browser.
 * @param browser IGV browser instance.
 * @param config PreloadedTrackConfig object containing tracks and files to load.
 * @returns Promise resolving to an array of loaded track IDs (from config.tracks).
 */
async function loadInitialTracks(browser: any, config: PreloadedTrackConfig) {
    // do one load
    const allTracks: IGVBrowserTrack[] = [...(config?.tracks ?? []), ...((config?.files ?? []) as IGVBrowserTrack[])];
    await loadTracks(browser, allTracks);

    return config.tracks ? config.tracks.map((t: IGVBrowserTrack) => t.id) : [];
}

/**
 * Props for the IGVBrowser React component.
 * @property genome - Genome assembly identifier (e.g., "GRCh38").
 * @property searchUrl - URL endpoint for feature search queries.
 * @property tracks - Optional array of track configuration objects to load.
 * @property locus - Optional initial locus (region or gene name) to display.
 * @property hideNavigation - Optional flag to hide browser navigation controls.
 * @property allowQueryParameters - Optional flag to enable support for query parameters in the URL.
 * @property onTrackRemoved - Optional callback fired when a track is removed.
 * @property onBrowserLoad - Optional callback fired when browser is loaded.
 * @property onLocusChanged - Optional callback fired when locus changes.
 */
export interface IGVBrowserProps {
    /** Genome assembly identifier (e.g., "GRCh38") */
    genome?: string;
    /** URL endpoint for feature search queries, should take a `feature` and a `flank` parameter; defaults to GenomicsDB Feature search */
    searchUrl?: string;
    /** Array of track configuration objects to load */
    trackConfig?: IGVBrowserTrack[];
    /** Additional Reference tracks (not removable) */
    referenceTracks?: string[] | IGVBrowserTrack[];
    /** Tracks to load by default (list of trackIds) */
    defaultTracks?: string[] | IGVBrowserTrack[];
    /** URLs of files to load */
    files?: string[];
    /** flag indicating if files are indexed */
    filesAreIndexed?: boolean;
    /** Initial locus (region or gene name) to display */
    locus?: string;
    /** Flag to hide browser navigation controls */
    hideNavigation?: boolean;
    /** Callback fired when tracks are removed */
    onTrackRemoved?: (trackIds: string[]) => void;
    /** Callback fired when tracks are added (e.g., from url parameter) */
    onTrackAdded?: (trackIds: string[]) => void;
    /** Callback fired when browser is loaded */
    onBrowserLoad?: (browser: any, state: any) => void;
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
    files,
    filesAreIndexed = true,
    hideNavigation = false,
    onBrowserLoad,
    onTrackRemoved,
    onTrackAdded,
    onLocusChanged,
}) => {
    const [isClient, setIsClient] = useState(false);

    const [igv, setIGV] = useState<any>(null);

    const [browserIsLoading, setBrowserIsLoading] = useState<boolean>(true);
    const [browser, setBrowser] = useState<any>(null);

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
                const uniqueUrls = Array.from(new Set(files));
                ptConfig.files = uniqueUrls.map((url: string) => {
                    const id = "file_" + url.split("/").pop()!.replace(/\..+$/, "");
                    return filesAreIndexed
                        ? { url: url, indexURL: `${url}.tbi`, name: `USER: ${id}`, id: id }
                        : { url: url, name: `USER: ${id}`, id: id };
                });
            }
        }
        return ptConfig;
    }, [referenceTracks, defaultTracks, files, filesAreIndexed, trackConfig]);

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

                        const initialState = initialTrackConfiguration
                            ? { preloadedTrackIds: await loadInitialTracks(browser, initialTrackConfiguration) }
                            : {};

                        // add browser to state
                        setBrowser(browser);
                        setBrowserIsLoading(false);

                        // callback to parent component, if exist
                        if (onBrowserLoad) {
                            onBrowserLoad(browser, initialState);
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
