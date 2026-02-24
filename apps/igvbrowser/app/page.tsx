import IGVBrowserWrapper from "@/component_wrappers/IGVBrowserWrapper";
import fetchTrackConfig from "@/utils/track-config";

interface PageProps {
    searchParams: Promise<Record<string, string | string[]>>;
}

const isTrue = (value?: string) => value?.trim().toUpperCase() === "TRUE";

export default async function Page({ searchParams }: PageProps) {
    const trackConfig = await fetchTrackConfig();

    const params = await searchParams;

    return (
        <IGVBrowserWrapper
            locus={process.env.INITIAL_LOCUS}
            trackConfig={trackConfig}
            inclVariantReference={isTrue(process.env.INCL_VARIANT_REFERENCE)}
            inclTrackSelector={isTrue(process.env.INCL_TRACK_SELECTOR)}
            hideNavigation={isTrue(process.env.HIDE_NAVIGATION)}
            queryParams={params}
        />
    );
}
