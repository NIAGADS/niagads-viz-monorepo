"use client";

<<<<<<< HEAD
import { CacheIdentifier, Pagination, TablePagination, TableSection } from "@/lib/types";
import { Card } from "@niagads/ui";
import React, { useState } from "react";
=======
import { Card, Skeleton } from "@niagads/ui";
import React, { Suspense, useState } from "react";
import { RecordType, TablePagination, TableSection } from "@/lib/types";
>>>>>>> origin/main

import { APIPagination } from "@niagads/common";
import RecordTable from "./RecordTable";
import { Tabs, Tab, TabHeader, TabBody } from "@niagads/ui/client";
import styles from "./styles/record-table-section.module.css";

interface RecordTableSectionProps {
    recordId: string;
    recordType: RecordType;
    tables: TableSection[];
}

interface TabTitleProps {
    label: string;
    pagination?: APIPagination;
}

const TabTitle = ({ label, pagination }: TabTitleProps) => {
    return pagination ? (
        <div>
            {label} <span className={styles.badge}>{pagination.total_num_records}</span>
        </div>
    ) : (
        label
    );
};

const RecordTableSection = ({ tables, ...record }: RecordTableSectionProps) => {
    const [pagination, setPagination] = useState<TablePagination>({});

    const handleTableLoad = (id: string) => (pagination: APIPagination) => {
        setPagination((prev) => ({ ...prev, [id]: pagination }));
    };

    return (
        <Tabs width="full">
            {tables.map((table) => (
                <Tab id={table.id}>
                    <TabHeader>
                        <TabTitle key={`tab-label-${table.id}`} label={table.label} pagination={pagination[table.id]} />
                    </TabHeader>
                    <TabBody>
                        <Card
                            key={`tab-content-${table.id}`}
                            variant="full"
                            outline={false}
                            style={{ marginBottom: "0px", padding: "0.5rem" }}
                        >
                            <RecordTable tableDef={table} {...record} onTableLoad={handleTableLoad(table.id)} />
                        </Card>
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
}

export default RecordTableSection;
