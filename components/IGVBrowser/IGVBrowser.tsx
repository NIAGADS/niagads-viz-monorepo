"use client";

import React, { useLayoutEffect, useMemo, useState, useEffect, useRef, Suspense } from "react";

import noop from "lodash.noop";
import find from "lodash.find";

import IGVBrowserTrack from "./tracks/IGVBrowserTrack";
import { trackPopover } from "./tracks/feature_popovers";

import { loadTracks, getLoadedTracks, removeTrackById } from "./tracks/utils";

import { DEFAULT_FLANK } from "./config/_constants";
import { _genomes } from "./config/_igvGenomes";
import { Skeleton } from "@niagads/ui";

export interface IGVBrowserProps {
    genome: string;
    featureSearchURI: string;
    tracks?: IGVBrowserTrack[];
    locus?: string;
    onTrackRemoved?: (track: string) => void;
    onBrowserLoad?: (Browser: any) => void;
}

const IGVBrowser: React.FC<IGVBrowserProps> = ({
    genome,
    featureSearchURI,
    locus,
    onBrowserLoad,
    onTrackRemoved,
    tracks,
}) => {
    const [isClient, setIsClient] = useState(false);

    const [igv, setIGV] = useState<any>(null);

    const [browserIsLoading, setBrowserIsLoading] = useState<boolean>(true);
    const [browser, setBrowser] = useState<any>(null);

    const containerRef = useRef(null);

    const opts: any = useMemo(() => {
        const referenceTrackConfig: any = find(_genomes, { id: genome });
        return {
            locus: locus || "ABCA7",
            showAllChromosomes: false,
            flanking: DEFAULT_FLANK,
            minimumBases: 40,
            search: {
                url: `${featureSearchURI}$FEATURE$&flank=${DEFAULT_FLANK}`,
            },
            reference: referenceTrackConfig,
            loadDefaultGenomes: false,
            genomeList: _genomes,
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
                const { default: VariantPValueTrack } = await import("./tracks/VariantServiceTrack");
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

                        // perform action in encapsulating component if track is removed
                        browser.on("trackremoved", function (track: any) {
                            if (onTrackRemoved) {
                                onTrackRemoved(track.config.id);
                            }
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

export const MemoIGVBrowser = React.memo(IGVBrowser);
export default IGVBrowser;
