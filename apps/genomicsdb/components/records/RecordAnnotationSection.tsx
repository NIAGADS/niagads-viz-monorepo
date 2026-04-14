"use client";

import { AnchoredPageSection, RecordType } from "@/lib/types";
import RecordSectionUnderConstructionAlert from "./RecordSectionUnderConstructionAlert";
import RecordTableSection from "./RecordTableSection";
import React from "react";

import styles from "./styles/record.module.css";

interface RecordAnnotationSectionProps {
    id: string;
    recordType: RecordType;
    sections: AnchoredPageSection[];
}

const RecordAnnotationSection = ({ id, recordType, sections }: RecordAnnotationSectionProps) => {
    return (
        <div id={id} className="">
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
                            <RecordTableSection recordId={id} recordType={recordType} tables={section.tables} />
                        )}
                    </div>
                )
            )}
        </div>
    );
};

interface RecordSectionHeaderProps {
    title: string;
    description: string | React.ReactNode;
}

const RecordSectionHeader = ({ title, description }: RecordSectionHeaderProps) => {
    return (
        <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>{title}</div>
            <div className={styles.sectionDescription}>
                {typeof description === "string" ? <div>{description}</div> : description}
            </div>
        </div>
    );
};

export default RecordAnnotationSection;
