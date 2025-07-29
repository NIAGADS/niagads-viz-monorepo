"use client";

import { Autocomplete } from "@niagads/ui/client";
import { SearchResult } from "@/lib/types";
import { prefixClientRoute } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";

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

    const { data, error } = useSWR(url, (url: string) => fetch(url).then((res) => res.json()));

    // Not in use for now
    //const regionTest = /^(chr)?(1[0-9]|2[0-2]|[1-9]|X|Y|M)[:\-](\d+)[\-:](\d+)$/gm;

    const getSuggestions = (value: string) => {
        if (value) {
            setUrl(prefixClientRoute(`/api/service/search?keyword=${value}&limit=10&searchType=feature`));
        }
    };

    const handleSearch = (searchTerm: string) => {
        router.push(prefixClientRoute(`/search?q=${searchTerm}&autoRoute=${autoRoute}`));
    };

    const handleClick = (suggestion: Partial<SearchResult>) => {
        router.push(prefixClientRoute(`/record/${suggestion.record_type}/${suggestion.id}`));
    };

    return (
        <Autocomplete
            suggestions={data || null}
            onSearch={(term) => handleSearch(term)}
            onClick={(suggestion) => handleClick(suggestion)}
            onValueChange={(value) => getSuggestions(value)}
            placeholder={placeholder}
        >
            {error && <div>Error</div>}
        </Autocomplete>
    );
}
