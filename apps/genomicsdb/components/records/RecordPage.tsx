"use client";

import { useState } from "react";
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

    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            {/* Mobile FAB */}
            {mobileOpen && <div className={styles["sidebar-overlay"]} onClick={() => setMobileOpen(false)} />}
            <button className={styles["sidebar-fab"]} onClick={() => setMobileOpen((p) => !p)}></button>
            <div className={styles["record-shell"]}>
                <RecordSidebar sections={sections} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <div className={`${styles["record-content"]} ${sidebarCollapsed ? styles["sidebar-collapsed"] : ""}`}>
                    <RecordToolbar title={title} subtitle={recordData.record_type === "gene" ? recordData.name : ""} id={recordId} />
                    <RecordAnnotationSection sections={sections} id={recordId} recordType={recordType} />
                </div>
            </div>
        </>
    );
};

export default RecordPage;
