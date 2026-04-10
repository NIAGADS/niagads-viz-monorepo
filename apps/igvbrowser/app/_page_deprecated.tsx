"use client";

import { IGVBrowser } from "@niagads/igv";

export default /*async */ function Page() {
    return <IGVBrowser genome={"GRCh38"} searchUrl={"/service/track/feature?id=$FEATURE$&flank=1000"}></IGVBrowser>;
}

/*const collections: Collection[] = parseCollectionList(process.env.NEXT_PUBLIC_TRACK_COLLECTIONS!);
    const selector = await fetchTrackSelector(collections);
    const config = await fetchTrackConfiguration(collections);
    const metadata = await fetchCollectionMetadata(collections);
*/
/*    return (
        <>
            <Suspense fallback={<Skeleton type="default" />}>
                <IGVBrowserWithSelector
                    collections={collections}
                    selector={selector}
                    config={config}
                    metadata={metadata}
                ></IGVBrowserWithSelector>
            </Suspense>
        </>
    );*/
