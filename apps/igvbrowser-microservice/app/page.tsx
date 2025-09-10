import { fetchCollectionMetadata, fetchTrackConfiguration, fetchTrackSelector } from "@/utils/fetch";

import { Collection } from "@/common/types";
import { IGVBrowserWithSelector } from "@/components/IGVBrowserWithSelector";
import { Skeleton } from "@niagads/ui";
import { Suspense } from "react";
import { parseCollectionList } from "@/utils/utils";

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
