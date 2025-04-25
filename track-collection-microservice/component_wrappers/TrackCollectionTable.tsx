"use client";

import React, { cache, useEffect, useState } from "react";
import Table from "@niagads/table";
import { Collection } from "@/common/types";
import { Skeleton } from "@niagads/ui";

import "@niagads/table/css";

const DEFAULT_COLUMNS = [
    "track_id",
    "name",
    "feature_type",
    "study_name",
    "biosample_term",
    "number_of_intervals",
    "bp_covered",
];

type RESPONSE_TYPE = "collection-listing" | "track-listing";

const fetchCollectionInformation = cache(async (collection: Collection, responseType: RESPONSE_TYPE) => {
    const queryString =
        responseType === "collection-listing" ? `?${collection.name}` : `/${collection.name}?view=table`;
    const requestUrl = `/api/${collection.route}/collection${queryString}`;
    let data = null;
    try {
        const response: any = await fetch(requestUrl);
        if (response.ok) {
            data = await response.json();
            data = data.response;
        } else {
            throw new Error(`Error fetching collection ${collection}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        return data;
    }
});

// TODO: error handling
const fetchCollectionMetadata = cache(async (collection: Collection) => {
    const response: any = await fetchCollectionInformation(collection, "collection-listing");
    const match = response.find((c: any) => c.name.toLowerCase() == collection.name.toLowerCase());
    Object.assign(collection, {
        label: match.name,
        description: match.description,
    });
    return collection;
});

const fetchTableData = cache(async (collection: Collection) => {
    const response: any = await fetchCollectionInformation(collection, "track-listing");
    // create the track link outs
    for (const c of response.columns) {
        if (c.id == "track_id") {
            Object.assign(c, { type: "link" });
        }
    }
    for (const t of response.data) {
        Object.assign(t, {
            track_id: {
                value: t.track_id,
                type: "link",
                url: `track/${t.track_id}`,
                tooltip: "Explore the track data",
            },
        });
    }
    return response;
});

interface Row {
    [k: string]: any;
}
interface TableProps {
    id: string;
    data: Row[];
    columns: any;
    options: any;
}

/* 
    //if server component: 
    async function TrackTable() {
    const [route, name] = process.env.NEXT_PUBLIC_TRACK_COLLECTION!.split(":");
    const collection = await fetchCollectionMetadata({
        route: route,
        name: name,
    } as Collection);
    const trackTable = await fetchTableData(
        collection
    );
*/

function TrackCollectionTable() {
    const [loading, setLoading] = useState<boolean>(true);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [table, setTable] = useState<TableProps | null>(null);

    useEffect(() => {
        try {
            const [route, name] = process.env.NEXT_PUBLIC_TRACK_COLLECTION!.split(":");
            fetchCollectionMetadata({
                route: route,
                name: name,
            } as Collection).then((result) => setCollection(result));
        } catch (err) {
            console.error(
                "Error parsing track collections; NEXT_PUBLIC_TRACK_COLLECTION (set in application .env file);   an API route:collection_name pair."
            );
        }
    }, []);

    useEffect(() => {
        collection && fetchTableData(collection).then((result) => setTable(result));
    }, [collection]);

    useEffect(() => {
        if (table) {
            table.options.defaultColumns = DEFAULT_COLUMNS;
            table.options.disableColumnFilters = true; // FIXME: remove when column filters work
            setLoading(false);
        }
    }, [table]);

    return !loading ? (
        <Table data={table!.data} columns={table!.columns} id={table!.id} options={table!.options} />
    ) : (
        <Skeleton type="table" />
    );
}

export default TrackCollectionTable;
