import { Button, LoadingSpinner } from "@niagads/ui";
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { PageProps, SearchResult } from "@/lib/types";
import React, { Suspense } from "react";

import { EnhancedSearch } from "@/components/EnhancedSearch";
import Link from "next/link";
import { _fetch } from "@/lib/route-handlers";

const SearchPage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const query = params.q || "";
    const type = params.type;

    const results: SearchResult[] = (await _fetch(`/service/search?keyword=${query}`)) as SearchResult[];

    const filteredRecords = type ? results.filter((result) => result.record_type === type) : results;

    return (
        <Suspense fallback={<LoadingSpinner message="Loading search results..." />}>
            {!results || results.length === 0 ? (
                <div className="loading-container">
                    <div className="text-center text-secondary">
                        <div className="text-lg mb-2">No results found</div>
                        <div className="text-sm">Try refining your search for "{query}"</div>
                    </div>
                    <div style={{ marginTop: "2rem", maxWidth: 600 }}>
                        <EnhancedSearch
                            placeholder="Search genes, variants, or regions (e.g., APOE, rs429358)"
                            autoRoute={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="max-text-width">
                    <div className="content-header">
                        <div>
                            <h1 className="content-title">Search Results</h1>
                            <p className="content-subtitle">Found X results for "{query}"</p>
                        </div>
                        {/*
                            <div className="action-buttons">
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
                            </div>
                        */}
                    </div>
                    <div className="card">
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <EnhancedSearch
                                placeholder="Search genes, variants, or genomic regions (e.g., APOE, rs429358)"
                                autoRoute={true}
                            />
                            <Button>
                                <Filter size={16} aria-hidden="true" />
                                Search
                            </Button>
                        </div>
                    </div>
                    {/* <div className="tab-navigation" role="tablist">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`tab-item ${tab === type ? "active" : ""}`}
                                role="tab"
                                aria-selected={tab === type}
                                aria-controls={`tabpanel-${tab}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div> */}
                    <div className="card" role="tabpanel" id={`tabpanel-${type}`}>
                        <div className="card-header">
                            <div>
                                <div className="card-title">Records</div>
                                <div className="card-subtitle">Showing {filteredRecords.length} results</div>
                            </div>
                            <div className="flex gap-2">
                                <Button>
                                    <Download size={16} aria-hidden="true" />
                                    Export
                                </Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="data-table" role="table">
                                <thead>
                                    <tr role="row">
                                        <th role="columnheader"></th>
                                        <th role="columnheader" className="sortable">
                                            ID
                                        </th>
                                        <th role="columnheader" className="sortable">
                                            Type
                                        </th>
                                        <th role="columnheader">Description</th>
                                        <th role="columnheader"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((item: SearchResult) => (
                                        <tr key={item.id} role="row">
                                            <td role="gridcell">
                                                <input type="checkbox" aria-label={`Select row ${item.id}`} />
                                            </td>
                                            <td role="gridcell" className="scientific-notation">
                                                <Link
                                                    href={`/record/${item.record_type}/${item.id}`}
                                                    className="text-primary-blue hover:underline"
                                                >
                                                    {item.id}
                                                </Link>
                                            </td>
                                            <td role="gridcell">
                                                <span className={`record-type-badge ${item.record_type}`}>
                                                    {item.record_type}
                                                </span>
                                            </td>
                                            <td role="gridcell">{item.description}</td>
                                            <td role="gridcell">
                                                <Link
                                                    href={`/record/${item.record_type}/${item.id}`}
                                                    className="view-details-link"
                                                >
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
                                <div>1-{filteredRecords.length} of X</div>
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
            )}
        </Suspense>
    );
};

export default SearchPage;
