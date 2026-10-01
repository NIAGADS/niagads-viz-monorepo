"use client";

import { TableCell, TableColumn } from "@niagads/table";

import Table from "@niagads/table";

export type PublicationRow = Record<string, TableCell | TableCell[]>;
export type PublicationsTableData = PublicationRow[];

const columns: TableColumn[] = [
    { id: "title", header: "Title", type: "link", required: true, disableColumnFilter: true },
    { id: "authors", header: "Authors", type: "text", disableColumnFilter: true },
    {
        id: "year",
        header: "Year",
        type: "integer",
        filterOpts: { filterType: "histogram", filterGroup: "Publication" },
    },
    { id: "journal", header: "Journal", type: "text", disableColumnFilter: true },
    {
        id: "publicationType",
        header: "Publication type",
        type: "text",
        filterOpts: { filterType: "multiselect", filterGroup: "Publication" },
    },
    { id: "links", header: "Links", type: "link", disableColumnFilter: true, disableSorting: true },
    { id: "abstract", header: "Abstract", type: "text", disableColumnFilter: true },
    { id: "pmid", header: "PMID", type: "text", disableColumnFilter: true },
    { id: "doi", header: "DOI", type: "text", disableColumnFilter: true },
    { id: "pmcid", header: "PMCID", type: "text", disableColumnFilter: true },
    { id: "meshTerms", header: "MeSH terms", type: "text", disableColumnFilter: true },
    { id: "grants", header: "Grants", type: "text", disableColumnFilter: true },
];

interface PublicationsTableProps {
    id?: string;
    data: PublicationsTableData;
}

export const PublicationsTable = ({ data, id = "niagads-publications" }: PublicationsTableProps) => (
    <Table
        id={id}
        columns={columns}
        data={data}
        options={{
            enableColumnFilters: false,
            enableExport: true,
            defaultColumns: ["title", "authors", "year", "journal", "links"],
            filterGroupOrder: ["Publication"],
        }}
    />
);
