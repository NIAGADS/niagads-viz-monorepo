import React, { Children } from "react";
import { ReactElement, useState } from "react";

import styles from "./side-nav.module.css";

interface SideNavSectionProps {
    id: string;
    label: string;
    children: ReactElement | ReactElement[];
}

export const SideNavSection = ({ id, label, children }: SideNavSectionProps) => {
    return <section>{children}</section>;
};

interface TabbedSideNavProps {
    children: ReactElement<SideNavSectionProps>[];
    onSectionChange?: (tabId: string) => void;
    selectedSection?: string;
}

export const TabbedSideNav = ({ children, onSectionChange }: TabbedSideNavProps) => {
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(children[0].props.id);

    return (
        <div className={styles["side-nav-container"]}>
            <nav className={styles["side-nav-section-selector"]} aria-label="Access sections">
                <ul className={styles["side-nav-sections"]}>
                    {(children ?? []).map((s: any, $index: number) => (
                        <li key={$index}>
                            <span
                                className={selectedSectionId === s.props.id ? styles["side-nav-section-selected"] : styles["side-nav-section"]}
                                aria-current={s.current}
                                onClick={() => setSelectedSectionId(s.props.id)}
                            >
                                {s.props.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles["side-nav-display"]}>
                {children.map((section) => {
                    const isActive = section.props.id === selectedSectionId;
                    return (
                        <div
                            key={section.props.id}
                            style={{ display: isActive ? "block" : "none" }}
                            aria-hidden={!isActive}
                        >
                            {section}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
