"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { EntityRecord, RecordType } from "@/lib/types";
import { RECORD_PAGE_SECTIONS } from "@/data/sections";
import RecordAnnotationSection from "../RecordAnnotationSection/RecordAnnotationSection";
import RecordSidebar from "../RecordSidebar/RecordSidebar";
import RecordToolbar from "../RecordToolbar/RecordToolbar";

import styles from "./record-page.module.css";
import GeneRecordOverview from "../overviews/GeneRecordOverview";
import AssociationSummaryChart from "@/components/charts/AssociationSummaryChart";

interface RecordPageProps {
    recordId: string;
    recordType: RecordType;
    recordData: EntityRecord;
    overview?: ReactNode;
}

const RecordPage = ({ recordId, recordType: recordTypeProp, recordData, overview }: RecordPageProps) => {
    // Override recordType if the variant is structural — the prop alone can't distinguish this,
    // since structural variants share the "variant" record_type but need their own sections/logic

    const recordType = recordTypeProp;

    // Sections are now derived from the corrected recordType, so structural variants
    // get their own section config rather than falling back to generic variant sections
    const sections = RECORD_PAGE_SECTIONS[recordType];
    const annotationSections = sections.filter((section) => section.id !== "overview");

    // The first section that has real tables and isn't under construction opens by default.
    // Used to seed activeTabs and openRequest on mount so the page feels ready on load.
    const defaultSection = useMemo(
        () => sections.find((s) => s.tables && s.tables.length > 0 && !s.underConstruction),
        [sections]
    );

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Tracks which tab is active per section — keyed by sectionId, value is the active tableId.
    // Seeded with the default section's first tab so it appears active on load.
    const [activeTabs, setActiveTabs] = useState<Record<string, string>>(
        defaultSection ? { [defaultSection.id]: defaultSection.tables![0].id } : {}
    );
    // default to the default section so sidebar starts highlighted correctly
    const [activeNav, setActiveNav] = useState<string>(defaultSection?.id ?? sections[0].id);

    const [tableCounts, setTableCounts] = useState<Record<string, number>>({});

    // Drives imperative open requests sent down to RecordAnnotationSection.
    // Using a { sectionId, seq } shape instead of just sectionId so that clicking the same
    // section twice in a row still triggers the useEffect (seq always increments).
    // Seeded with the default section so it opens on mount without user interaction.
    const [openRequest, setOpenRequest] = useState<{ sectionId: string; seq: number } | null>(
        defaultSection ? { sectionId: defaultSection.id, seq: 0 } : null
    );

    // Reverse map: tableId -> parent sectionId
    // Needed so subnav clicks (which carry a tableId) can find their parent section to scroll + open it
    const tableToSection = useMemo(() => {
        const map: Record<string, string> = {};
        sections.forEach((section) => {
            section.tables?.forEach((table) => {
                map[table.id] = section.id;
            });
        });
        return map;
    }, [sections]);

    const handleSectionSelect = (id: string) => {
        // If the clicked id belongs to a table, resolve its parent section;
        // otherwise the id is already a top-level section
        const parentId = tableToSection[id] ?? id;

        // If a subnav table item was clicked, update that section's active tab
        if (tableToSection[id]) {
            setActiveTabs((prev) => ({ ...prev, [parentId]: id }));
        }
        //immediately reflect sidebar click in activeNav
        setActiveNav(parentId);

        // Request the section to open if it's collapsed.
        // RecordAnnotationSection handles the actual DOM check — we avoid doing it here
        // because CollapsibleSection uses CSS modules so class names aren't predictable.
        setOpenRequest((prev) => ({ sectionId: parentId, seq: (prev?.seq ?? 0) + 1 }));

        // Scroll after a short delay to let the section open before measuring position
        setTimeout(() => {
            document.getElementById(parentId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

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
                <RecordSidebar
                    title={title}
                    sections={sections}
                    activeTabs={activeTabs}
                    activeNav={activeNav}
                    tableCounts={tableCounts}
                    onActiveNavChange={setActiveNav}
                    // Receive the boolean the sidebar already computed
                    onToggleCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
                    onSectionSelect={handleSectionSelect}
                />
                <div className={`${styles["record-content"]} ${sidebarCollapsed ? styles["sidebar-collapsed"] : ""}`}>
                    <RecordToolbar
                        title={title}
                        subtitle={recordData.record_type === "gene" ? (recordData.name ?? undefined) : undefined}
                        id={recordId}
                    />
                    {overview}
                    <RecordAnnotationSection
                        sections={annotationSections}
                        id={recordId}
                        recordType={recordType}
                        activeTabs={activeTabs}
                        onTabChange={(sectionId, tableId) => {
                            setActiveTabs((prev) => ({ ...prev, [sectionId]: tableId }));
                            setActiveNav(sectionId);
                        }}
                        openRequest={openRequest}
                        onTableLoad={(tableId, count) => setTableCounts((prev) => ({ ...prev, [tableId]: count }))}
                    />
                </div>
            </div>
        </>
    );
};

export default RecordPage;
