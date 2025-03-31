import React from "react";

import { RootLayoutProps } from "./types";
import { Navigation } from "../Navigation";

/**
 * RootLayout provides basic navigation and a container for the <main> section
 */
export function RootLayout({ children, navConfig, fullWidth = false }: RootLayoutProps) {
    return (
        <div className="min-h-full">
            <header className="bg-white shadow-accent shadow-md">
                <Navigation {...navConfig} />
            </header>
            <main className="mt-[60px] p-2">
                <div className={`ui-container ${fullWidth ? "full" : ""}`}>{children}</div>
            </main>
        </div>
    );
}
