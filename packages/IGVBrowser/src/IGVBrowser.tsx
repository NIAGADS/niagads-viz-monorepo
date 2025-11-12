// TODO: fix loading fallback handling; it is incorrect

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getLoadedTracks, loadTracks, removeTrackById } from "./tracks/utils";

import { DEFAULT_FLANK } from "./config/_constants";
import { IGVBrowserTrack } from "./types/data_models";
import { Skeleton } from "@niagads/ui";
import { _genomes } from "./config/_igvGenomes";
import find from "lodash.find";
import noop from "lodash.noop";
import { trackPopover } from "./tracks/feature_popovers";

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
    /** URL endpoint for feature search queries, should take a `feature` and a `flank` parameter */
    searchUrl: string;
    /** Array of track configuration objects to load */
    tracks?: IGVBrowserTrack[];
    /** Initial locus (region or gene name) to display */
    locus?: string;
    /** Flag to hide browser navigation controls */
    hideNavigation?: boolean;
    /** Flag to enable support for query parameters in the URL. */
    allowQueryParameters?: boolean;
    /** Callback fired when a track is removed */
    onTrackRemoved?: (track: string) => void;
    /** Callback fired when browser is loaded */
    onBrowserLoad?: (Browser: any) => void;
    /** Callback fired when locus changes */
    onLocusChanged?: (Browser: any) => void;
}

const IGVBrowser: React.FC<IGVBrowserProps> = ({
    genome = "GRCh38",
    searchUrl,
    locus,
    tracks,
    hideNavigation = false,
    allowQueryParameters = true,
    onBrowserLoad,
    onTrackRemoved,
    onLocusChanged,
}) => {
    const [isClient, setIsClient] = useState(false);

    const [igv, setIGV] = useState<any>(null);

    const [browserIsLoading, setBrowserIsLoading] = useState<boolean>(true);
    const [browser, setBrowser] = useState<any>(null);

    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const opts: any = useMemo(() => {
        const referenceTrackConfig: any = find(_genomes, { id: genome });
        return {
            locus: locus || "ABCA7",
            showAllChromosomes: false,
            flanking: DEFAULT_FLANK,
            minimumBases: 40,
            showNavigation: !hideNavigation,
            search: {
                url: `${searchUrl}?feature=$FEATURE$&flank=${DEFAULT_FLANK}`,
            },
            reference: referenceTrackConfig,
            loadDefaultGenomes: false,
            genomeList: _genomes,
            supportQueryParameters: allowQueryParameters,
        };
    }, [genome, locus]);

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

            // load initial tracks
            tracks && loadTracks(tracks, browser);
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
