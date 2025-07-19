import React, { ReactNode, useEffect, useMemo, useState } from "react";

import { Card } from "../Card";
import { renderWithHelpIcon } from "./HelpIcon";
import styles from "../styles/tabs.module.css";

export interface TabDef {
    label: string;
    id: string;
    info?: string;
    content: ReactNode;
}

interface TabsProps {
    sectionId?: string;
    tabs: TabDef[];
    width: string; // tailwind width class
}

type TabButtonProps = Omit<TabDef, "content"> & {
    sectionId?: string;
    isActive: boolean;
    onClick: any;
};

const TabButton = ({ label, id, info, sectionId, isActive, onClick }: TabButtonProps) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        setIsSelected(isActive);
    }, [isActive]);

    const onSelect = () => {
        setIsSelected(true);
        onClick(id);
    };

    return (
        <button
            key={id}
            className={`${styles["tab-item"]} ${isSelected ? styles.active : ""}`}
            onClick={onSelect}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`tabpanel-${id}`}
        >
            {info
                ? renderWithHelpIcon(
                      label,
                      "question",
                      info,
                      `${sectionId ? sectionId + "_" : ""}-${id}-info`,
                      styles["tab-help-icon"]
                  )
                : label}
        </button>
    );
};

export const Tabs = ({ sectionId, tabs, width = "full" }: TabsProps) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(tabs && tabs.length > 0 ? tabs[0].id : null);
    const [activeTab, setActiveTab] = useState<TabDef | null>(tabs && tabs.length > 0 ? tabs[0] : null);

    useEffect(() => {
        if (tabs) {
            const selectedTab = tabs.find((tab) => tab.id === selectedKey);
            setActiveTab(selectedTab!);
        }
    }, [selectedKey]);

    const onTabSelect = (tabId: string) => {
        setSelectedKey(tabId);
    };

    const memoizedTabContent = useMemo(() => {
        return activeTab ? activeTab.content : null;
    }, [activeTab?.id]);

    return (
        activeTab && (
            <>
                <div className={styles["tab-container"]} role="tablist">
                    {tabs.map((tab) => (
                        <TabButton
                            key={`button-${tab.id}`}
                            label={tab.label}
                            sectionId={sectionId}
                            id={tab.id}
                            info={tab.info}
                            isActive={tab.id === activeTab.id}
                            onClick={onTabSelect}
                        ></TabButton>
                    ))}
                </div>
                <Card variant="full" hover={false} role="tabpanel">
                    {memoizedTabContent}
                </Card>
            </>
        )
    );
};
