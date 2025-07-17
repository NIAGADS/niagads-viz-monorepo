"use client";
import React, { Suspense, useMemo } from "react";
import { AnchoredPageSection, TableSection } from "@/lib/types";

import { Card, Skeleton } from "@niagads/ui";
import { InlineError } from "../InlineError";
import Table from "@niagads/table";
import { Tabs } from "@niagads/ui/client";
import { EmptyTableMessage } from "../Messages";
import { RecordSectionHeader } from "./RecordSectionHeader";

interface RecordTableSectionClientProps {
    section: AnchoredPageSection;
    tables: TableSection[];
}

export const RecordTableSectionClient = ({ section, tables }: RecordTableSectionClientProps) => {
    if (!tables) return null;

    const tabs = useMemo(
        () =>
            tables.map((item) => {
                const label = `${item.label} ${item.data ? "(" + item.data.pagination.total_num_records.toLocaleString() + ")" : ""}`;
                return {
                    id: item.id,
                    label: label,
                    content: (
                        <Card variant="full">
                            {item.error ? (
                                <InlineError message={item.error} reload={false} />
                            ) : item.data ? (
                                item.data.pagination.total_num_records === 0 ? (
                                    <EmptyTableMessage></EmptyTableMessage>
                                ) : (
                                    <Table
                                        id={item.id}
                                        columns={item.data.table.columns}
                                        data={item.data.table.data}
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
        <div id={section.id}>
            <RecordSectionHeader title={section.label} description={section.description}></RecordSectionHeader>
            <Suspense fallback={<Skeleton type="table" />}>
                <Tabs width="full" tabs={tabs} />
            </Suspense>
        </div>
    );
};
