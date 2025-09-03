"use client";

import { CacheIdentifier, Pagination, TablePagination, TableSection } from "@/lib/types";
import { Card } from "@niagads/ui";
import React, { useState } from "react";

import RecordTable from "./RecordTable";
import { Tabs, Tab, TabHeader, TabBody } from "@niagads/ui/client";
import styles from "./styles/record-table-section.module.css";

interface RecordTableSectionProps extends CacheIdentifier {
    tables: TableSection[];
}

interface TabTitleProps {
    label: string;
    pagination?: Pagination;
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

const RecordTableSection = ({ tables, ...cacheInfo }: RecordTableSectionProps) => {
    const [pagination, setPagination] = useState<TablePagination>({});

    const handleTableLoad = (id: string) => (pagination: Pagination) => {
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
                            <RecordTable tableDef={table} {...cacheInfo} onTableLoad={handleTableLoad(table.id)} />
                        </Card>
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
}

export default RecordTableSection;
