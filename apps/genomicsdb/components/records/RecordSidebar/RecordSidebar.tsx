"use client";

import { AnchoredPageSection } from "@/lib/types";
import { ChevronDown, ChevronLeft, ChevronUp, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PAGE_SECTION_ICONS } from "@/lib/types";
import styles from "./record-sidebar.module.css";

interface RecordSidebarProps {
    title: string;
    sections: AnchoredPageSection[];
    activeTabs: Record<string, string>;
    activeNav: string;
    tableCounts: Record<string, number>;
    onActiveNavChange: (id: string) => void;
    onToggleCollapse: (collapsed: boolean) => void;
    onSectionSelect: (sectionId: string) => void;
}

const RecordSidebar = ({
    title,
    sections,
    activeTabs,
    tableCounts,
    activeNav,
    onActiveNavChange,
    onToggleCollapse,
    onSectionSelect,
}: RecordSidebarProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    // First section with tables starts expanded
    const [navExpanded, setNavExpanded] = useState<Record<string, boolean>>(() => {
        const defaultId = sections.find((s) => s.tables && s.tables.length > 0 && !s.underConstruction)?.id;
        return sections.reduce((prev, s) => ({ ...prev, [s.id]: s.id === defaultId }), {} as Record<string, boolean>);
    });

    const toggleNavExpand = (id: string) => setNavExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    // Scroll-based active tracking
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const sectionIds = sections.map((s) => s.id);

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onActiveNavChange(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current!.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, [sections]);

    const handleToggleCollapse = () => {
        setSidebarCollapsed((prev) => !prev);
        onToggleCollapse(!sidebarCollapsed);
    };

    return (
        <>
            {mobileOpen && <div className={styles["sidebar-overlay"]} onClick={() => setMobileOpen(false)} />}

            <button
                className={styles["sidebar-fab"]}
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Open navigation"
            >
                <Menu size={20} />
            </button>

            <aside
                className={[
                    styles["sidebar"],
                    sidebarCollapsed ? styles["collapsed"] : "",
                    mobileOpen ? styles["mobile-open"] : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div className={styles["sidebar-record"]}>
                    <span className={styles["sidebar-record-name"]}>
                        <em>{title}</em>
                    </span>
                    <button className={styles["sidebar-toggle"]} onClick={handleToggleCollapse}>
                        <ChevronLeft size={12} />
                    </button>
                </div>

                <nav className={styles["sidebar-nav"]}>
                    {sections.map((item) => {
                        const hasChildren = item.tables && item.tables.length > 0;
                        const isExpanded = navExpanded[item.id];
                        const isActiveParent = hasChildren && activeNav === item.id;
                        const isActive = !hasChildren && activeNav === item.id;
                        const Icon = PAGE_SECTION_ICONS[item.icon];

                        return (
                            <div key={item.id}>
                                <div
                                    className={[
                                        styles["nav-item"],
                                        isActive ? styles["active"] : "",
                                        isActiveParent ? styles["active-parent"] : "",
                                        hasChildren && isExpanded ? styles["open"] : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    onClick={() => {
                                        if (hasChildren) {
                                            toggleNavExpand(item.id);
                                        } else {
                                            onActiveNavChange(item.id);
                                            onSectionSelect(item.id);
                                        }
                                    }}
                                >
                                    <Icon size={15} className={styles["nav-icon"]} />
                                    <span className={styles["nav-label"]}>{item.label}</span>
                                    {hasChildren && (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                </div>

                                {hasChildren && (
                                    <div
                                        className={[
                                            styles["subnav"],
                                            isExpanded && !sidebarCollapsed ? styles["subnav-open"] : "",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        {item.tables!.map((child) => (
                                            <div
                                                key={child.id}
                                                className={[
                                                    styles["subnav-item"],
                                                    activeNav === item.id && activeTabs[item.id] === child.id
                                                        ? styles["active"]
                                                        : "",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                                onClick={() => {
                                                    onActiveNavChange(item.id);
                                                    onSectionSelect(child.id);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                <span className={styles["subnav-item-label"]}>{child.label}</span>
                                                <span className={styles["nav-badge"]}>
                                                    {tableCounts[child.id] !== undefined
                                                        ? tableCounts[child.id].toLocaleString()
                                                        : "—"}
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
