import React, { useEffect, useRef, useState } from "react";

import { StylingProps } from "../types";
import styles from "../styles/dropdown.module.css";

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps extends StylingProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Dropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className = "",
    style = {},
}: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const buttonId = `dropdown-toggle-${Math.random().toString(36).substr(2, 9)}`;
    const listboxId = `dropdown-listbox-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = options.find((opt) => opt.value === value);

    return (
        <div className={`${styles.dropdown} ${className}`} style={style} ref={ref}>
            <button
                id={buttonId}
                className={styles.toggle}
                onClick={() => setOpen((o) => !o)}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
            >
                {selected ? selected.label : <span className={styles.placeholder}>{placeholder}</span>}
                <span className={styles.arrow}>&#9662;</span>
            </button>
            {open && (
                <ul id={listboxId} className={styles.menu} role="listbox" aria-labelledby={buttonId}>
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className={opt.value === value ? styles.selected : styles.option}
                            role="option"
                            aria-selected={opt.value === value}
                            tabIndex={0}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
