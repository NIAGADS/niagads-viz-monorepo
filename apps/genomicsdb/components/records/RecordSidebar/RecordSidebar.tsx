"use client";

import { AnchoredPageSection } from "@/lib/types";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { useState } from "react";
import styles from "./record-sidebar.module.css";

interface RecordSidebarProps {
    title: string;
    sections: AnchoredPageSection[];
    onToggleCollapse: () => void;
    onSectionSelect: (sectionId: string) => void;
}

const RecordSidebar = ({ title, sections, onToggleCollapse, onSectionSelect }: RecordSidebarProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeNav, setActiveNav] = useState(sections[0].id);
    const [navExpanded, setNavExpanded] = useState<Record<string, boolean>>(
        sections.reduce((prev, s) => ({ ...prev, [`${s.id}`]: false }), {})
    );

    const toggleNavExpand = (id: string) => setNavExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <>
            {/* Mobile FAB */}
            {mobileOpen && <div className={styles["sidebar-overlay"]} onClick={() => setMobileOpen(false)} />}
            <button className={styles["sidebar-fab"]} onClick={() => setMobileOpen((p) => !p)}></button>
            <aside
                className={`${styles["sidebar"]} ${sidebarCollapsed ? styles["collapsed"] : ""} ${mobileOpen ? styles["mobile-open"] : ""}`}
            >
                <div className={styles["sidebar-record"]}>
                    <span className={styles["sidebar-record-name"]}>
                        <em>{title}</em>
                    </span>
                    <button
                        className={styles["sidebar-toggle"]}
                        onClick={() => {
                            setSidebarCollapsed((p) => !p);
                            onToggleCollapse();
                        }}
                    >
                        <ChevronLeft />
                    </button>
                </div>
                <nav className={styles["sidebar-nav"]}>
                    {sections.map((item) => {
                        const hasChildren = item.tables && item.tables.length > 0;
                        const isExpanded = navExpanded[item.id];
                        const isActive = activeNav === item.id;
                        const isActiveParent = hasChildren && activeNav === item.id;
                        return (
                            <div key={item.id}>
                                <div
                                    className={`${styles["nav-item"]} ${isActive ? "active" : ""} ${isActiveParent ? "active-parent" : ""} ${hasChildren && isExpanded ? "open" : ""}`}
                                    onClick={() => (hasChildren ? toggleNavExpand(item.id) : onSectionSelect(item.id))}
                                >
                                    {/* <SvgIcon className="nav-icon" d={icons[item.icon]} size={15} /> */}
                                    <span className={styles["nav-label"]}>{item.label}</span>
                                    {hasChildren && (navExpanded[item.id] ? <ChevronUp /> : <ChevronDown />)}
                                </div>
                                {hasChildren && (
                                    <div
                                        className={styles["subnav"]}
                                        style={{ maxHeight: isExpanded && !sidebarCollapsed ? 300 : 0 }}
                                    >
                                        {item.tables!.map((child) => (
                                            <div
                                                key={child.id}
                                                className={`${styles["subnav-item"]} ${activeNav === child.id ? styles["active"] : ""}`}
                                                onClick={() => onSectionSelect(child.id)}
                                            >
                                                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {child.label}
                                                </span>
                                                <span className={styles["nav-badge"]}>
                                                    {child.data?.pagination.total_num_records}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default RecordSidebar;
