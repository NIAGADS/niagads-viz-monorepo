"use client";

import { AnchoredPageSection, PAGE_SECTION_ICONS as ICONS, RecordType } from "@/lib/types";

import Link from "next/link";
import badgeStyles from "./styles/record-type.module.css";
import styles from "./styles/record-sidebar.module.css";
import { useState } from "react";

interface SidebarProps {
    title: string;
    items: AnchoredPageSection[];
    recordType: RecordType;
    isOpen?: boolean; // hold-over
}

export const RecordSidebar = ({ title, recordType, items }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeFilter, setActiveFilter] = useState("overview");

    const handleItemClick = (itemId: string) => {
        const element = document.getElementById(itemId);
        element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    };

    const renderSidebarItem = (item: AnchoredPageSection) => {
        const isActive = activeFilter === item.id;
        const Icon = ICONS[item.icon];

        return (
            <div key={item.id}>
                <button
                    className={[styles.item, isActive ? styles.itemActive : ""].join(" ")}
                    onClick={() => handleItemClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                >
                    <Icon className={styles.itemIcon} size={18} aria-hidden="true" />
                    <Link href={`#${item.id}`} className={styles.itemText}>
                        {item.label}
                    </Link>
                    {/*<span className="flex-1 text-left">{item.label}</span>*/}
                </button>
            </div>
        );
    };

    return (
        <aside
            className={[styles.sidebar, isOpen ? styles.open : ""].join(" ")}
            role="navigation"
            aria-label="Secondary navigation"
        >
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {" "}
                    <div
                        className={[styles.recordTypeBadge, badgeStyles.recordTypeBadge, badgeStyles[recordType]].join(
                            " "
                        )}
                    >
                        {recordType}
                    </div>
                    {/*title*/} Annotation
                </h2>
                {/*<button
                    className={styles.toggle}
                    onClick={() => handleCollapse()}
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>*/}
            </div>
            <nav className={styles.nav}>{items.map((item) => renderSidebarItem(item))}</nav>
        </aside>
    );
};
