"use client";

import { Card, Skeleton } from "@niagads/ui";
import React, { Suspense, useState } from "react";
import { RecordType, TablePagination, TableSection } from "@/lib/types";

import { APIPagination } from "@niagads/common";
import RecordTable from "./RecordTable";
import { Tabs } from "@niagads/ui/client";
import styles from "./styles/record-table-section.module.css";

interface RecordTableSectionProps {
    recordId: string;
    recordType: RecordType;
    tables: TableSection[];
}

interface TabHeaderProps {
    label: string;
    pagination?: APIPagination;
}

const TabHeader = ({ label, pagination }: TabHeaderProps) => {
    return pagination ? (
        <div>
            {label} <span className={styles.badge}>{pagination.total_num_records}</span>
        </div>
    ) : (
        label
    );
};

const RecordTableSection = ({ tables, ...record }: RecordTableSectionProps) => {
    const [paginations, setPaginations] = useState<TablePagination>({});

    const handleTableLoad = (id: string) => (pagination: APIPagination) => {
        setPaginations((prev) => ({ ...prev, [id]: pagination }));
    };
    return (
        <Tabs
            tabs={tables.map((t) => ({
                id: t.id,
                label: <TabHeader key={`tab-label-${t.id}`} label={t.label} pagination={paginations[t.id]} />,
                content: (
                    <Card
                        key={`tab-content-${t.id}`}
                        variant="full"
                        outline={false}
                        style={{ marginBottom: "0px", padding: "0.5rem" }}
                    >
                        <RecordTable tableDef={t} {...record} onTableLoad={handleTableLoad(t.id)} />
                    </Card>
                ),
            }))}
            width="full"
        />
    );
};

export default RecordTableSection;
