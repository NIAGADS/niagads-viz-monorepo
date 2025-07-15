"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { detectSearchType, analyzeSearchQuery, getSearchSuggestions } from "@/lib/search-router";
import "./enhanced-search-component.css";
import { Autocomplete } from "@niagads/ui/client";

interface EnhancedSearchProps {
    placeholder?: string;
    autoRoute?: boolean; // If true, automatically route to record pages
}

export function EnhancedSearch({
    placeholder,
    autoRoute,
}: EnhancedSearchProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const router = useRouter();

    const getSuggestions = (value: string) => {

        setSuggestions([]);
    }

    const handleSearch = (searchTerm: string) => {
        router.push(searchTerm);
    }

    return (
        <Autocomplete 
            suggestions={suggestions}
            onSearch={(term) => handleSearch(term)}
            onValueChange={(value) => getSuggestions(value)}
            placeholder={placeholder}
        />
    );
}
