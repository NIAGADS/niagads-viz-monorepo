import React, { Suspense } from "react";
import { LoadingSpinner, Button, Card } from "@niagads/ui";
import { EnhancedSearch } from "@/components/EnhancedSearch";
import { Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { _fetch } from "@/lib/route-handlers";
import { SearchResult, PageProps } from "@/lib/types";
import { SearchTable } from "@/components/SearchTable";
import { redirect } from "next/navigation";

import "@/app/globals.css";
import { prefixClientRoute } from "@/lib/utils";

const SearchPage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const query = params.q || "";
    const type = params.type;

    const results: SearchResult[] = (await _fetch(`/service/search?keyword=${query}`)) as SearchResult[];

    if (results[0].match_rank === 0) {
        redirect(prefixClientRoute(`/record/${results[0].record_type}/${results[0].id}`));
    }

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
                            <p className="content-subtitle">
                                Found {results.length} results for "{query}"
                            </p>
                        </div>
                    </div>
                    <Card variant="full">
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
                    </Card>
                    <Card variant="full">
                        <div className="content-header">
                            <div>
                                <div className="content-title">Records</div>
                                <div className="content-subtitle">Showing {results.length} results</div>
                            </div>
                        </div>
                        <div className="table-container">
                            <SearchTable searchResults={results} />
                        </div>
                    </Card>
                </div>
            )}
        </Suspense>
    );
};

export default SearchPage;
