// FIXME: see igvmicorservice @/config about the reference track config and add
// to DataProps to be passed to the component as these are application specific

// FIXME: switch to updated UI/Tabs implementation

// FIXME: remove tailwind class and switch to css.modules

import { Collection, CollectionMetadata, IGVBrowserTrack } from "./types/data_models";
import { TabDef, Tabs } from "@niagads/ui/client";
import { getLoadedTracks, getTrackConfig, loadTracks, removeTrackById } from "./tracks/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { _genomes } from "./config/_igvGenomes";

import { MemoIGVBrowser as GenomeBrowser } from "./IGVBrowser";
import { TableProps } from "@niagads/table";
import TrackSelectorTable from "./TrackSelectorTable";
import React from "react";

interface DataProps {
    metadata: CollectionMetadata;
    selector: TableProps[];
    config: IGVBrowserTrack[];
    collections: Collection[];
}

const IGVBrowserWithSelector = ({ metadata, selector, config, collections }: DataProps) => {
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
            {/* TODO: populate props properly */}
            <GenomeBrowser
                genome={""}
                featureSearchURI={""}
                onBrowserLoad={initializeBrowser}
                tracks={[]}
            />

            <div className="m-4 py-4 border-b border-primary">
                <h1 className="font-bold text-3xl">Select Tracks to Display</h1>
            </div>
            <Tabs tabs={tabItems} width="w-full" />
        </>
    );
}

export default IGVBrowserWithSelector;
