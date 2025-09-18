import React, { ReactElement, ReactNode, useEffect, useId, useState } from "react";
import { Card } from "../Card";
import { HelpIconWrapper } from "../HelpIcon";
import { StylingProps } from "../types";
import styles from "../styles/tabs.module.css";

interface TabsProps extends StylingProps {
    children: ReactElement<TabProps>[];
}

export const Tabs = ({ children }: TabsProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(children[0].props.id);
    const tabsId = useId();

    return (
        <>
            <div id={tabsId} className={styles["tab-container"]} role="tablist">
                {children.map((tab) => (
                    <TabButton
                        key={`button-${tab.props.id}`}
                        id={tab.props.id}
                        isActive={tab.props.id === selectedId}
                        onClick={(id) => setSelectedId(id)}
                    >
                        {tab.props.children.find((child) => child.type === TabHeader)}
                    </TabButton>
                ))}
            </div>

            <Card variant="full" hover={false} role="tabpanel">
                {children.map((tab) => {
                    const isActive = tab.props.id === selectedId;
                    return (
                        <div
                            key={tab.props.id}
                            style={{ display: isActive ? "block" : "none" }}
                            aria-hidden={!isActive}
                        >
                            {tab.props.children.find((child) => child.type === TabBody)}
                        </div>
                    );
                })}
            </Card>
        </>
    );
};

type TabButtonProps = {
    id: string;
    info?: string;
    isActive: boolean;
    onClick: (id: string) => void;
    children: ReactNode;
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
    children: ReactNode;
}

export const TabBody = ({ children }: TabBodyProps) => {
    return <div>{children}</div>;
};

interface TabBodyProps {
    children: ReactNode;
}

export const TabHeader = ({ children }: TabHeaderProps) => {
    return <div>{children}</div>;
};

interface TabProps {
    id: string;
    children: ReactElement<TabBodyProps | TabButtonProps>[];
}

export const Tab = ({ children }: TabProps) => {
    return <div>{children}</div>;
};
