"use client";

import Table from "@niagads/table";
import { TABLE_DEFINITION } from "../tables/association-test-table";
import { Card, TextInput } from "@niagads/ui";
import { useEffect, useState } from "react";

const TablePlayground = () => {
    const [externalFilters, setExternalFilters] = useState<any[]>([]);
    const [filterOneValue, setFilterOneValue] = useState("");
    const [filterTwoValue, setFilterTwoValue] = useState("");

    useEffect(() => {
        const filters = [];
        if (filterOneValue) {
            filters.push({ id: "ref_snp_id", value: filterOneValue });
        }
        if (filterTwoValue) {
            filters.push({ id: "gene_consequence", value: filterTwoValue });
        }
        setExternalFilters(filters);
    }, [filterOneValue, filterTwoValue]);

    return (
        <div>
            <Card variant="full">
                <TextInput value={filterOneValue} onChange={(val) => setFilterOneValue(val)} />
                <TextInput value={filterTwoValue} onChange={(val) => setFilterTwoValue(val)} />
            </Card>
            <Table
                id="test-table"
                columns={TABLE_DEFINITION.columns}
                data={TABLE_DEFINITION.data}
                externalColumnFilters={externalFilters}
                onExternalFilterRemoved={(id) => {
                    if (id === "ref_snp_id") setFilterOneValue("");
                    if (id === "gene_consequence") setFilterTwoValue("");
                }}
            />
        </div>
    );
};

export default TablePlayground;
