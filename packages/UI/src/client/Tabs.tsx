import React, { ReactElement, ReactNode, Suspense, useEffect, useId, useMemo, useState } from "react";

import { Card } from "../Card";
import { HelpIconWrapper } from "../HelpIcon";
import { LoadingSpinner } from "../LoadingSpinner";
import { StylingProps } from "../types";
import styles from "../styles/tabs.module.css";

export interface TabDef {
    label: ReactNode;
    id: string;
    info?: string;
    content: ReactNode;
}
interface TabsProps extends StylingProps {
    width: string; // tailwind width class
    children: Array<ReactElement<TabProps>>;
}

interface TabProps {
    id: string;
    title: string;
    info?: string;
    children: ReactNode;
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
                <HelpIconWrapper message={info} variant={"question"}>
                    {label}
                </HelpIconWrapper>
            ) : (
                label
            )}
        </button>
    );
};

export const Tab = ({children}: TabProps) => {
    return (
        <div>
            {children}
        </div>
    )
}

export const Tabs = ({ width = "full", children }: TabsProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(children[0].props.id);
    const [activeTab, setActiveTab] = useState<typeof children[0]>(children[0]);

    const tabsId = useId();

    const onTabSelect = (tabId: string) => {
        setSelectedId(tabId);
        setActiveTab(children.find(tab => tab.props.id === tabId)!)
    };

    return (
        <>
            <div id={tabsId} className={styles["tab-container"]} role="tablist">
                {children.map((tab) => (
                    <TabButton
                        key={`button-${tab.props.id}`}
                        label={tab.props.title}
                        id={tab.props.id}
                        info={tab.props.info}
                        isActive={tab.props.id === selectedId}
                        onClick={onTabSelect}
                    ></TabButton>
                ))}
            </div>

            <Card variant="full" hover={false} role="tabpanel">
                <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                    {activeTab}
                </Suspense>
            </Card>
        </>
    );
};
