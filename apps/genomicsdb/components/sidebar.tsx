"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, BarChart2, Link, FileText, GitBranch, Database, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import "./sidebar.css";

interface SidebarProps {
    title: string;
    sidebarConfig: SidebarItem[];
}

export interface SidebarItem {
    id: string;
    label: string;
    icon: "home" | "barChart" | "link" | "file" | "gitBranch" | "database";
    anchor?: string;
    children?: SidebarItem[];
}

const iconMap = {
    "home": Home,
    "barChart": BarChart2,
    "link": Link,
    "file": FileText,
    "gitBranch": GitBranch,
    "database": Database,
}

export function Sidebar({ title, sidebarConfig }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["trait-associations"]));
    const [activeFilter, setActiveFilter] = useState("overview");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCollapse = () => {
        setIsOpen(!isOpen);
    }

    const handleItemClick = (itemId: string, hasChildren = false) => {
        if (hasChildren) {
            toggleSection(itemId);
        } else {
            const element = document.getElementById(itemId);
            element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    };

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const renderSidebarItem = (item: SidebarItem, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedSections.has(item.id);
        const isActive = activeFilter === item.id;
        const isChild = level > 0;
        const Icon = iconMap[item.icon];

        return (
            <div key={item.id}>
                <button
                    className={`sidebar-item ${isActive ? "active" : ""} ${isChild ? "child" : ""}`}
                    onClick={() => handleItemClick(item.id, hasChildren)}
                    aria-current={isActive ? "page" : undefined}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                >
                    <Icon className="sidebar-item-icon" size={18} aria-hidden="true" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {hasChildren && (
                        <span className="ml-auto">
                            {isExpanded ? (
                                <ChevronDown size={16} aria-hidden="true" />
                            ) : (
                                <ChevronRight size={16} aria-hidden="true" />
                            )}
                        </span>
                    )}
                </button>
                {hasChildren && isExpanded && (
                    <div>{item.children?.map((child) => renderSidebarItem(child, level + 1))}</div>
                )}
            </div>
        );
    };

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`} role="navigation" aria-label="Secondary navigation">
            <div className="sidebar-header">
                <h2 className="sidebar-title">
                    {title}
                </h2>
                <button
                    className="sidebar-toggle"
                    onClick={() => handleCollapse()}
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
            <nav className="sidebar-nav">{sidebarConfig.map((item) => renderSidebarItem(item))}</nav>
        </aside>
    );
}
