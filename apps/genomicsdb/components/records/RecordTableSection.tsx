"use client";

import React, { useState } from "react";
import { TablePagination, TableSection } from "@/lib/types";
import { APIPagination } from "@niagads/common";
import { Tabs, Tab, TabHeader, TabBody } from "@niagads/ui/client";
import styles from "./styles/record-table-section.module.css";
import RecordTable from "./RecordTable";

interface RecordTableSectionProps {
    tables: TableSection[];
    recordId: string;
    recordType: string;
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

const RecordTableSection = ({ tables, recordId, recordType }: RecordTableSectionProps) => {
    const [pagination, setPagination] = useState<TablePagination>({});

    return (
        <Tabs>
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
                            onTableLoad={(p) => setPagination(prev => ({...prev, [table.id]: p}))}
                        />
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
}

export default RecordTableSection;
