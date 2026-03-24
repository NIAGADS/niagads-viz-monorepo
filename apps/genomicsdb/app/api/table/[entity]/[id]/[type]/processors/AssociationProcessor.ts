"use server";

import { APITableResponse } from "@/lib/types";
import { prefixClientRoute } from "@/lib/utils";
import { PieChartDataRow } from "@niagads/charts";
import { GenericColumn } from "@niagads/table";

const AssociationProcessor = (rawTable: APITableResponse) => {
    // process existing columns
    const processedColumns: GenericColumn[] = rawTable.table.columns.reduce((p, c) => {
        if (c.id === "relative_position") {
            c.format = { ...c.format };
            c.format.colorMap = {
                downstream: "green",
                upstream: "red",
                "in gene": "blue",
            };
        }
        if (c.id === "id") {
            c.type = "link";
        } 
        if (c.id === "track_id") {
            c.header = "Track";
            c.type = "link";
        } 
        if (c.id === "neg_log10_pvalue") {
            c.canFilter = true;
            c.filterType = "external";
        }
        if (c.id === "population") {
            c.canFilter = true;
            c.filterType = "external";
        }
        if (c.id === "is_adsp_variant") {
            c.canFilter = true;
            c.filterType = "internal";
        }
        if (c.id === "impact") {
            c.canFilter = true;
            c.filterType = "internal";
        }
        if (c.id === "impact") {
            c.canFilter = true;
            c.filterType = "internal";
        }

        return [...p, c];
    }, [] as GenericColumn[])

    // process / add data as needed
    const processedData = rawTable.table.data.map((row) => {
        const processedRow: typeof row = {
            ...row,
            id: {
                value: row.id,
                url: prefixClientRoute(`/record/variant/${row.id}`),
            },
            track_id: {
                value: row.study,
                url: prefixClientRoute(`/record/track/${row.track_id}`),
            },
        };

        return processedRow;
    });


    const populationData = rawTable.table.data.reduce((prev, curr) => {
        const pop = curr.population?.valueOf() as string;
        const i = prev.findIndex((x) => x.id === pop);
        if (i !== -1) {
            prev[i].value += 1;
            return prev;
        }

        return [
            ...prev,
            {
                id: pop,
                label: pop,
                value: 1,
            },
        ];
    }, [] as PieChartDataRow[]);

    return { 
        pagination: rawTable.pagination, 
        table: {
            columns: processedColumns,
            data: processedData,
        },
        extraData: {
            populationData: populationData,
            negLog10PValues: rawTable.table.data.map(x => x.neg_log10_pvalue)
        }
    };
};

export default AssociationProcessor;
