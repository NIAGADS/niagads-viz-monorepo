import React, { ReactNode, useMemo, useState } from "react";

import { renderWithHelpIcon } from "./HelpIcon";

/*
      <Tabs isDisabled aria-label="Options">
        <Tab key="photos" title="Photos">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
*/

interface TabStylingProps {
    variant?: "primary" | "secondary" | "accent" | "default" | "white";
    radius?: "none" | "sm" | "md" | "lg" | "xl";
    size?: "sm" | "md" | "lg";
}

interface TabConfig {
    label: string;
    info?: string;
}

interface TabProps extends TabConfig {
    index: number;
    isActive: boolean;
    setActiveTab: any;
}

interface TabListProps {
    fullWidth?: boolean;
    tabs: TabConfig[];
    defaultActiveTab?: number;
    setActiveTab: any;
}

interface TabList {
    setActiveTab: any;
    activeTab: number;
    children: ReactNode;
}

interface TabPanelProps {
    anchorId: string;
    children: ReactNode;
}

interface TabContainerProps {
    shadow?: boolean;
    activeTab?: number;
}

export const TabButton = ({
    label,
    index,
    info,
    variant,
    radius,
    size,
    isActive,
    setActiveTab,
}: TabProps & TabStylingProps) => {
    const renderTabButton = useMemo(
        () => (
            <button
                className={`ui-tab-button ${isActive ? "selected" : ""}`}
                key={`tab-${index}`}
                onClick={setActiveTab(index)}
            >
                {label}
            </button>
        ),
        [label, info]
    );
    return info
        ? renderWithHelpIcon(renderTabButton, "question", {
              tooltip: info,
              tooltipAnchor: `tab-${label}-${index}-info`,
          })
        : renderTabButton;
};

export const TabList = ({
    defaultActiveTab = 0,
    tabs,
    setActiveTab,
    fullWidth,
    variant,
    radius,
    size,
}: TabListProps & TabStylingProps) => {
    const [currentTab, setCurrentTab] = useState<number>(defaultActiveTab);

    return (
        <div className="ui-tabs">
            {tabs.map((tab, index) => (
                <Tab
                    label={tab.label}
                    index={index}
                    info={tab.info}
                    variant={variant}
                    radius={radius}
                    size={size}
                    isActive={index === currentTab}
                    setActiveTab={setActiveTab}
                ></Tab>
            ))}
        </div>
    );
};


export const TabPanel = () => {

    return <div className="ui-tab-panel">

    </div>
}

export const TabPanelContainer {

}


