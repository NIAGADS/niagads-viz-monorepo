"use client";

import { Alert, LoadingSpinner } from "@niagads/ui";
import { PublicationsTable, PublicationsTableData } from "./PublicationsTable";
import { Tab, TabBody, TabHeader, Tabs } from "@niagads/ui/client";

import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";

export interface PublicationCollection {
    id: string;
    name: string;
}

interface PublicationsTabsProps {
    collections: PublicationCollection[];
}

const fetchCollection = async (url: string): Promise<PublicationsTableData> => {
    const response = await fetch(url);
    const body = await response.json();

    if (!response.ok) throw new Error(body.error || "Unable to load this collection.");
    return body;
};

const collectionUrl = (collectionId: string) => `/api/publications/${encodeURIComponent(collectionId)}`;
const swrOptions = { shouldRetryOnError: false, revalidateOnFocus: false };

const CollectionTable = ({
    collection,
    onTableLoad,
}: {
    collection: PublicationCollection;
    onTableLoad: (collectionId: string, count: number) => void;
}) => {
    const { data, error, isLoading } = useSWR<PublicationsTableData>(
        collectionUrl(collection.id),
        fetchCollection,
        swrOptions
    );

    useEffect(() => {
        if (data && !isLoading) onTableLoad(collection.id, data.length);
    }, [data, isLoading, collection.id, onTableLoad]);

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <Alert variant="error" message={`${collection.name} is currently unavailable.`}>
                {error.message}
            </Alert>
        );
    }

    return <PublicationsTable id={`niagads-publications-${collection.id}`} data={data || []} />;
};

export const PublicationsTabs = ({ collections }: PublicationsTabsProps) => {
    const [selectedTab, setSelectedTab] = useState(collections[0].id);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const onTableLoad = useCallback((collectionId: string, count: number) => {
        setCounts((previous) => (previous[collectionId] === count ? previous : { ...previous, [collectionId]: count }));
    }, []);

    return (
        <Tabs selectedTab={selectedTab} onTabChange={setSelectedTab}>
            {collections.map((collection) => (
                <Tab id={collection.id} key={collection.id}>
                    <TabHeader>
                        {counts[collection.id] !== undefined
                            ? `${collection.name} (${counts[collection.id]})`
                            : collection.name}
                    </TabHeader>
                    <TabBody>
                        <CollectionTable collection={collection} onTableLoad={onTableLoad} />
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
};
