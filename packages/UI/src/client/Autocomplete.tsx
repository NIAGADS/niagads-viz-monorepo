import { ArrowRight, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { LoadingSpinner } from "../LoadingSpinner";
import styles from "../styles/autocomplete.module.css";

const useDebounce = (value: string) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [waiting, setWaiting] = useState(false);
    const [timeoutID, setTimeoutID] = useState<any>();

    useEffect(() => {
        if (waiting) {
            clearTimeout(timeoutID);
        }

        setWaiting(true);

        setTimeoutID(
            setTimeout(() => {
                setWaiting(false);
                setDebouncedValue(value);
            }, 1000)
        );
    }, [value]);

    return { waiting, debouncedValue };
};

interface Suggestion {
    id: string;
    display: string;
    record_type: "gene" | "variant" | "span" | "track";
}
interface AutocompleteProps {
    suggestions: Suggestion[];
    onSearch: (query: string) => void;
    onClick: (suggestion: Suggestion) => void;
    onValueChange: (value: string) => void;
    placeholder?: string;
    showTypeHints?: boolean;
    autoRoute?: boolean; // If true, automatically route to record pages
}

export const Autocomplete = ({
    suggestions,
    onSearch,
    onClick,
    onValueChange,
    placeholder = "Search genes, variants, tissues...",
    showTypeHints = true,
    autoRoute = true,
}: AutocompleteProps) => {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const { waiting, debouncedValue } = useDebounce(query);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showSuggestions) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0) {
                        handleSuggestionClick(suggestions[highlightedIndex]);
                    } else {
                        handleSearch(query);
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
    }, [showSuggestions, highlightedIndex, suggestions, query]);

    useEffect(() => {
        onValueChange(debouncedValue);
    }, [debouncedValue]);

    const handleSearch = (q: string) => {
        onSearch(query);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        onClick(suggestion);
    };

    return (
        <div className={styles["ui-autocomplete-container"]}>
            <div className={styles["ui-autocomplete-input-wrapper"]}>
                <Search className={styles["ui-autocomplete-search-icon"]} aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles["ui-autocomplete-input"]}
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

                {showSuggestions && suggestions.length > 0 && (
                    <div className={styles["ui-autocomplete-suggestions"]} role="listbox">
                        {waiting || !(suggestions.length > 0) ? (
                            <LoadingSpinner />
                        ) : (
                            <div>
                                {suggestions.slice(0, 8).map((suggestion, index) => {
                                    return (
                                        <div
                                            key={suggestion.id}
                                            className={`${styles["ui-autocomplete-suggestion"]} ${index === highlightedIndex ? styles["ui-highlighted"] : ""}`}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            role="option"
                                            aria-selected={index === highlightedIndex}
                                        >
                                            <div className={styles["ui-suggestion-content"]}>
                                                <span className={styles["ui-suggestion-text"]}>{suggestion.display}</span>
                                            </div>
                                            <ArrowRight size={14} className={styles["ui-suggestion-arrow"]} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
