"use client";

import { AnchoredPageSection, RecordType } from "@/lib/types";
import RecordSectionUnderConstructionAlert from "../RecordSectionUnderConstructionAlert";
import RecordTableSection from "../RecordTableSection/RecordTableSection";
import React, { RefObject } from "react";
import { CollapsibleSection } from "@niagads/ui/client";

import styles from "./record-annotation-section.module.css";

interface RecordAnnotationSectionProps {
    id: string;
    recordType: RecordType;
    sections: AnchoredPageSection[];
    sectionRefs: any;
}

const RecordAnnotationSection = ({ id, recordType, sections, sectionRefs }: RecordAnnotationSectionProps) => {
    return (
        <div id={id} className={styles["annotation-container"]}>
            {sections.map((section) => (
                <CollapsibleSection key={section.id} ref={sectionRefs[section.id]} id={section.id} title={section.label}>
                    {section.tables ? (
                        section.underConstruction ? (
                            <RecordSectionUnderConstructionAlert section={section.label} />
                        ) : (
                            <RecordTableSection recordId={id} recordType={recordType} tables={section.tables} />
                        )
                    ) : (
                        <span ref={sectionRefs[section.id]}>{section.label}</span>
                    )}
                </CollapsibleSection>
            ))}
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
