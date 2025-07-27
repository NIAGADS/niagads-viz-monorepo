"use client";

import { AnchoredPageSection, PAGE_SECTION_ICONS as ICONS, RecordType } from "@/lib/types";

import Link from "next/link";
import badgeStyles from "./styles/record-type.module.css";
import styles from "./styles/record-sidebar.module.css";
import { useState } from "react";

const SCROLL_OFFSET = 70; // adjust for the header height
interface SidebarProps {
    title: string;
    items: AnchoredPageSection[];
    recordType: RecordType;
    isOpen?: boolean; // hold-over
}

export const RecordSidebar = ({ title, recordType, items }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeFilter, setActiveFilter] = useState("overview");

    // note: this actually is never happening b/c of the next/link
    const handleItemClick = (itemId: string) => {
        const element = document.getElementById(itemId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const renderSidebarItem = (item: AnchoredPageSection) => {
        const isActive = activeFilter === item.id;
        const Icon = ICONS[item.icon];

        // the next/link is handling the scroll, we need to style it b/c right
        // now the button is just providing styling
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
