"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { EnhancedSearchComponent } from "@/components/enhanced-search-component";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Tooltip } from "@/components/tooltip";
import { useLoading } from "@/components/loading-context";
import Link from "next/link";
import "../table.css";
import "../tab-navigation.css";
import "../action-button.css";
import "./records-list.css";

interface RecordsPageProps {
    searchResults?: {
        query: string;
        totalResults: number;
        records: any[];
    };
}

export function RecordsPage({ searchResults }: RecordsPageProps) {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const { isLoading, setLoading } = useLoading();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const suggestions = ["APOE", "TREM2", "APP", "PSEN1", "MAPT", "CLU", "CR1", "PICALM", "Alzheimer's disease"];

    // Default empty results fallback
    const results = searchResults || {
        query,
        totalResults: 0,
        records: [],
    };

    const tabs = [
        { id: "all", label: "All Results" },
        { id: "gene", label: "Genes" },
        { id: "variant", label: "Variants" },
        { id: "span", label: "Spans" },
        { id: "track", label: "Tracks" },
    ];

    useEffect(() => {
        const typeParam = searchParams.get("type");
        setActiveTab(tabs.some((tab) => tab.id === typeParam) ? typeParam! : "all");

        // setLoading(true)
        setLoading(false);
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, [searchParams, setLoading]);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const ariaSortValue = sortColumn === "id" ? (sortDirection === "asc" ? "ascending" : "descending") : "none";

    const handleRowSelect = (id: string) => {
        const newSelected = new Set(selectedRows);
        newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
        setSelectedRows(newSelected);
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const params = new URLSearchParams(searchParams.toString());
        tabId === "all" ? params.delete("type") : params.set("type", tabId);
        router.push(`/search?${params.toString()}`);
    };

    const filteredRecords =
        results.records?.filter((record: any) => {
            if (activeTab === "all") return true;
            return record.type === activeTab;
        }) || [];

    if (isLoading) {
        return <LoadingSpinner message="Loading records..." />;
    }

    if (!results.records || results.records.length === 0) {
        return (
            <div className="loading-container">
                <div className="text-center text-secondary">
                    <div className="text-lg mb-2">No results found</div>
                    <div className="text-sm">Try refining your search for "{query}"</div>
                </div>
                <div style={{ marginTop: "2rem", maxWidth: 600 }}>
                    <EnhancedSearchComponent
                        placeholder="Search genes, variants, or regions (e.g., APOE, rs429358)"
                        suggestions={suggestions}
                        showTypeHints={true}
                        autoRoute={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-text-width">
            <div className="content-header">
                <div>
                    <h1 className="content-title">Search Results</h1>
                    <p className="content-subtitle">
                        Found {results.totalResults} results for "{results.query}"
                    </p>
                </div>
                {/* <div className="action-buttons">
          <Tooltip content="View selected data in genome browser">
            <button className="action-button" onClick={() => router.push("/genome-browser")}>
              View in Genome Browser
            </button>
          </Tooltip>
          <button className="action-button">
            <Download size={16} aria-hidden="true" />
            Export
          </button>
          <button className="action-button">Share</button>
        </div> */}
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4 gap-4">
                    <EnhancedSearchComponent
                        placeholder="Search genes, variants, or genomic regions (e.g., APOE, rs429358)"
                        suggestions={suggestions}
                        showTypeHints={true}
                        autoRoute={true}
                    />
                    <button className="action-button">
                        <Filter size={16} aria-hidden="true" />
                        Search
                    </button>
                </div>
            </div>

            <div className="tab-navigation" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => handleTabChange(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="card" role="tabpanel" id={`tabpanel-${activeTab}`}>
                <div className="card-header">
                    <div>
                        <div className="card-title">Records</div>
                        <div className="card-subtitle">
                            {selectedRows.size > 0 && `${selectedRows.size} selected • `}
                            Showing {filteredRecords.length} results
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {selectedRows.size > 0 && (
                            <button className="action-button primary">
                                <Download size={16} aria-hidden="true" />
                                Export Selected
                            </button>
                        )}
                        <button className="action-button">
                            <Download size={16} aria-hidden="true" />
                            Export All
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table" role="table">
                        <thead>
                            <tr role="row">
                                <th role="columnheader">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            const allIds = new Set(filteredRecords.map((item: any) => item.id));
                                            setSelectedRows(e.target.checked ? allIds : new Set());
                                        }}
                                        checked={
                                            selectedRows.size === filteredRecords.length && filteredRecords.length > 0
                                        }
                                        aria-label="Select all rows"
                                    />
                                </th>
                                <th
                                    role="columnheader"
                                    className="sortable"
                                    onClick={() => handleSort("id")}
                                    aria-sort={ariaSortValue}
                                >
                                    ID
                                </th>
                                <th role="columnheader" className="sortable" onClick={() => handleSort("type")}>
                                    Type
                                </th>
                                <th role="columnheader">Description</th>
                                <th role="columnheader">Location</th>
                                <th role="columnheader"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((item: any) => (
                                <tr key={item.id} role="row" className={selectedRows.has(item.id) ? "selected" : ""}>
                                    <td role="gridcell">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(item.id)}
                                            onChange={() => handleRowSelect(item.id)}
                                            aria-label={`Select row ${item.id}`}
                                        />
                                    </td>
                                    <td role="gridcell" className="scientific-notation">
                                        <Link
                                            href={`/records/${item.type}/${item.id}`}
                                            className="text-primary-blue hover:underline"
                                        >
                                            {item.id}
                                        </Link>
                                    </td>
                                    <td role="gridcell">
                                        <span className={`record-type-badge ${item.type}`}>{item.type}</span>
                                    </td>
                                    <td role="gridcell">{item.description}</td>
                                    <td role="gridcell">{item.location}</td>
                                    <td role="gridcell">
                                        <Link href={`/records/${item.type}/${item.id}`} className="view-details-link">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <div className="pagination-info">
                        <div>Results per page: 10</div>
                        <div>
                            1-{filteredRecords.length} of {results.totalResults}
                        </div>
                    </div>
                    <div className="pagination-controls">
                        <button className="pagination-button" disabled aria-label="Previous page">
                            <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                        <button className="pagination-button active" aria-label="Page 1" aria-current="page">
                            1
                        </button>
                        <button className="pagination-button" disabled aria-label="Next page">
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
