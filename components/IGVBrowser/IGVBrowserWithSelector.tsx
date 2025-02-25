'use client'
import React, { cache, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";

import { IGVBrowserProps } from "./IGVBrowser";
import { IGVBrowserTrack } from "./tracks";
import TrackSelectorTable, {TableProps as Table} from "./TrackSelectorTable";
import { getLoadedTracks, loadTracks, removeTrackById } from "./tracks/utils";

const GenomeBrowser = dynamic(
    () =>
        import("@/components/IGVBrowser/IGVBrowser").then(
            (mod) => mod.MemoIGVBrowser
        ),
    {
        ssr: false,
    }
);

export interface Collection {
    route: any;
    name: string;
}

export interface CollectionInfo {
    name: string;
    description: string;
    num_tracks: string;
}

interface BrowserWithSelectorProps {
    collection: Collection[];
}

type RESPONSE_TYPE = "config" | "selector" | "info";

const fetchCollection = cache(
    async (collection: Collection, responseType: RESPONSE_TYPE) => {
        const requestUrl = (responseType === 'info') 
            ? `/api/${collection.route}/collection`
            : `/api/${collection.route}/service/igvbrowser/${responseType}?collection=${collection.name}`;
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
            if (data.hasOwnProperty('response')) {
                return data.response;
            }
            return data;
        }
        // TODO: catch the error
    }
);



// FIXME/TODO: Error handling
export const fetchTrackConfiguration = cache(
    async (collections: Collection[]) => {
        let config: IGVBrowserTrack[] = [];
        for await (const collectionConfig of collections.map((c: Collection) =>
            fetchCollection(c, "config")
        )) {
            if (collectionConfig !== null) {
                config = config.concat(collectionConfig);
            }
        }
        // remove duplicates across the collections
        // see https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/ - solution #2 for complete duplicates
        return Array.from(new Set(config.map((c) => JSON.stringify(c)))).map(
            (str) => JSON.parse(str)
        );
    }
);

export const fetchTrackSelector = cache(async (collections: Collection[]) => {
    let selectors: Table[] = []; 
    for await (const collectionSelector of collections.map((c: Collection) =>
        fetchCollection(c, "selector")
    )) {
        if (collectionSelector !== null) {
            selectors.push(collectionSelector);
        }
    }
    return selectors;
});


export const fetchCollectionInfo = cache(async (collections: Collection[]) => {
    const collectionInfo = await fetchCollection(collections[0], "info"); // doesn't matter which collection id we pass
    const collectionIds = collections.map((c:Collection) => c.name);
    return collectionInfo.filter((item: CollectionInfo) => collectionIds.includes(item.name));
});

const IGVBrowserWithSelector: React.FC<
    Omit<IGVBrowserProps, "onBrowserLoad" | "onTrackRemoved"> &
        BrowserWithSelectorProps
> = ({ genome, featureSearchURI, locus, collection, tracks = [] }) => {
    const [browserTrackConfig, setBrowserTrackConfig] = useState<
        IGVBrowserTrack[]
    >([]);
    const [trackSelectorTable, setTrackSelectorTable] = useState<Table[]>([]);
    const [collectionInfo, setCollectionInfo] = useState<CollectionInfo[]>([]);
    const [browser, setBrowser] = useState<any>(null);

    const extractTrackConfig = (trackIds: string[]) =>
        browserTrackConfig.filter((config) => trackIds.includes(config.id));

    const __loadTracks = async (
        selectedTracks: string[],
        loadedTracks: string[]
    ) => {
        let addedTrackIds: string[] = [];
        const tracksToAdd = selectedTracks.filter(
            (id: string) => !loadedTracks.includes(id)
        );
        await loadTracks(extractTrackConfig(tracksToAdd), browser);
        return addedTrackIds;
    };

    const __unloadTracks = async (
        selectedTracks: string[],
        loadedTracks: string[]
    ) => {
        const removedTracks = loadedTracks.filter(
            (track) => !selectedTracks.includes(track)
        );
        const removedTrackIds: string[] = [];
        removedTracks.forEach((trackKey: string) => {
            browserTrackConfig
                .filter((track: any) => track.id === trackKey)
                .map((track: any) => {
                    removeTrackById(track.id, browser);
                    removedTrackIds.push(track.id);
                });
        });
        return removedTrackIds;
    };

    const toggleTracks = async (selectedTracks: string[]) => {
        if (browser && browserTrackConfig) {
            const loadedTracks = getLoadedTracks(browser);
            const addedTracks = await __loadTracks(
                selectedTracks,
                loadedTracks
            );
            const removedTracks = await __unloadTracks(
                selectedTracks,
                loadedTracks
            );
            //await addTracksToSession(addedTracks);
            //await removeTracksFromSession(removedTracks);
        }
    };

    const initializeBrowser = useCallback((b: any) => {
        setBrowser(b);
    }, []);

    useEffect(() => {
        fetchTrackConfiguration(collection).then((result) =>
            setBrowserTrackConfig(result)
        );
        fetchTrackSelector(collection).then((result) =>
            setTrackSelectorTable(result)
        );
        fetchCollectionInfo(collection).then((result) =>
            setCollectionInfo(result)
        );
    }, [collection]);

    return (
        <>
            {browserTrackConfig.length > 0 && (
                <>
                <GenomeBrowser
                    genome={genome}
                    featureSearchURI={featureSearchURI}
                    locus={locus}
                    tracks={tracks}
                    onBrowserLoad={initializeBrowser}></GenomeBrowser>
                <div className="bg-gray-100 mx-2 mt-20 mb-2 border-t-2 border-primary text-primary p-2 text-2x1">
                    <h1>Select Tracks</h1>
                </div>
                </>
            )}

            {browser && trackSelectorTable.length > 0 && (
                <div className="flex w-full flex-col">
                    <Tabs
                        aria-label="Browser Track Selectors"
                        className="mx-2"
                        color="primary"
                        items={trackSelectorTable}>
                        {(item) => (
                            <Tab key={`tab-${item.id}`}  title={`${item.id} Tracks`}>
                                <Card key={`card-${item.id}`} shadow="none" radius="none">
                                    <CardBody key={`cb-${item.id}`}>
                                        <TrackSelectorTable key={`table-${item.id}`}
                                            table={item}
                                            handleRowSelect={
                                                toggleTracks
                                            }></TrackSelectorTable>
                                    </CardBody>
                                </Card>
                            </Tab>
                        )}
                    </Tabs>
                </div>
            )}
        </>
    );
};

export const MemoIGVBrowserWithSelector = React.memo(IGVBrowserWithSelector);
export default IGVBrowserWithSelector;
