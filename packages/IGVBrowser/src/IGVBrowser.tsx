// TODO: fix loading fallback handling; it is incorrect

import { DEFAULT_FLANK, FEATURE_SEARCH_URL } from "./config/_constants";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getLoadedTracks, loadTracks, removeTrackById, getTrackConfig } from "./tracks/utils";

import { IGVBrowserQueryParams, IGVBrowserTrack } from "./types/data_models";
import { Skeleton } from "@niagads/ui";
import { _genomes } from "./config/_igvGenomes";
import find from "lodash.find";
import noop from "lodash.noop";
import { trackPopover } from "./tracks/feature_popovers";

/**
 * Translates locus from 1-based to zero-based and adds
 * flank padding to a locus string like "chr1:1000" or "chr1:1000-2000".
 * Returns the locus string with flank applied (e.g. "chr1:500-1500").
 */
function adjustLocusRange(locus: string, flank: number): string {
    if (locus.startsWith("chr")) {
        let [chr, position] = locus.split(":");
        position = position.replace(/,/g, ""); // remove any commas
        let start = position.includes("-") ? parseInt(position.split("-")[0]) : parseInt(position);
        let end = position.includes("-") ? parseInt(position.split("-")[1]) : parseInt(position);
        start = Math.max(1, start - flank);
        end = end + flank;
        return `${chr}:${start}-${end}`;
    }

    return locus || "";
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
    genome: string;
    /** URL endpoint for feature search queries, should take a `feature` and a `flank` parameter; defaults to GenomicsDB Feature search */
    searchUrl?: string;
    /** Array of track configuration objects to load */
    tracks?: IGVBrowserTrack[];
    /** Additional Reference tracks to display by default */
    referenceTracks?: IGVBrowserTrack[];
    /** Initial locus (region or gene name) to display */
    locus?: string;
    /** Flag to hide browser navigation controls */
    hideNavigation?: boolean;
    /** Flag to enable support for query parameters in the URL. */
    allowQueryParameters?: boolean;
    /** the query params to parse and manage */
    queryParams?: IGVBrowserQueryParams;
    /** Callback fired when tracks are removed */
    onTrackRemoved?: (tracks: string[]) => void;
    /** Callback fired when tracks are added (e.g., from url parameter) */
    onTrackAdded?: (tracks: string[]) => void;
    /** Callback fired when browser is loaded */
    onBrowserLoad?: (Browser: any) => void;
    /** Callback fired when locus changes */
    onLocusChanged?: (Browser: any) => void;
}

type FileTrackConfig = Partial<IGVBrowserTrack>;

const IGVBrowser: React.FC<IGVBrowserProps> = ({
    genome = "GRCh38",
    searchUrl = FEATURE_SEARCH_URL,
    locus,
    tracks,
    referenceTracks,
    hideNavigation = false,
    allowQueryParameters = true,
    queryParams,
    onBrowserLoad,
    onTrackRemoved,
    onTrackAdded,
    onLocusChanged,
}) => {
    const [isClient, setIsClient] = useState(false);

    const [igv, setIGV] = useState<any>(null);

    const [browserIsLoading, setBrowserIsLoading] = useState<boolean>(true);
    const [browser, setBrowser] = useState<any>(null);

    // session initializatin
    const [highlightRegionLabel, setHighlightRegionLabel] = useState<string | null>(null);

    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const opts: any = useMemo(() => {
        const referenceTrackConfig: any = find(_genomes, { id: genome });
        //referenceTrackConfig.tracks.push(VariantReferenceTrack);
        let browserOpts = {
            locus: locus || "ABCA7",
            showAllChromosomes: false,
            flanking: DEFAULT_FLANK,
            minimumBases: 40,
            showNavigation: !hideNavigation,
            search: {
                url: searchUrl,
            },
            reference: referenceTrackConfig,
            loadDefaultGenomes: false,
            genomeList: _genomes,
            supportQueryParameters: allowQueryParameters,
        };

        if (queryParams) {
            Object.assign(
                browserOpts,
                queryParams.loc ? { locus: adjustLocusRange(queryParams.loc, DEFAULT_FLANK) } : {}
            );

            setHighlightRegionLabel(queryParams.roiLabel || queryParams.loc || null);

            Object.assign(
                browserOpts,
                queryParams.track
                    ? {
                          queryTracks: getTrackConfig(
                              Array.isArray(queryParams.track) ? queryParams.track : [queryParams.track],
                              tracks || []
                          ),
                      }
                    : {}
            );
            Object.assign(
                browserOpts,
                queryParams.file
                    ? {
                          queryFiles: {
                              urls: Array.from(
                                  new Set(Array.isArray(queryParams.file) ? queryParams.file : [queryParams.file])
                              ),
                              indexed: queryParams.filesAreIndexed,
                          },
                      }
                    : {}
            );
        }

        return browserOpts;
    }, [genome, locus, queryParams]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // create clean session
        if (!browserIsLoading) {
            const loadedTracks = getLoadedTracks(browser);

            // if any tracks are loaded, remove them
            if (Object.keys(loadedTracks).length !== 0) {
                for (const id of loadedTracks) {
                    removeTrackById(id, browser);
                }
            }

            const loadInitialTracks = async () => {
                // load tracks from the url query
                if (browser.config.queryTracks) {
                    await loadTracks(browser.config.queryTracks, browser);
                    if (onTrackAdded) {
                        const trackIds = browser.config.queryTracks.map((t: IGVBrowserTrack) => t.id);
                        onTrackAdded(trackIds);
                    }
                }

                // load files from the url query
                if (browser.config.queryFiles) {
                    const fileTracks = browser.config.queryFiles.urls.map((url: string) => {
                        const id = "file_" + url!.split("/").pop()!.replace(/\..+$/, "");
                        const config: FileTrackConfig = browser.config.queryFiles.indexed
                            ? { url: url, indexURL: url + ".tbi", name: "USER: " + id, id: id }
                            : { url: url, name: "USER: " + id, id: id };
                        return config;
                    });

                    await loadTracks(fileTracks, browser);
                }

                // TODO: loci and ROI
            };

            loadInitialTracks();
        }
    }, [browserIsLoading]);

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
                    igv.createBrowser(targetDiv, opts).then(function (browser: any) {
                        // custom track popovers
                        browser.on("trackclick", trackPopover);

                        // handle track removed
                        browser.on("trackremoved", function (track: any) {
                            if (onTrackRemoved) {
                                onTrackRemoved(track.config.id);
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

                        // add browser to state
                        setBrowser(browser);
                        setBrowserIsLoading(false);

                        // callback to parent component, if exist
                        if (onBrowserLoad) {
                            onBrowserLoad(browser);
                        } else {
                            noop();
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
