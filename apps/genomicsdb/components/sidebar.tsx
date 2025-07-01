"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, BarChart2, Link, FileText, GitBranch, Database, ChevronDown, ChevronRight } from "lucide-react";
import "./sidebar.css";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    children?: SidebarItem[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["trait-associations"]));
    const [activeFilter, setActiveFilter] = useState("overview");
    const router = useRouter();
    const searchParams = useSearchParams();

    const sidebarItems: SidebarItem[] = [
        { id: "overview", label: "Overview", icon: Home },
        {
            id: "trait-associations",
            label: "Trait associations",
            icon: BarChart2,
            children: [
                { id: "niagads-gwas", label: "NIAGADS GWAS", icon: Database },
                { id: "gwas-catalog", label: "GWAS Catalog", icon: Database },
            ],
        },
        { id: "link-outs", label: "Link outs", icon: Link },
        { id: "function-prediction", label: "Function prediction", icon: FileText },
        { id: "pathways", label: "Pathways and interactions", icon: GitBranch },
        { id: "genetic-variation", label: "Genetic variation", icon: BarChart2 },
    ];

    const handleItemClick = (itemId: string, hasChildren = false) => {
        if (hasChildren) {
            toggleSection(itemId);
        } else {
            setActiveFilter(itemId);
            // Update URL with filter parameter
            const params = new URLSearchParams(searchParams.toString());
            params.set("filter", itemId);
            router.push(`/search?${params.toString()}`);
            onClose();
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

        return (
            <div key={item.id}>
                <button
                    className={`sidebar-item ${isActive ? "active" : ""} ${isChild ? "child" : ""}`}
                    onClick={() => handleItemClick(item.id, hasChildren)}
                    aria-current={isActive ? "page" : undefined}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                >
                    <item.icon className="sidebar-item-icon" size={18} aria-hidden="true" />
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
            <nav className="sidebar-nav">{sidebarItems.map((item) => renderSidebarItem(item))}</nav>
        </aside>
    );
}
