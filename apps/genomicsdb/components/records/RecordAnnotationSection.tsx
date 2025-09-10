"use server";

import { BaseRecord, RecordType, TableSection } from "@/lib/types";

import RecordSectionHeader from "./RecordAnnotationSectionHeader";
import RecordSectionUnderConstructionAlert from "./RecordSectionUnderConstructionAlert";
import RecordTableSection from "./RecordTableSection";
import { RECORD_PAGE_SECTIONS } from "@/data/sections";
import RecordTable from "./RecordTable";
import React, { Suspense } from "react";
import { LoadingSpinner } from "@niagads/ui";

const RecordAnnotationSection = async ({ id, record_type }: BaseRecord) => {
    const sections = RECORD_PAGE_SECTIONS[record_type];

    return (
        <div id={id}>
            {sections.map(section =>
                section.tables && (
                    <div id={section.id} key={section.id}>
                        <RecordSectionHeader
                            key={`${section.id}-header`}
                            title={section.label}
                            description={section.description}
                        ></RecordSectionHeader>
                        {section.underConstruction ? (
                            <RecordSectionUnderConstructionAlert section={section.label} />
                        ) : (
                            <Tables
                                sectionId={section.id}
                                recordId={id}
                                recordType={record_type}
                                tables={section.tables}
                            />
                        )}
                    </div>
                )
            )}
        </div>
    );
};

interface TablesProps {
    sectionId: string;
    recordId: string;
    recordType: RecordType;
    tables: TableSection[]
}

const Tables = async ({sectionId, recordId, recordType, tables}: TablesProps) => {
    return (
        <RecordTableSection
            key={`${sectionId}-tables`}
            tables={tables}
        >
            {tables.map(table => (
                <Suspense key={table.id} fallback={<LoadingSpinner />}>
                    <RecordTable 
                        tableDef={table}
                        recordId={recordId}
                        recordType={recordType}
                    />
                </Suspense>
            ))}
        </RecordTableSection>
    )
}

export default RecordAnnotationSection;
