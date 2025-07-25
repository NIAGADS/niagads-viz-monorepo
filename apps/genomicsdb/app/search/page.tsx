import "@/app/globals.css";

import { Card, LoadingSpinner } from "@niagads/ui";
import { PageProps, SearchResult } from "@/lib/types";
import React, { Suspense } from "react";

import { EnhancedSearch } from "@/components/EnhancedSearch";
import { SearchTable } from "@/components/SearchTable";
import { _fetch } from "@/lib/route-handlers";
import { prefixClientRoute } from "@/lib/utils";
import { redirect } from "next/navigation";

const SearchPage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const query = params.q || "";
    const autoRoute = params.autoRoute || true;

    // const results: SearchResult[] = (await _fetch(`/service/search?keyword=${query}`)) as SearchResult[];
    const results: SearchResult[] = (await _fetch(
        `/service/search?keyword=${query}&searchType=feature`
    )) as SearchResult[];

    if (autoRoute && results.length > 0 && results[0].match_rank === -1) {
        redirect(prefixClientRoute(`/record/${results[0].record_type}/${results[0].id}`));
    }

    return (
        <Suspense fallback={<LoadingSpinner message="Loading search results..." />}>
            {!results || results.length === 0 ? (
                <div className="loading-container">
                    <div className="text-center text-secondary">
                        <div className="text-lg mb-2">No results found for "{query}"</div>
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
                    <Card variant="full" outline={false}>
                        <div className="content-header">
                            <div>
                                <h1 className="content-title">Search Results</h1>
                                <p className="content-subtitle">
                                    Found {results.length} results for "{query}"
                                </p>
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
