import fetchTrackConfig, { buildTrackSelectorTable } from "@/utils/track-config";

import IGVBrowserWrapper from "@/component_wrappers/IGVBrowserWrapper";

interface PageProps {
    searchParams: Promise<Record<string, string | string[]>>;
}

export default async function Page({ searchParams }: PageProps) {
    const trackConfig = await fetchTrackConfig();
    const trackSelectorTableData =
        process.env.INCL_TRACK_SELECTOR?.toUpperCase() === "TRUE" ? buildTrackSelectorTable(trackConfig) : undefined;

    const params = await searchParams;

    return (
        <IGVBrowserWrapper
            config={trackConfig}
            inclVariantReference={process.env.INCL_VARIANT_REFERENCE?.toUpperCase() === "TRUE"}
            table={trackSelectorTableData}
            searchParams={params}
        />
    );
}
