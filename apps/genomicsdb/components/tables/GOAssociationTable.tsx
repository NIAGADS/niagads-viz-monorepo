"use client";

import { GenericColumn, TableProps } from "@niagads/table";
import TableWrapper from "./TableWrapper";

const GOAssociationTable = ({ id, data, columns }: TableProps) => {
    const processedColumns: GenericColumn[] = columns.reduce((p, c) => {
        if (c.id === "go_term_id") {
            c.header = "GO Accession";
            c.type = "link";
            p = [...p, c];
        }
        else {
            p = [...p, c];
        }

        return p;
    }, [] as GenericColumn[])

    const processedData = data.map(row => {
        const go_id = row.go_term_id?.toString().replace('_', ':');

        const processedRow: typeof row = {
            ...row,
            go_term_id: {
                value: go_id,
                url: `https://amigo.geneontology.org/amigo/term/${go_id}#display-lineage-tab`
            },
            go_term: {
                value: row.go_term,
                tooltip: _resolveTermTooltip(row.go_term as string),
            }
        };

        return processedRow;
    });

    return (
        <TableWrapper id={id} data={processedData} columns={processedColumns} />
    );
}

const _resolveTermTooltip = (term: string) => {
    return _tooltipMap[term] || "";
};

const _tooltipMap: Record<string, string> = {
    "AMPA glutamate receptor clustering": ""
};

export default GOAssociationTable;
