"use client";

import Table from "@niagads/table";
import { Tab, TabBody, TabHeader, Tabs } from "@niagads/ui/client";
import { useState } from "react";

interface SearchResultsProps {
    searchResults: Record<string, any>;
}

const SearchResults = ({ searchResults }: SearchResultsProps) => {
    const [selectedTab, setSelectedTab] = useState("datasets");

    return (
        <div>
            <Tabs selectedTab={selectedTab} onTabChange={(id) => setSelectedTab(id)}>
                <Tab id="datasets">
                    <TabHeader>Datasets</TabHeader>
                    <TabBody>
                        <Table
                            id="datasets_results"
                            columns={searchResults.datasets.columns}
                            data={searchResults.datasets.columns}
                        />
                    </TabBody>
                </Tab>
                <Tab id="genes">
                    <TabHeader>Genes</TabHeader>
                    <TabBody>
                        <Table
                            id="genes_results"
                            columns={searchResults.genes.columns}
                            data={searchResults.genes.data}
                        />
                    </TabBody>
                </Tab>
            </Tabs>
        </div>
    );
};

export default SearchResults;
