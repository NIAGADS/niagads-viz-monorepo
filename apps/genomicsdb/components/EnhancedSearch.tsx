"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@niagads/ui/client";
import { _fetch } from "@/lib/route-handlers";
import { SearchResult } from "@/lib/types";

import "./enhanced-search-component.css";

interface EnhancedSearchProps {
    placeholder?: string;
    autoRoute?: boolean; // If true, automatically route to record pages
}

export function EnhancedSearch({ placeholder, autoRoute }: EnhancedSearchProps) {
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const router = useRouter();

    const getSuggestions = (value: string) => {
        setSuggestions([]);
        !!value &&
            _fetch(`/api/service/search?keyword=${value}&limit=10`).then((results: SearchResult[]) =>
                setSuggestions(results)
            );
    };

    const handleSearch = (searchTerm: string) => {
        router.push(`/search?q=${searchTerm}`);
    };

    const handleClick = (suggestion: Partial<SearchResult>) => {
        router.push(`/record/${suggestion.record_type}/${suggestion.id}`);
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
