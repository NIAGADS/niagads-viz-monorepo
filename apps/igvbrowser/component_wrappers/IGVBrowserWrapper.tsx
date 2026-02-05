"use client";

import { IGVBrowser, VariantReferenceTrack } from "@niagads/igv";

interface IGVBrowserWrapperProps {
    config: any;
    genome: string;
    searchUrl: string;
}

export default function IGVBrowserWrapper({ config, genome, searchUrl }: IGVBrowserWrapperProps) {
    // You can use useEffect, useState, etc. here if needed
    const tracks =
        process.env.NEXT_PUBLIC_INCL_VARIANT_REFERENCE?.toUpperCase() === "TRUE" ? [VariantReferenceTrack] : undefined;

    return <IGVBrowser genome={genome} searchUrl={searchUrl} tracks={tracks} />;
}
