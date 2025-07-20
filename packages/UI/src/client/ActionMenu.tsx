import React, { ReactNode, useEffect, useRef, useState } from "react";

import { Button } from "../Button";
import { InlineIcon } from "../InlineIcon";
import { StylingProps } from "../types";
import styles from "../styles/actionmenu.module.css";

interface ActionMenuProps extends StylingProps {
    label: string;
    icon: React.ElementType;
    children: ReactNode;
}

export const ActionMenu = ({ label, icon, children, className = "", style = {} }: ActionMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const buttonId = `actionmenu-toggle-${Math.random().toString(36).substr(2, 9)}`;
    const Icon = icon;

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
            <Button id={buttonId} className={styles.toggle} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                {icon ? <InlineIcon icon={<Icon size={18} />}>{label}</InlineIcon> : label}
                <span className={styles.arrow}>&#9662;</span>
            </Button>
            {open && (
                <div className={styles.menu} style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            )}
        </div>
    );
};
