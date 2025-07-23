"use client";

import { CacheIdentifier, Pagination, TablePagination, TableSection } from "@/lib/types";
import { Card, Skeleton } from "@niagads/ui";
import React, { Suspense, useState } from "react";

import RecordTable from "./RecordTable";
import { Tabs } from "@niagads/ui/client";
import styles from "./styles/record-table-section.module.css";

interface RecordTableSectionProps extends CacheIdentifier {
    tables: TableSection[];
}

interface TabHeaderProps {
    label: string;
    pagination?: Pagination;
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

export function RecordTableSection({ tables, ...cacheInfo }: RecordTableSectionProps) {
    const [paginations, setPaginations] = useState<TablePagination>({});

    const handleTableLoad = (id: string) => (pagination: Pagination) => {
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
                        <RecordTable tableDef={t} {...cacheInfo} onTableLoad={handleTableLoad(t.id)} />
                    </Card>
                ),
            }))}
            width="full"
        />
    );
}
