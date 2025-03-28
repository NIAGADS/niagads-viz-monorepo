import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { renderWithHelpIcon } from "./HelpIcon";

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
        <button className={`ui-tab-button ${isSelected ? "ui-active-tab" : ""}`} key={id} onClick={onSelect}>
            {info
                ? renderWithHelpIcon(label, "question", info, `${sectionId ? sectionId + "_" : ""}-${id}-info`)
                : label}
        </button>
    );
};

export const Tabs = ({ sectionId, tabs, width = "full" }: TabsProps) => {
    const [selectedKey, setSelectedKey] = useState<string>(tabs[0].id);
    const [activeTab, setActiveTab] = useState<TabDef>(tabs[0]);

    useEffect(() => {
        const selectedTab = tabs.find((tab) => tab.id === selectedKey);
        setActiveTab(selectedTab!);
    }, [selectedKey]);

    const onTabSelect = (tabId: string) => {
        setSelectedKey(tabId);
    };

    return (
        activeTab && (
            <div className={`w-${width}`}>
                <div className="ui-tabs-container">
                    <ul className="ui-tab-list" role="tablist">
                        {tabs.map((tab) => (
                            <li className="ui-tab-list-item" key={`li-${tab.id}`}>
                                <TabButton
                                    key={`button-${tab.id}`}
                                    label={tab.label}
                                    sectionId={sectionId}
                                    id={tab.id}
                                    info={tab.info}
                                    isActive={tab.id === activeTab.id}
                                    onClick={onTabSelect}
                                ></TabButton>
                            </li>
                        ))}
                    </ul>
                    <div className="ui-tab-panel" key={activeTab.id}>
                        {activeTab.content}
                    </div>
                </div>
            </div>
        )
    );
};
