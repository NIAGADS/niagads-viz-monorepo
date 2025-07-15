"use client";

import "./record-sidebar.css";

import {
    Activity,
    AudioLines,
    BarChart2,
    ChartNoAxesGantt,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Database,
    Dna,
    Download,
    ExternalLink,
    Eye,
    FileText,
    GitBranch,
    Home,
    Info,
    TrendingUp,
} from "lucide-react";
import { AnchoredPageSection, RecordType } from "@/lib/types";

import Link from "next/link";
import { useState } from "react";

//import "./records/record-sidebar.css";

const ICONS = {
    home: Home,
    gantt: ChartNoAxesGantt,
    barchart: BarChart2,
    link: ExternalLink,
    network: GitBranch,
    database: Database,
    info: Info,
    activity: Activity,
    frequency: AudioLines,
    file: FileText,
};

interface SidebarProps {
    title: string;
    items: AnchoredPageSection[];
    recordType: RecordType;
    isOpen?: boolean; // hold-over
}

const RecordSidebar = ({ title, recordType, items }: SidebarProps) => {
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
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => handleItemClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                >
                    <Icon className="sidebar-item-icon" size={18} aria-hidden="true" />
                    <Link href={`#${item.id}`} className="sidebar-item-text">
                        {item.label}
                    </Link>
                    {/*<span className="flex-1 text-left">{item.label}</span>*/}
                </button>
            </div>
        );
    };

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`} role="navigation" aria-label="Secondary navigation">
            <div className="sidebar-header">
                <h2 className="sidebar-title">
                    {" "}
                    <div className={`record-type-badge ${recordType}`}>{recordType}</div>
                    {/*title*/} Annotation
                </h2>
                {/*<button
                    className="sidebar-toggle"
                    onClick={() => handleCollapse()}
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>*/}
            </div>
            <nav className="sidebar-nav">{items.map((item) => renderSidebarItem(item))}</nav>
        </aside>
    );
};

export default RecordSidebar;
