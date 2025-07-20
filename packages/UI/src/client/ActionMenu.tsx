import React, { ReactNode, useEffect, useRef, useState } from "react";

import { StylingProps } from "../types";
import styles from "../styles/actionmenu.module.css";

interface ActionMenuProps extends StylingProps {
    onChange: (value: string) => void;
    label: string;
    children: ReactNode;
}

export const ActionMenu = ({ label, children, className = "", style = {} }: ActionMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const buttonId = `actionmenu-toggle-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`${styles.actionMenu} ${className}`} style={style} ref={ref}>
            <button
                id={buttonId}
                className={styles.toggle}
                onClick={() => setOpen((o) => !o)}
                type="button"
                aria-expanded={open}
            >
                {label}
                <span className={styles.arrow}>&#9662;</span>
            </button>
            {open && (
                <div className={styles.menu} style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            )}
        </div>
    );
};
