"use client";

import { CacheIdentifier, Pagination, TablePagination, TableSection } from "@/lib/types";
import { Card, Skeleton } from "@niagads/ui";
import React, { Suspense, useState } from "react";

import RecordTable from "./RecordTable";
import { Tabs, Tab } from "@niagads/ui/client";
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

const RecordTableSection = ({ tables, ...cacheInfo }: RecordTableSectionProps) => {
    const [pagination, setPagination] = useState<TablePagination>({});

    const handleTableLoad = (id: string) => (pagination: Pagination) => {
        setPagination((prev) => ({ ...prev, [id]: pagination }));
    };

    return (
        <Tabs width="full" >
            {tables.map(table => (
                <Tab
                    id={table.id}
                    title={<TabHeader key={`tab-label-${table.id}`} label={table.label} pagination={pagination[table.id]} />}
                >
                    <Card
                        key={`tab-content-${table.id}`}
                        variant="full"
                        outline={false}
                        style={{ marginBottom: "0px", padding: "0.5rem" }}
                    >
                        <RecordTable tableDef={table} {...cacheInfo} onTableLoad={handleTableLoad(table.id)} />
                    </Card>
                </Tab>
            ))}
        </Tabs>
    );
}

export default RecordTableSection;
