"use client";

import React, { ReactElement, useState } from "react";
import { TablePagination, TableSection } from "@/lib/types";
import { APIPagination } from "@niagads/common";
import { Tabs, Tab, TabHeader, TabBody } from "@niagads/ui/client";
import styles from "./styles/record-table-section.module.css";
import { RecordTableProps } from "./RecordTable";

interface RecordTableSectionProps {
    tables: TableSection[];
    children: ReactElement<RecordTableProps>[];
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

const RecordTableSection = ({ tables, children }: RecordTableSectionProps) => {
    const [pagination, setPagination] = useState<TablePagination>({});

    return (
        <Tabs>
            {tables.map((table) => (
                <Tab key={table.id} id={table.id}>
                    <TabHeader>
                        <TabTitle label={table.label} pagination={pagination[table.id]} />
                    </TabHeader>
                    <TabBody>
                        {children.find(x => x.key === table.id)}
                    </TabBody>
                </Tab>
            ))}
        </Tabs>
    );
}

export default RecordTableSection;
