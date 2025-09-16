"use client";

import { BaseRecord, RecordType, TableSection } from "@/lib/types";

import RecordSectionHeader from "./RecordAnnotationSectionHeader";
import RecordSectionUnderConstructionAlert from "./RecordSectionUnderConstructionAlert";
import RecordTableSection from "./RecordTableSection";
import { RECORD_PAGE_SECTIONS } from "@/data/sections";
import RecordTable from "./RecordTable-Server";
import RecordTableClient from "./RecordTable";
import React, { Suspense } from "react";
import { LoadingSpinner } from "@niagads/ui";

const RecordAnnotationSection = ({ id, record_type }: BaseRecord) => {
    const sections = RECORD_PAGE_SECTIONS[record_type];

    return (
        <div id={id}>
            {sections.map(
                (section) =>
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
                                <RecordTableSection recordId={id} recordType={record_type} tables={section.tables} />
                            )}
                        </div>
                    )
            )}
        </div>
    );
};

export default RecordAnnotationSection;
