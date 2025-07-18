"use client";

import { APITableResponse, TableSection } from "@/lib/types";
import { Card, Skeleton } from "@niagads/ui";
import React, { Suspense, useMemo } from "react";

import { EmptyTableMessage } from "./Messages";
import { InlineError } from "./InlineError";
import Table from "@niagads/table";
import { Tabs } from "@niagads/ui/client";

export interface TableTab {
    config: TableSection;
    data?: APITableResponse | null;
    error?: string | null;
}

interface TabbedTableGroupProps {
    tables: TableTab[];
}
const TabbedTableGroup = ({ tables }: TabbedTableGroupProps) => {
    const tabs = useMemo(
        () =>
            tables &&
            tables.map((t) => {
                const label = `${t.config.label} ${t.data ? "(" + t.data.pagination.total_num_records.toLocaleString() + ")" : ""}`;
                return {
                    id: t.config.id,
                    label: label,
                    content: (
                        <Card variant="full">
                            {t.error ? (
                                <InlineError message={t.error} reload={false} />
                            ) : t.data ? (
                                t.data.pagination.total_num_records === 0 ? (
                                    <EmptyTableMessage></EmptyTableMessage>
                                ) : (
                                    <Table
                                        id={t.config.id}
                                        columns={t.data.table.columns}
                                        data={t.data.table.data}
                                    ></Table>
                                )
                            ) : (
                                <InlineError message={"Oops! Something unexpected happened!"} reload={true} />
                            )}
                        </Card>
                    ),
                };
            }),
        [tables]
    );
    return (
        <Suspense fallback={<Skeleton type="table"></Skeleton>}>
            <Tabs tabs={tabs} width="full" />
        </Suspense>
    );
};

export default TabbedTableGroup;
