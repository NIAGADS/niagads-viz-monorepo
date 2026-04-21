"use client";

import { Ref, RefObject, useRef, useState } from "react";
import { EntityRecord, RecordType } from "@/lib/types";
import { RECORD_PAGE_SECTIONS } from "@/data/sections";
import RecordAnnotationSection from "./RecordAnnotationSection";
import RecordSidebar from "./RecordSidebar";
import RecordToolbar from "./RecordToolbar";

import styles from "./styles/record-page.module.css";

interface RecordPageProps {
    recordId: string;
    recordType: RecordType;
    recordData: EntityRecord;
}

const RecordPage = ({ recordId, recordType, recordData }: RecordPageProps) => {
    const sections = RECORD_PAGE_SECTIONS[recordType];

    const sectionRefs = sections.reduce((prev, section) => {
        if (section.tables) {
            return {
                ...prev,
                ...section.tables.reduce((prev, table) => ({...prev, [table.id]: useRef(null)}), {} as Record<string, RefObject<HTMLElement | null>>)
            }
        } else {
            return {
                ...prev,
                [section.id]: useRef(null)
            }
        }
    }, {} as Record<string, RefObject<HTMLElement | null>>);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedSection, setSelectedSection] = useState();

    const title =
        recordData.record_type === "gene"
            ? recordData.symbol
            : recordData.record_type === "region"
              ? recordData.id
              : recordData.record_type === "variant"
                ? recordData.allele_string
                : recordData.name;

    return (
        <>
            <div className={styles["record-shell"]}>
                <RecordSidebar title={title} sections={sections} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} onSectionSelect={(sectionId) => sectionRefs[sectionId].current?.scrollIntoView()} />
                <div className={`${styles["record-content"]} ${sidebarCollapsed ? styles["sidebar-collapsed"] : ""}`}>
                    <RecordToolbar title={title} subtitle={recordData.record_type === "gene" ? recordData.name : ""} id={recordId} />
                    <RecordAnnotationSection sections={sections} sectionRefs={sectionRefs} id={recordId} recordType={recordType} />
                </div>
            </div>
        </>
    );
};

export default RecordPage;
