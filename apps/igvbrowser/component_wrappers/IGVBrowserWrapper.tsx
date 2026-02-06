"use client";

import { IGVBrowserWithSelector, VariantReferenceTrack } from "@niagads/igv";

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
    const referenceTracks = inclVariantReference ? [VariantReferenceTrack] : undefined;
    return (
        <IGVBrowserWithSelector
            trackConfig={trackConfig}
            selectorTable={selectorTable}
            referenceTracks={referenceTracks}
            queryParams={queryParams}
            genome={"GRCh38"}
            searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}
        />
    );
}
