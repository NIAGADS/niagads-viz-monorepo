"use client";

import { useState, type ReactNode } from "react";

interface TabsProps {
    defaultValue: string;
    children: ReactNode;
}

export function Tabs({ defaultValue, children }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return <div className="tabs-container">{children}</div>;
}
