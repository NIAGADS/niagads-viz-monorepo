"use client";

import { AnchoredPageSection, RecordType, TableSection } from "@/lib/types";

import { Card } from "@niagads/ui";
import { InlineError } from "../InlineError";
import Table from "@niagads/table";
import { Tabs } from "@niagads/ui/client";

interface Props {
    record_id: string;
    record_type: RecordType;
    section_id: string;
    tables: TableSection[];
}

export const RecordTableSectionClient = ({ record_id, record_type, section_id, tables }: Props) => {
    if (!tables) return null;

    const tabs = tables.map((item) => {
        return {
            id: item.id,
            label: item.label,
            content: (
                <Card variant="full">
                    {item.error ? (
                        <InlineError message={item.error} />
                    ) : (
                        <Table id={item.id} columns={item!.data!.table.columns} data={item!.data!.table.data}></Table>
                    )}
                </Card>
            ),
        };
    });

    return (
        <div id={`table-section-${section_id}`}>
            <Tabs width="full" tabs={tabs} />
        </div>
    );
};
