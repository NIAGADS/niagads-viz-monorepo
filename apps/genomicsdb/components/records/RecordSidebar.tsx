"use client";

import { AnchoredPageSection } from "@/lib/types";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { useState } from "react";
import styles from "./styles/record-sidebar.module.css";

interface RecordSidebarProps {
    sections: AnchoredPageSection[];
    onToggleCollapse: () => void;
}

const RecordSidebar = ({ sections, onToggleCollapse }: RecordSidebarProps) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeNav, setActiveNav] = useState(sections[0].id);
    const [navExpanded, setNavExpanded] = useState<Record<string, boolean>>(
        sections.reduce((prev, s) => ({ ...prev, [`${s.id}`]: false }), {})
    );
    const mobileOpen = false;

    const toggleNavExpand = (id: string) => setNavExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    const scrollTo = (id: string) => {
        // TODO: handle opening correct tab
        setTimeout(() => {
            const el = document.getElementById(`section-${id}`);
            if (el && !el.classList.contains("open")) {
                const header = el.querySelector(".collapsible-section-header") as HTMLElement;
                header.click();
            }
            setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        }, 10);
    };

    return (
        <aside
            className={`${styles["sidebar"]} ${sidebarCollapsed ? styles["collapsed"] : ""} ${mobileOpen ? styles["mobile-open"] : ""}`}
        >
            <div className={styles["sidebar-record"]}>
                <span className={styles["sidebar-record-name"]}>
                    <em>APOE</em>
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
                                onClick={() => (hasChildren ? toggleNavExpand(item.id) : scrollTo(item.id))}
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
                                            onClick={() => console.log("click")}
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
    );
};

export default RecordSidebar;
