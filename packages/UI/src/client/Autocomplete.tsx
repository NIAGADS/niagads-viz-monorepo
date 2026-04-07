import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import styles from "../styles/autocomplete.module.css";

interface AutocompleteProps {
    suggestions: string[];
    onSelect: (selection: string) => void;
    placeholder?: string;
}

export const Autocomplete = ({ suggestions, onSelect, placeholder }: AutocompleteProps) => {
    const [value, setValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);

    const matches = useMemo(() => suggestions.filter((x) => x.includes(value)), [value]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showSuggestions) return;
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < matches.length - 1 ? prev + 1 : prev));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case "Enter":
                    e.preventDefault();
                    setShowSuggestions(false);
                    if (highlightedIndex >= 0) {
                        onSelect(matches[highlightedIndex]);
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
    }, [showSuggestions, highlightedIndex, matches]);

    return (
        <div className={styles["ui-autocomplete-container"]}>
            <div className={styles["ui-autocomplete-input-wrapper"]}>
                <Search className={styles["ui-autocomplete-search-icon"]} aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles["ui-autocomplete-input"]}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                        setHighlightedIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    aria-label="Search"
                    aria-expanded={showSuggestions}
                    aria-autocomplete="list"
                    role="combobox"
                />

                {showSuggestions && (
                    <div className={styles["ui-autocomplete-suggestions"]} role="listbox">
                        {matches.length === 0 ? (
                            <div className={styles["ui-autocomplete-no-results"]}>
                                <div className={styles["ui-suggestion-content"]}>
                                    <span className={styles["ui-suggestion-text"]}>No results found for "{value}"</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {matches.map((match, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles["ui-autocomplete-suggestion"]} ${index === highlightedIndex ? styles["ui-highlighted"] : ""}`}
                                            onClick={() => onSelect(match)}
                                            role="option"
                                            aria-selected={index === highlightedIndex}
                                        >
                                            <div className={styles["ui-suggestion-content"]}>
                                                <span className={styles["ui-suggestion-text"]}>{match}</span>
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
