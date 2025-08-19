"use client";

import { prefixClientRoute } from "@/lib/utils";
import Table, { GenericColumn, TableConfig, TableProps } from "@niagads/table";

export default function AssociationTable({ id, data, columns }: TableProps) {
    const processedColumns: GenericColumn[] = columns.reduce((p, c) => {
        if (c.id === "relative_position") {
            c.colorMap = {
                "downstream": "green",
                "upstream": "red",
                "in gene": "blue",
            }
            p = [...p, c];
        }
        else if (c.id === "id") {
            c.type = "link";
            p = [...p, c];
        }
        else if (c.id === "track_id" || c.id === "study") {
            if (c.id === "track_id") {
                p = [...p, {
                    id: "track",
                    header: "Track",
                    type: "link",
                }];
            }
        }
        else {
            p = [...p, c];
        }

        return p;
    }, [] as GenericColumn[])

    const processedData = data.map(row => {
        const processedRow: typeof row = {
            ...row,
            id: {
                value: row.id,
                url: prefixClientRoute(`/record/variant/${row.id}`),
            },
            track: {
                value: row.study,
                url: prefixClientRoute(`/record/track/${row.track_id}`),
            }
        };

        delete processedRow.study;
        delete processedRow.track_id;

        return processedRow;
    });

    const defaultColumns = processedColumns.map((c, index) => {
        if (index < 8 || c["id"].startsWith("num_") || c["id"] === "url") return c["id"];
    }).filter(id => id !== undefined);

    const options: TableConfig = { disableColumnFilters: true, defaultColumns: defaultColumns };

    console.log(processedColumns);
    console.log(processedData);

    return (
        <Table id={id} data={processedData} columns={processedColumns} options={options} />
    );
}
