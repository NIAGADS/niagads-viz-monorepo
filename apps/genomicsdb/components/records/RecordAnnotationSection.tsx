"use client";

import { AnchoredPageSection, RecordType } from "@/lib/types";
import RecordSectionUnderConstructionAlert from "./RecordSectionUnderConstructionAlert";
import RecordTableSection from "./RecordTableSection";
import React, { RefObject } from "react";

import styles from "./styles/record-annotation-section.module.css";

interface RecordAnnotationSectionProps {
    id: string;
    recordType: RecordType;
    sections: AnchoredPageSection[];
    sectionRefs: Record<string, RefObject<HTMLElement>>;
}

const RecordAnnotationSection = ({ id, recordType, sections, sectionRefs }: RecordAnnotationSectionProps) => {
    return (
        <div id={id} className={styles["annotation-container"]}>
            {sections.map(section =>
                section.tables ? (
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
                ) : (
                    <span ref={sectionRefs[section.id]}>{section.label}</span>
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
