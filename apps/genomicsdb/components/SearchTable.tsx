"use client";

import { SearchResult } from "@/lib/types";
import Table, { GenericColumn } from "@niagads/table";

interface SearchTableProps {
    searchResults: SearchResult[];
}

export const SearchTable = ({ searchResults }: SearchTableProps) => {
    const tableData = searchResults.map((result) => ({
        id: result.id,
        display: result.display,
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
        id: "id",
        header: "ID",
    },
    {
        id: "display",
        header: "Display Name",
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
