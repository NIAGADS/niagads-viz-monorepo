"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { detectSearchType, analyzeSearchQuery, getSearchSuggestions } from "@/lib/search-router";
import "./enhanced-search-component.css";

interface EnhancedSearchComponentProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    suggestions?: string[];
    showTypeHints?: boolean;
    autoRoute?: boolean; // If true, automatically route to record pages
}

export function EnhancedSearchComponent({
    placeholder = "Search genes, variants, tissues...",
    onSearch,
    suggestions = [],
    showTypeHints = true,
    autoRoute = true,
}: EnhancedSearchComponentProps) {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchAnalysis, setSearchAnalysis] = useState<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Get dynamic suggestions based on input
    const dynamicSuggestions: string[] = query.length > 0 ? getSearchSuggestions(query, 5) : suggestions;

    const filteredSuggestions = dynamicSuggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);

    // Analyze query as user types
    useEffect(() => {
        if (query.length > 1 && showTypeHints) {
            const analysis = analyzeSearchQuery(query);
            setSearchAnalysis(analysis);
        } else {
            setSearchAnalysis(null);
        }
    }, [query, showTypeHints]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showSuggestions) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0) {
                        handleSuggestionClick(filteredSuggestions[highlightedIndex]);
                    } else {
                        handleSearch();
                    }
                    break;
                case "Escape":
                    setShowSuggestions(false);
                    setHighlightedIndex(-1);
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [showSuggestions, highlightedIndex, filteredSuggestions]);

    const handleSearch = () => {
        if (!query.trim()) return;

        if (autoRoute) {
            const route = detectSearchType(query.trim());
            router.push(route.path);
        } else if (onSearch) {
            onSearch(query.trim());
        }

        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);

        if (autoRoute) {
            const route = detectSearchType(suggestion);
            router.push(route.path);
        } else if (onSearch) {
            onSearch(suggestion);
        }
    };

    return (
        <div className="enhanced-search-container">
            <div className="search-input-wrapper">
                <Search className="search-icon" aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    className="enhanced-search-input"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                        setHighlightedIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(query.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    aria-label="Search"
                    aria-expanded={showSuggestions}
                    aria-autocomplete="list"
                    role="combobox"
                />

                {/* Search type hint */}
                {searchAnalysis && searchAnalysis.detectedType && (
                    <div className="search-type-hint">
                        <span className={`type-badge type-${searchAnalysis.detectedType}`}>
                            {searchAnalysis.detectedType}
                        </span>
                    </div>
                )}
            </div>

            {/* Search analysis hints */}
            {searchAnalysis && searchAnalysis.suggestions.length > 0 && (
                <div className="search-hints">
                    {searchAnalysis.suggestions.map((hint: string, index: number) => (
                        <div key={index} className="search-hint">
                            {hint}
                        </div>
                    ))}
                </div>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="enhanced-search-suggestions" role="listbox">
                    {filteredSuggestions.map((suggestion, index) => {
                        const analysis = analyzeSearchQuery(suggestion);
                        return (
                            <div
                                key={suggestion}
                                className={`enhanced-search-suggestion ${index === highlightedIndex ? "highlighted" : ""}`}
                                onClick={() => handleSuggestionClick(suggestion)}
                                role="option"
                                aria-selected={index === highlightedIndex}
                            >
                                <div className="suggestion-content">
                                    <span className="suggestion-text">{suggestion}</span>
                                    {analysis.detectedType && (
                                        <span className={`suggestion-type type-${analysis.detectedType}`}>
                                            {analysis.detectedType}
                                        </span>
                                    )}
                                </div>
                                {analysis.route.type === "record" && (
                                    <ArrowRight size={14} className="suggestion-arrow" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
