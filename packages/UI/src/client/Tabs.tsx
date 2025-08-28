import React, { Children, ReactElement, ReactNode, Suspense, useEffect, useId, useMemo, useState } from "react";

import { Card } from "../Card";
import { HelpIconWrapper } from "../HelpIcon";
import { LoadingSpinner } from "../LoadingSpinner";
import { StylingProps } from "../types";
import styles from "../styles/tabs.module.css";

interface TabsProps extends StylingProps {
    width: string; // tailwind width class
    children: Array<ReactElement<TabBodyProps> | ReactElement<TabHeaderProps>>;
}

export const Tabs = ({ width = "full", children }: TabsProps) => {
    const tabHeaders = children.filter(child => child.type === TabHeader) as Array<ReactElement<TabHeaderProps>>;
    const tabBodies = children.filter(child => child.type === TabBody) as Array<ReactElement<TabBodyProps>>;

    const [selectedId, setSelectedId] = useState<string | null>(tabHeaders[0].props.id);
    const [activeTab, setActiveTab] = useState<ReactElement<TabBodyProps>>(tabBodies[0]);

    const tabsId = useId();

    const onTabSelect = (tabId: string) => {
        setSelectedId(tabId);
        setActiveTab(tabBodies.find(tab => tab.props.id === tabId)!)
    };

    return (
        <>
            <div id={tabsId} className={styles["tab-container"]} role="tablist">
                {tabHeaders.map((header) => (
                    <TabButton
                        key={`button-${header.props.id}`}
                        id={header.props.id}
                        info={header.props.info}
                        isActive={header.props.id === selectedId}
                        onClick={onTabSelect}
                    >
                        {header.props.children}
                    </TabButton>
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

type TabButtonProps = {
    id: string;
    info?: string;
    isActive: boolean;
    onClick: any;
    children: ReactNode
};

const TabButton = ({ id, info, isActive, onClick, children }: TabButtonProps) => {
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
                    {children}
                </HelpIconWrapper>
            ) : (
                children
            )}
        </button>
    );
};

interface TabHeaderProps {
    id: string;
    info?: string;
    children: ReactNode;
}

export const TabBody = ({children}: TabBodyProps) => {
    return (
        <div>
            {children}
        </div>
    )
}

interface TabBodyProps {
    id: string;
    children: ReactNode;
}

export const TabHeader = ({children}: TabHeaderProps) => (<></>)

