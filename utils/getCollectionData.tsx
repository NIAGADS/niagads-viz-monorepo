import { cache } from "react";
import { Collection, CollectionMetadata, RESPONSE_TYPE } from "@/common/types";
import IGVBrowserTrack from "@/components/IGVBrowser/tracks/IGVBrowserTrack";
import { TableProps } from "@niagads/table";

export const parseCollectionList = cache((collections: string) => {
    let c: Collection[] = [];
    try {
        c = collections!.split(",").map((pair) => {
            const [route, name] = pair.split(":");
            return { route: route, name: name } as Collection;
        });
    } catch (err) {
        console.error(
            `Error parsing track collections: ${collections}$; 'NEXT_PUBLIC_TRACK_COLLECTIONS' in '.env.local' should be set to a comma separated list of API route:collection_name pairs.`
        );
    } finally {
        return c;
    }
});

const fetchCollection = cache(async (collection: Collection, responseType: RESPONSE_TYPE) => {
    const requestUrl =
        responseType === "metadata"
            ? `${process.env.SERVICE_URL}/api/${collection.route}/collection`
            : `${process.env.SERVICE_URL}/api/${collection.route}/service/igvbrowser/${responseType}?collection=${collection.name}`;

    let data = null;
    try {
        const response: any = await fetch(requestUrl);
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error(`Error fetching collection ${collection}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (data.hasOwnProperty("response")) {
            return data.response;
        }
        return data;
    }
    // TODO: catch the error
});

// FIXME/TODO: Error handling
export const fetchTrackConfiguration = cache(async (collections: Collection[]) => {
    let config: IGVBrowserTrack[] = [];
    for await (const collectionConfig of collections.map((c: Collection) => fetchCollection(c, "config"))) {
        if (collectionConfig !== null) {
            config = config.concat(collectionConfig);
        }
    }
    // remove duplicates across the collections
    // see https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/ - solution #2 for complete duplicates
    return Array.from(new Set(config.map((c) => JSON.stringify(c)))).map((str) => JSON.parse(str));
});

export const fetchCollectionMetadata = cache(async (collections: Collection[]) => {
    const collectionInfo = await fetchCollection(collections[0], "metadata"); // doesn't matter which collection id we pass
    const collectionIds = collections.map((c: Collection) => c.name);
    return collectionInfo.filter((item: CollectionMetadata) => collectionIds.includes(item.name));
});

export const fetchTrackSelector = cache(async (collections: Collection[]) => {
    let selectors: TableProps[] = [];
    for await (const collectionSelector of collections.map((c: Collection) => fetchCollection(c, "selector"))) {
        if (collectionSelector !== null) {
            selectors.push(collectionSelector);
        }
    }
    return selectors;
});
