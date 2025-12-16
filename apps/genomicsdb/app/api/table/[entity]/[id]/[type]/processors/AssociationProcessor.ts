import { APITableResponse } from "@/lib/types";
import { prefixClientRoute } from "@/lib/utils";
import { GenericColumn } from "@niagads/table";

const AssociationProcessor = (rawTable: APITableResponse) => {
    const processedColumns: GenericColumn[] = rawTable.table.columns.reduce((p, c) => {
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

    const processedData = rawTable.table.data.map(row => {
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

    return {...rawTable, columns: processedColumns, data: processedData }
}

export default AssociationProcessor;
