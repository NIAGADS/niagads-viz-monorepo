import React, { ReactNode, RefObject, useState } from "react";
import { ChevronDown } from "lucide-react";

import styles from "./collapsible-section.module.css";

interface CollapsibleSectionProps {
    id: string;
    title: string;
    ref: RefObject<HTMLDivElement>;
    meta?: string;
    defaultOpen?: boolean;
    children: ReactNode;
}

export const CollapsibleSection = ({
    id,
    title,
    ref,
    meta,
    defaultOpen = false,
    children,
}: CollapsibleSectionProps) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div ref={ref} className={`${styles["collapsible-section"]} ${open ? styles["open"] : ""}`} id={id}>
            <div className={styles["collapsible-section-header"]} onClick={() => setOpen((p) => !p)}>
                <span className={styles["collapsible-section-title"]}>{title}</span>
                {meta && <span className={styles["collapsible-section-meta"]}>{meta}</span>}
                <ChevronDown className={styles["collapsible-chevron"]} />
            </div>
            <div className={styles["collapsible-body"]}>
                <div className={styles["collapsible-body-inner"]}>{children}</div>
            </div>
        </div>
    );
};
