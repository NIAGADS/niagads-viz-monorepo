import { Navigation, NavigationConfig } from "../Navigation";
import React, { ReactNode } from "react";

import { LayoutProps } from "./types";
import { ThemeVariant } from "../types";
import { isNavigationConfig } from "./utils";

interface RootLayoutProps extends LayoutProps {
    theme?: ThemeVariant;
    navigationContent: NavigationConfig | ReactNode;
    fullWidth?: boolean;
}

// FIXME: CSS -> main relative to "fixed" header, so that main adjusts appropriately when a site-banner is present

/**
 * RootLayout provides basic navigation and a container for the <main> section
 */
export function RootLayout({
    theme = "light",
    children,
    navigationContent,
    fullWidth = false,
    bannerMsg,
}: RootLayoutProps) {
    return (
        <div className="min-h-full">
            <header className="bg-white shadow-accent shadow-md">
                {isNavigationConfig(navigationContent) ? (
                    <Navigation variant={theme} config={navigationContent} bannerMsg={bannerMsg}></Navigation>
                ) : (
                    <Navigation variant={theme} bannerMsg={bannerMsg}>
                        {navigationContent}
                    </Navigation>
                )}
            </header>
            <main>
                <div className={`ui-container ${fullWidth ? "full" : ""}`}>{children}</div>
            </main>
        </div>
    );
}
