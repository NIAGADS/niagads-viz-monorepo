import IGVBrowserWrapper from "@/component_wrappers/IGVBrowserWrapper";

export default async function Page() {
    const endpoint = process.env.NEXT_PUBLIC_TRACK_CONFIG;
    if (!endpoint) {
        throw new Error("NEXT_PUBLIC_TRACK_CONFIG is not set; cannot load track configurations.");
    }

    // Fetch track config from API route
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/track-config?name=${encodeURIComponent(endpoint)}`
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch track config: ${res.statusText}`);
    }
    const trackConfig = await res.json();

    return (
        <IGVBrowserWrapper
            config={trackConfig}
            genome={"GRCh38"}
            searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}
        />
    );
}
