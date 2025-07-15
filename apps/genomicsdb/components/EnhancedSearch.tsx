"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { detectSearchType, analyzeSearchQuery, getSearchSuggestions } from "@/lib/search-router";
import "./enhanced-search-component.css";
import { Autocomplete } from "@niagads/ui/client";
import { _fetch } from "@/lib/route-handlers";
import { SearchResult } from "@/lib/types";

interface EnhancedSearchProps {
    placeholder?: string;
    autoRoute?: boolean; // If true, automatically route to record pages
}

export function EnhancedSearch({
    placeholder,
    autoRoute,
}: EnhancedSearchProps) {
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const router = useRouter();

    const getSuggestions = (value: string) => {
        setSuggestions([]);
        _fetch(`/service/search?keyword=${value}`).then((results: SearchResult[]) => setSuggestions(results));
    };

    const handleSearch = (searchTerm: string) => {
        router.push(`/search?q=${searchTerm}`);
    };

    const handleClick = (suggestion: Partial<SearchResult>) => {
        router.push(`/record/${suggestion.record_type}/${suggestion.id}`)

    };

    return (
        <Autocomplete 
            suggestions={suggestions}
            onSearch={(term) => handleSearch(term)}
            onClick={(suggestion) => handleClick(suggestion)}
            onValueChange={(value) => getSuggestions(value)}
            placeholder={placeholder}
        />
    );
}
