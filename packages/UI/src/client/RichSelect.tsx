import React, { ReactNode, useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";
import styles from "../styles/richselect.module.css";

interface RichSelectProps {
    options: Record<string, ReactNode>;
    onChange: (selection: string) => void;
    placeholder?: string;
    value?: string;
}

export const RichSelect = ({ options, onChange, placeholder, value }: RichSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedValue, setSelectedValue] = useState(value || "");

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const optionKeys = Object.keys(options);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsOpen(true);
                }
                return;
            }

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < optionKeys.length - 1 ? prev + 1 : prev));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0) {
                        handleSelect(optionKeys[highlightedIndex]);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    setIsOpen(false);
                    setHighlightedIndex(-1);
                    break;
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, highlightedIndex, optionKeys]);

    const handleSelect = (option: string) => {
        setSelectedValue(option);
        onChange(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    return (
        <div className={styles["ui-customselect-container"]} ref={containerRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={styles["ui-select-button"]}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Select option"
            >
                <span className={selectedValue ? styles["ui-select-value"] : styles["ui-select-placeholder"]}>
                    {selectedValue || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`${styles["ui-select-chevron"]} ${isOpen ? styles["ui-chevron-open"] : ""}`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className={styles["ui-customselect-dropdown"]} role="listbox">
                    {optionKeys.length === 0 ? (
                        <div className={styles["ui-customselect-no-results"]}>
                            <div className={styles["ui-customselect-content"]}>
                                <span className={styles["ui-customselect-text"]}>No options available</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {optionKeys.map((optionKey: string, index: number) => (
                                <div
                                    key={optionKey}
                                    className={`${styles["ui-customselect-option"]} ${
                                        index === highlightedIndex ? styles["ui-highlighted"] : ""
                                    } ${optionKey === selectedValue ? styles["ui-selected"] : ""}`}
                                    onClick={() => handleSelect(optionKey)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    role="option"
                                    aria-selected={optionKey === selectedValue}
                                >
                                    <span className={styles["ui-customselect-text"]}>{optionKey}</span>
                                    <div className={styles["ui-customselect-component"]}>{options[optionKey]}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
