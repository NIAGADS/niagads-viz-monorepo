"use client";

import { AnchoredPageSection, RecordType } from "@/lib/types";
import RecordSectionUnderConstructionAlert from "../RecordSectionUnderConstructionAlert";
import RecordTableSection from "../RecordTableSection/RecordTableSection";
import React, { RefObject, createRef, useMemo, useEffect } from "react";
import { CollapsibleSection } from "@niagads/ui/client";

import styles from "./record-annotation-section.module.css";

interface RecordAnnotationSectionProps {
    id: string;
    recordType: RecordType;
    sections: AnchoredPageSection[];
    // sectionRefs removed — refs are now created locally since RecordPage
    // doesn't need to know about them; CollapsibleSection still requires ref,
    // so we own that here, closest to where they're consumed
    activeTabs: Record<string, string>;
    onTabChange: (sectionId: string, tableId: string) => void;
    // Drives imperative open — seq ensures effect fires even for repeated same sectionId
    openRequest: { sectionId: string; seq: number } | null;
    onTableLoad?: (tableId: string, count: number) => void;
}

const RecordAnnotationSection = ({
    id,
    recordType,
    sections,
    activeTabs,
    onTabChange,
    openRequest,
    onTableLoad,
}: RecordAnnotationSectionProps) => {
    // Moved from RecordPage — refs belong here since only CollapsibleSection uses them
    const sectionRefs = useMemo(
        () =>
            sections.reduce(
                (prev, section) => ({
                    ...prev,
                    [section.id]: createRef<HTMLDivElement>() as RefObject<HTMLDivElement>,
                }),
                {} as Record<string, RefObject<HTMLDivElement>>
            ),
        [sections]
    );

    useEffect(() => {
        if (!openRequest) return;
        const el = sectionRefs[openRequest.sectionId]?.current;
        if (!el) return;

        // CollapsibleSection root: first child is header, second is the collapsible body.
        // Check max-height via getComputedStyle — reliable regardless of CSS module class names.
        const body = el.children[1] as HTMLElement;
        if (!body) return;

        const isOpen = parseInt(getComputedStyle(body).maxHeight) > 0;
        if (!isOpen) {
            // Click the header to open — only fires when section is genuinely closed
            const header = el.children[0] as HTMLElement;
            header?.click();
        }
    }, [openRequest]);

    const defaultSectionId = sections.find((s) => s.tables && s.tables.length > 0 && !s.underConstruction)?.id;

    return (
        <div id={id} className={styles["annotation-container"]}>
            {sections.map((section) => (
                <CollapsibleSection
                    key={section.id}
                    ref={sectionRefs[section.id]}
                    id={section.id}
                    title={section.label}
                    defaultOpen={section.id === defaultSectionId}
                    
                >
                    {section.tables ? (
                        section.underConstruction ? (
                            <RecordSectionUnderConstructionAlert section={section.label} />
                        ) : (
                            <RecordTableSection
                                recordId={id}
                                recordType={recordType}
                                tables={section.tables}
                                // Pass the active tab for this section (undefined = Tabs manages its own default)
                                selectedTab={activeTabs[section.id]}
                                // Bubble tab changes back up with the sectionId so RecordPage can update activeTabs
                                onTabChange={(tableId) => onTabChange(section.id, tableId)}
                                onTableLoad={onTableLoad}
                            />
                        )
                    ) : (
                        <span>{section.label}</span>
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
