"use client";

import { AnchoredPageSection, RecordType, TableSection } from "@/lib/types";

import { Card } from "@niagads/ui";
import Placeholder from "./placeholder";
import { Tabs } from "@niagads/ui/client";

interface RecordTableSectionProps {
    record_id: string;
    record_type: RecordType;
    config: AnchoredPageSection;
}

export const RecordTableSection = ({ record_id, record_type, config }: RecordTableSectionProps) => {
    if (!config.tables) return null;

    const tabs = config.tables.map((table) => {
        return {
            id: table.id,
            label: table.label,
            content: (
                <Card variant="full">
                    <Placeholder type="table">
                        <div className="placeholder-text">
                            {table.description || "Table data will be displayed here"}
                        </div>
                    </Placeholder>
                </Card>
            ),
        };
    });

    return (
        <div id={config.id}>
            <Tabs width="full" tabs={tabs} />
        </div>
    );
};
