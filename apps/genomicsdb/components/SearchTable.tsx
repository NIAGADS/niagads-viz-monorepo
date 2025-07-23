"use client";

import { SearchResult } from "@/lib/types";
import { prefixClientRoute } from "@/lib/utils";
import Table, { GenericColumn } from "@niagads/table";

interface SearchTableProps {
    searchResults: SearchResult[];
}

export const SearchTable = ({ searchResults }: SearchTableProps) => {
    const tableData = searchResults.map((result) => ({
        display: {
            value: result.display,
            url: prefixClientRoute(`/record/${result.record_type}/${result.id}`),
        },
        type: result.record_type,
        description: result.description,
    }));

    return (
        <div className="table-container">
            <Table id={"search-results"} columns={tableColumns} data={tableData} />
        </div>
    );
};

const tableColumns: GenericColumn[] = [
    {
        id: "display",
        header: "Record ID",
        type: "link",
        required: true,
    },
    {
        id: "type",
        header: "Record Type",
        canFilter: true,
    },
    {
        id: "description",
        header: "Description",
    },
];
