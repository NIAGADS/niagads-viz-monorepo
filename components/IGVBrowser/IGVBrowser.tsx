"use client";

// TODO: streaming w/Suspense and fallback instead

import React, {
    useLayoutEffect,
    useMemo,
    useState,
    useEffect,
    useRef,
} from "react";
import igv from "igv/dist/igv.esm";
import noop from "lodash.noop";
import find from "lodash.find";
import {
    VariantPValueTrack,
    VariantServiceTrack as VariantTrack,
    trackPopover,
} from "@/components/IGVBrowser/tracks";
import { _genomes } from "@/components/IGVBrowser/data/_igvGenomes";
import {
    Session,
    TrackBaseOptions,
} from "@/components/IGVBrowser/types/tracks";
import {
    loadTracks,
    createSessionSaveObj,
    downloadObjectAsJson,
    getLoadedTracks,
    removeTrackById,
} from "@/components/IGVBrowser/utils/index";
import { DEFAULT_FLANK, FEATURE_SEARCH_ENDPOINT } from "./data/_constants";

interface IGVBrowserProps {
    genome: string;
    locus?: string;
    onTrackRemoved?: (track: string) => void;
    onBrowserLoad?: (Browser: any) => void;
    tracks: TrackBaseOptions[];
}

const IGVBrowser: React.FC<IGVBrowserProps> = ({
    genome,
    locus,
    onBrowserLoad,
    onTrackRemoved,
    tracks,
}) => {
    const [browserIsLoaded, setBrowserIsLoaded] = useState<boolean>(false);
    const [browser, setBrowser] = useState<any>(null);
    const [sessionJSON, setSessionJSON] = useState<Session>({ tracks: tracks });
    const [isClient, setIsClient] = useState(false);
    const containerRef = useRef(null);

    const memoOptions: any = useMemo(() => {
        const referenceTrackConfig: any = find(_genomes, { id: genome });
        return {
            locus: locus || "APOE",
            showAllChromosomes: false,
            flanking: DEFAULT_FLANK,
            minimumBases: 40,
            search: {
                url: `${FEATURE_SEARCH_ENDPOINT}$FEATURE$&flank=${DEFAULT_FLANK}`,
            },
            reference: {
                id: genome,
                name: referenceTrackConfig.name,
                fastaURL: referenceTrackConfig.fastaURL,
                indexURL: referenceTrackConfig.indexURL,
                cytobandURL: referenceTrackConfig.cytobandURL,
                tracks: referenceTrackConfig.tracks,
            },
            loadDefaultGenomes: false,
            genomeList: _genomes,
        };
    }, [genome, locus]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // setting initial session due to component load/reload
        if (browserIsLoaded && memoOptions && tracks) {
            const loadedTracks = getLoadedTracks(browser);

            // if any tracks are loaded, remove them
            if (Object.keys(loadedTracks).length !== 0) {
                for (const id of loadedTracks) {
                    removeTrackById(id, browser);
                }
            }

            // load initial tracks
            loadTracks(tracks, browser);
        }
    }, [browserIsLoaded]);

    useLayoutEffect(() => {
        /* window.addEventListener("ERROR: Genome Browser - ", (event) => {
            console.log(event);
        }); */

        if (isClient && containerRef.current) {
            const targetDiv = containerRef.current;
            // const targetDiv = document.getElementById("genome-browser");

            if (memoOptions != null) {
                igv.registerTrackClass("gwas_service", VariantPValueTrack);
                igv.registerTrackClass("qtl", VariantPValueTrack);
                igv.registerTrackClass("variant_service", VariantTrack);

                igv.createBrowser(targetDiv, memoOptions).then(function (
                    browser: any
                ) {
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
                    setBrowserIsLoaded(true);

                    // callback to parent component, if exist
                    if (onBrowserLoad) {
                        onBrowserLoad(browser);
                    } else {
                        noop();
                    }
                });
            }
        }
    }, [isClient]);

    //rearrange
    const handleSaveSession = () => {
        if (browserIsLoaded) {
            const sessionObj = createSessionSaveObj(sessionJSON.tracks);
            downloadObjectAsJson(sessionObj, "NIAGADS_IGV_session");
        } else {
            alert("Wait until the browser is loaded before saving");
        }
    };

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <span
                ref={containerRef}
                style={{ width: "100%" }}
                id="genome-browser"
            />
        </>
    );
};

export const MemoIGVBrowser = React.memo(IGVBrowser);
export default IGVBrowser;
