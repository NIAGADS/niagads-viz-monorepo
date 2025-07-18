"use client";

import { Card, Skeleton } from "@niagads/ui";
import { Pagination, TableSection } from "@/lib/types";
import React, { Suspense, useMemo } from "react";
import Table, { TableProps } from "@niagads/table";

import { EmptyTableMessage } from "./Messages";
import { InlineError } from "./InlineError";
import { Tabs } from "@niagads/ui/client";

export interface TableTab {
    config: TableSection;
    pagination?: Pagination;
    table?: TableProps | null;
    error?: string | null;
}

interface TableSetTabsProps {
    tableSet: TableTab[];
}
const TableSetTabs = ({ tableSet }: TableSetTabsProps) => {
    const renderTabContents = (tabDef: TableTab) => {
        if (tabDef.error) {
            return <InlineError message={tabDef.error} reload={false} />;
        }

        if (tabDef.table && tabDef.pagination?.total_num_records === 0) {
            return <EmptyTableMessage></EmptyTableMessage>;
        }

        if (tabDef.table) {
            return <Table id={tabDef.config.id} columns={tabDef.table.columns} data={tabDef.table.data}></Table>;
        }

        return <InlineError message={"Oops! Something unexpected happened!"} reload={true} />;
    };

    const tabs = useMemo(
        () =>
            tableSet &&
            tableSet.map((t) => {
                const label =
                    t.pagination && t.table
                        ? `${t.config.label} ( ${t.pagination.total_num_records.toLocaleString()})`
                        : t.config.label;

                return {
                    id: t.config.id,
                    label: label,
                    content: <Card variant="full">{renderTabContents(t)}</Card>,
                };
            }),
        [tableSet]
    );
    return (
        <Suspense fallback={<Skeleton type="table"></Skeleton>}>
            <Tabs tabs={tabs} width="full" />
        </Suspense>
    );
};

export default TableSetTabs;
