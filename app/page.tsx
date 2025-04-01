import { Collection } from "@/common/types";
import {
    fetchCollectionMetadata,
    fetchTrackConfiguration,
    fetchTrackSelector,
    parseCollectionList,
} from "@/utils/getCollectionData";

import { Suspense } from "react";
import { Skeleton } from "@niagads/ui";
import { IGVBrowserWithSelector } from "@/components/IGVBrowser/IGVBrowserWithSelector";

export default async function Page() {
    const collections: Collection[] = parseCollectionList(process.env.NEXT_PUBLIC_TRACK_COLLECTIONS!);
    const selector = await fetchTrackSelector(collections);
    const config = await fetchTrackConfiguration(collections);
    const metadata = await fetchCollectionMetadata(collections);

    return (
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
    );
}
