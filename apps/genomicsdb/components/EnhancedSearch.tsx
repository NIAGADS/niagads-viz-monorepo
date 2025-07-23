"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@niagads/ui/client";
import { SearchResult } from "@/lib/types";
import { prefixClientRoute } from "@/lib/utils";
import useSWR from "swr";

interface EnhancedSearchProps {
    placeholder?: string;
    autoRoute?: boolean; // If true, automatically route to record pages
}

export function EnhancedSearch({
    placeholder = "Search for genes, variants, regions...",
    autoRoute = true,
}: EnhancedSearchProps) {
    const [url, setUrl] = useState("");
    const router = useRouter();

    const { data } = useSWR(url, (url: string) => fetch(url).then((res) => res.json()));

    const getSuggestions = (value: string) => {
        if (value) {
            setUrl(prefixClientRoute(`/api/service/search?keyword=${value}&limit=10`));
        }
    };

    const handleSearch = (searchTerm: string) => {
        router.push(`/search?q=${searchTerm}&autoRoute=${autoRoute}`);
    };

    const handleClick = (suggestion: Partial<SearchResult>) => {
        router.push(`/record/${suggestion.record_type}/${suggestion.id}`);
    };

    return (
        <Autocomplete
            suggestions={data || null}
            onSearch={(term) => handleSearch(term)}
            onClick={(suggestion) => handleClick(suggestion)}
            onValueChange={(value) => getSuggestions(value)}
            placeholder={placeholder}
        />
    );
}
