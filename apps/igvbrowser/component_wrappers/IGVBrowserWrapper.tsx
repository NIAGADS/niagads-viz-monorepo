"use client";

// FIXME: search URL -> remove later to use default from NIAGADS Open Access API

import { IGVBrowserWithSelector, VariantReferenceTrack } from "@niagads/igv";

export interface IGVBrowserQueryParams {
    locus?: string;
    file?: string | string[];
    roiLabel?: string; // TODO - not yet handled in IGVBrowser component
    highlight?: boolean; // TODO - not yet handled in IGVBrowser component
    track?: string | string[];
    filesAreIndexed?: boolean;
}

interface IGVBrowserWrapperProps {
    trackConfig: any;
    selectorTable?: any;
    inclVariantReference: boolean;
    queryParams?: any;
}

export default function IGVBrowserWrapper({
    trackConfig,
    selectorTable,
    inclVariantReference,
    queryParams,
}: IGVBrowserWrapperProps) {
    return (
        <>
            <IGVBrowserWithSelector
                trackConfig={trackConfig}
                selectorTable={selectorTable}
                genome={"GRCh38"}
                searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}
                {...(inclVariantReference ? { referenceTracks: [VariantReferenceTrack] } : {})}
                {...(queryParams.locus ? { locus: queryParams.locus } : {})}
                {...(queryParams.track
                    ? { defaultTracks: Array.isArray(queryParams.track) ? queryParams.track : [queryParams.track] }
                    : {})}
                {...(queryParams.file
                    ? {
                          files: {
                              urls: Array.isArray(queryParams.file) ? queryParams.file : [queryParams.file],
                              indexed: queryParams.filesAreIndexed,
                          },
                      }
                    : {})}
            />
        </>
    );
}
