"use client";

import Table from "@niagads/table";
import { TABLE_DEFINITION } from "../tables/association-test-table";
import { Card, TextInput } from "@niagads/ui";
import { useEffect, useMemo, useState } from "react";
import { PieChart, PieChartDataRow } from "@niagads/charts";

const TablePlayground = () => {
    const [externalFilters, setExternalFilters] = useState<any[]>([]);
    const [filterOneValue, setFilterOneValue] = useState("");
    const [filterTwoValue, setFilterTwoValue] = useState("");

    const populationData = useMemo(() => {
        return TABLE_DEFINITION.data.reduce((prev, curr) => {
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
    }, [TABLE_DEFINITION]);

    useEffect(() => {
        const filters = [];
        if (filterOneValue) {
            filters.push({ id: "population", value: filterOneValue });
        }
        if (filterTwoValue) {
            filters.push({ id: "gene_consequence", value: filterTwoValue });
        }
        setExternalFilters(filters);
    }, [filterOneValue, filterTwoValue]);

    return (
        <div>
            <Card variant="full">
                <PieChart id="pop-chart-test" data={populationData} onClick={(val) => setFilterOneValue(val)} />
                <TextInput value={filterTwoValue} onChange={(val) => setFilterTwoValue(val)} />
            </Card>
            <Table
                id="test-table"
                columns={TABLE_DEFINITION.columns}
                data={TABLE_DEFINITION.data}
                externalColumnFilters={externalFilters}
                onExternalFilterRemoved={(id) => {
                    if (id === "population") setFilterOneValue("");
                    if (id === "gene_consequence") setFilterTwoValue("");
                }}
            />
        </div>
    );
};

export default TablePlayground;
