"use client";

import { ExternalUrls } from "@/lib/reference";
import TableWrapper from "./TableWrapper";
import { GenericColumn, TableProps } from "@niagads/table";

const PathwayTable = ({ id, data, columns }: TableProps) => {
    const processedColumns: GenericColumn[] = columns.reduce((p, c) => {
        if (c.id === "pathway_id") {
            c.type = "link";
            c.header = "Accession";
        }

        return [...p, c];
    }, [] as GenericColumn[]);

    const processedData = data.map(row => {
        const processedRow: typeof row = {
            ...row,
            pathway_id: {
                value: row.pathway_id,
                url: _resolveUrl(row.pathway_source as string, row.pathway_id as string),
            },
        };

        return processedRow;
    });

    return (
        <TableWrapper id={id} data={processedData} columns={processedColumns} />
    );
}

const _resolveUrl = (source: string, id: string) => {
    const url = ExternalUrls[_urlMap[source]];
    return url + id;
}

const _urlMap: Record<string, string> = {
    "KEGG": "KEGG_PATHWAY_LINK_URL",
}

export default PathwayTable;
