import React, { ReactNode, Suspense, useEffect, useId, useMemo, useState } from "react";

import { Card } from "../Card";
import { HelpIconWrapper } from "./HelpIcon";
import { LoadingSpinner } from "../LoadingSpinner";
import { StylingProps } from "../types";
import styles from "../styles/tabs.module.css";

export interface TabDef {
    label: string;
    id: string;
    info?: string;
    content: ReactNode;
}

interface TabsProps extends StylingProps {
    tabs: TabDef[];
    width: string; // tailwind width class
}

type TabButtonProps = Omit<TabDef, "content"> & {
    isActive: boolean;
    onClick: any;
};

const TabButton = ({ label, id, info, isActive, onClick }: TabButtonProps) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const buttonId = useId();

    useEffect(() => {
        setIsSelected(isActive);
    }, [isActive]);

    const onSelect = () => {
        setIsSelected(true);
        onClick(id);
    };

    return (
        <button
            key={buttonId}
            className={`${styles["tab-item"]} ${isSelected ? styles.active : ""}`}
            onClick={onSelect}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`tabpanel-${id}`}
        >
            {info ? (
                <HelpIconWrapper anchorId={`help-${buttonId}`} message={info} variant={"question"}>
                    {label}
                </HelpIconWrapper>
            ) : (
                label
            )}
        </button>
    );
};

export const Tabs = ({ tabs, width = "full" }: TabsProps) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(tabs && tabs.length > 0 ? tabs[0].id : null);
    const [activeTab, setActiveTab] = useState<TabDef | null>(tabs && tabs.length > 0 ? tabs[0] : null);

    const tabsId = useId();

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
                <div id={tabsId} className={styles["tab-container"]} role="tablist">
                    {tabs.map((tab) => (
                        <TabButton
                            key={`button-${tab.id}`}
                            label={tab.label}
                            id={tab.id}
                            info={tab.info}
                            isActive={tab.id === activeTab.id}
                            onClick={onTabSelect}
                        ></TabButton>
                    ))}
                </div>

                <Card variant="full" hover={false} role="tabpanel">
                    <Suspense fallback={<LoadingSpinner message="Loading..." />}>{memoizedTabContent}</Suspense>
                </Card>
            </>
        )
    );
};
