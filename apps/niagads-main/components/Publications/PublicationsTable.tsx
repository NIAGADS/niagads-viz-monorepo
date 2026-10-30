"use client";

import { TableCell, TableColumn } from "@niagads/table";
import Table from "@niagads/table";
import styles from "./publications-table.module.css";

export type PublicationRow = Record<string, TableCell | TableCell[]>;
export type PublicationsTableData = PublicationRow[];

const columns: TableColumn[] = [
    { id: "title", header: "Title", type: "link", required: true, disableColumnFilter: true },
    { id: "authors", header: "Authors", type: "text", disableColumnFilter: true },
    {
        id: "journal",
        header: "Journal",
        type: "text",
        styling: { getClassName: () => styles["journal-name"] },
        disableColumnFilter: true,
    },
    {
        id: "year",
        header: "Year",
        type: "integer",
        filterOpts: { filterType: "histogram" },
    },
    {
        id: "publicationType",
        header: "Publication type",
        type: "text",
        disableColumnFilter: true,
    },
    { id: "links", header: "Links", type: "link", disableColumnFilter: true, disableSorting: true },
    { id: "abstract", header: "Abstract", type: "text", disableColumnFilter: true },
    { id: "pmid", header: "PMID", type: "text", disableColumnFilter: true },
    { id: "doi", header: "DOI", type: "text", disableColumnFilter: true },
    { id: "pmcid", header: "PMCID", type: "text", disableColumnFilter: true },
    { id: "meshTerms", header: "MeSH terms", type: "text", filterOpts: { filterType: "topics" } },
    { id: "grants", header: "Grants", type: "text", disableColumnFilter: true },
];

interface PublicationsTableProps {
    id?: string;
    data: PublicationsTableData;
}

export const PublicationsTable = ({ data, id = "niagads-publications" }: PublicationsTableProps) => (
    <div className={styles["publications-table"]}>
        <Table
            id={id}
            columns={columns}
            data={data}
            options={{
                enableColumnFilters: false,
                enableExport: true,
                defaultColumns: ["title", "authors", "journal", "year", "links"],
                filterGroupOrder: ["Publication"],
            }}
        />
    </div>
);
