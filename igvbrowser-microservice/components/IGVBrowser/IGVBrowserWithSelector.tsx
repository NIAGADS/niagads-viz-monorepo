"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { TableProps } from "@niagads/table";
import { TabDef, Tabs } from "@niagads/ui/client";
import { Skeleton } from "@niagads/ui";

import { Collection, CollectionMetadata } from "@/common/types";
import { FEATURE_SEARCH_ENDPOINT, GENOME, VariantReferenceTrack } from "@/config/reference.track.config";

import IGVBrowserTrack from "./tracks/IGVBrowserTrack";
import { TrackSelectorTable } from "./TrackSelectorTable";
import { getLoadedTracks, loadTracks, removeTrackById, getTrackConfig } from "./tracks/utils";

const GenomeBrowser = dynamic(() => import("@/components/IGVBrowser/IGVBrowser").then((mod) => mod.MemoIGVBrowser), {
    ssr: false,
});

interface DataProps {
    metadata: CollectionMetadata;
    selector: TableProps[];
    config: IGVBrowserTrack[];
    collections: Collection[];
}

export function IGVBrowserWithSelector({ metadata, selector, config, collections }: DataProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [browser, setBrowser] = useState<any>(null);
    const [loading, setIsLoading] = useState<boolean>(true);

    // initialize browser state
    const initializeBrowser = (b: any) => {
        b && setBrowser(b);
    };

    useEffect(() => {
        if (browser) {
            setIsLoading(false);
        }
    }, [browser]);

    // toggle tracks
    const toggleTrack = (rowSelection: string[]) => {
        setSelectedTracks(rowSelection);
    };

    const loadCallback = useCallback(
        async (selectedTracks: string[], loadedTracks: string[]) => {
            let addedTrackIds: string[] = [];
            const tracksToAdd = selectedTracks.filter((id: string) => !loadedTracks.includes(id));
            await loadTracks(getTrackConfig(tracksToAdd, config), browser);
            return addedTrackIds;
        },
        [selectedTracks]
    );

    const unloadCallback = useCallback(
        async (selectedTracks: string[], loadedTracks: string[]) => {
            const removedTracks = loadedTracks.filter((track) => !selectedTracks.includes(track));
            const removedTrackIds: string[] = [];
            removedTracks.forEach((trackKey: string) => {
                config
                    .filter((track: any) => track.id === trackKey)
                    .map((track: any) => {
                        removeTrackById(track.id, browser);
                        removedTrackIds.push(track.id);
                    });
            });
            return removedTrackIds;
        },
        [selectedTracks]
    );

    useEffect(() => {
        if (!loading) {
            const loadedTracks = getLoadedTracks(browser);
            const addedTracks = loadCallback(selectedTracks, loadedTracks);
            const removedTracks = unloadCallback(selectedTracks, loadedTracks);
            //await addTracksToSession(addedTracks);
            //await removeTracksFromSession(removedTracks);
        }
    }, [loadCallback, unloadCallback]);

    // track selector tabs
    const tabItems: TabDef[] = useMemo(
        () =>
            selector.map((item) => ({
                label: item.id.replace(/-/g, " "),
                id: item.id,
                content: <TrackSelectorTable key={1} table={item} handleRowSelect={toggleTrack} />,
            })),
        []
    );

    return (
        <>
            <GenomeBrowser
                genome={GENOME}
                featureSearchURI={FEATURE_SEARCH_ENDPOINT}
                onBrowserLoad={initializeBrowser}
                tracks={[VariantReferenceTrack]}
            ></GenomeBrowser>

            <div className="m-4 py-4 border-b border-primary">
                <h1 className="font-bold text-3xl">Select Tracks to Display</h1>
            </div>
            <Tabs tabs={tabItems} width="w-full" />
        </>
    );
}
