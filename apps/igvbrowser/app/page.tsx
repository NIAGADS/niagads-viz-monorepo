import fetchTrackConfig, { buildTrackSelectorTable } from "@/utils/track-config";

import IGVBrowserWrapper from "@/component_wrappers/IGVBrowserWrapper";

export default async function Page() {
    const trackConfig = await fetchTrackConfig();
    const trackSelectorTableData =
        process.env.INCL_TRACK_SELECTOR?.toUpperCase() === "TRUE" ? buildTrackSelectorTable(trackConfig) : undefined;

    return (
        <IGVBrowserWrapper
            config={trackConfig}
            inclVariantReference={process.env.INCL_VARIANT_REFERENCE?.toUpperCase() === "TRUE"}
            table={trackSelectorTableData}
        />
    );
}
