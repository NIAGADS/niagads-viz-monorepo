"use client";

import { Alert } from "@niagads/ui";
import { Tab, TabBody, TabHeader, Tabs } from "@niagads/ui/client";
import { useState } from "react";
import { PublicationsTable, PublicationsTableData } from "./PublicationsTable";

export interface PublicationCollectionResult {
    id: string;
    data: PublicationsTableData;
    error?: string;
}

interface PublicationsTabsProps {
    collections: PublicationCollectionResult[];
}

export const PublicationsTabs = ({ collections }: PublicationsTabsProps) => {
    const [selectedTab, setSelectedTab] = useState(collections[0].id);

    return (
        <Tabs selectedTab={selectedTab} onTabChange={setSelectedTab}>
            {collections.map((collection) => (
                <Tab id={collection.id} key={collection.id}>
                    <TabHeader>Collection {collection.id}</TabHeader>
                    <TabBody>
                        {collection.error ? (
                            <Alert variant="error" message={`Collection ${collection.id} is currently unavailable.`}>
                                {collection.error}
                            </Alert>
                        ) : (
                            <PublicationsTable id={`niagads-publications-${collection.id}`} data={collection.data} />
                        )}
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
};
