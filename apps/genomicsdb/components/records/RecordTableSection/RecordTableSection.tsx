"use client";

import React, { useState } from "react";
import { TablePagination, TableSection } from "@/lib/types";
import { APIPagination } from "@niagads/common";
import { Tabs, Tab, TabHeader, TabBody } from "@niagads/ui/client";
import { LoadingSpinner } from "@niagads/ui";
import RecordTable from "../RecordTable";

import styles from "./record-table-section.module.css";

interface RecordTableSectionProps {
    tables: TableSection[];
    recordId: string;
    recordType: string;
    // Controlled tab state driven by sidebar selection; undefined lets Tabs manage its own default
    selectedTab?: string;
    onTabChange?: (tableId: string) => void;
    // New — notifies parent when a table's record count is known
    onTableLoad?: (tableId: string, count: number) => void;

}

const RecordTableSection = ({ tables, recordId, recordType, selectedTab, onTabChange, onTableLoad }: RecordTableSectionProps) => {
    const [pagination, setPagination] = useState<TablePagination>({});

    return (
        <Tabs 
            selectedTab={selectedTab}
            onTabChange={onTabChange}
        >
            {tables.map((table) => (
                <Tab key={table.id} id={table.id}>
                    <TabHeader>
                        <TabTitle label={table.label} pagination={pagination[table.id]} />
                    </TabHeader>
                    <TabBody>
                        <RecordTable
                            tableDef={table}
                            recordId={recordId}
                            recordType={recordType}
                            onTableLoad={(p) => {
                                setPagination((prev) => ({ ...prev, [table.id]: p }));
                                onTableLoad?.(table.id, p.total_num_records);
                            }}
                        />
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
};

interface TabTitleProps {
    label: string;
    pagination?: APIPagination;
}

const TabTitle = ({ label, pagination }: TabTitleProps) => {
    return (
        <div className="flex">
            {label}
            {pagination ? (
                <span className={styles.badge}>{pagination.total_num_records}</span>
            ) : (
                <span className={styles.tab_header_spinner}>
                    <LoadingSpinner message="" size="sm" />
                </span>
            )}
        </div>
    );
};

export default RecordTableSection;
