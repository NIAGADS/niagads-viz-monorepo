"use client";

import { CacheIdentifier, TableSection } from "@/lib/types";
import { Card, Skeleton } from "@niagads/ui";
import React, { Suspense } from "react";

import RecordTable from "./RecordTable";
import { Tabs } from "@niagads/ui/client";

export interface RecordTableSectionProps extends CacheIdentifier {
    tables: TableSection[];
}

export function RecordTableSection({ tables, ...cacheInfo }: RecordTableSectionProps) {
    return (
        <Tabs
            tabs={tables.map((t) => ({
                id: t.id,
                label: t.label,
                content: (
                    <Card variant="full" outline={false} style={{ marginBottom: "0px", padding: "0.5rem" }}>
                        <Suspense fallback={<Skeleton type="table" />}>
                            <RecordTable tableDef={t} {...cacheInfo} />
                        </Suspense>
                    </Card>
                ),
            }))}
            width="full"
        />
    );
}
