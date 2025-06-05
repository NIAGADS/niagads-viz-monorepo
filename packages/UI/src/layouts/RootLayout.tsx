import React, { ReactNode } from "react";

import { Navigation, NavigationConfig } from "../Navigation";
import { LayoutProps } from "./types";
import { ThemeVariant } from "../types";
import { isNavigationConfig } from "./utils";

interface RootLayoutProps extends LayoutProps {
    variant?: ThemeVariant;
    navigationContent: NavigationConfig | ReactNode;
    fullWidth?: boolean;
}
/**
 * RootLayout provides basic navigation and a container for the <main> section
 */
export function RootLayout({ variant = "light", children, navigationContent, fullWidth = false }: RootLayoutProps) {
    return (
        <div className="min-h-full">
            <header className="bg-white shadow-accent shadow-md">
                {isNavigationConfig(navigationContent) ? (
                    <Navigation variant={variant} config={navigationContent}></Navigation>
                ) : (
                    <Navigation variant={variant}>{navigationContent}</Navigation>
                )}
            </header>
            <main className="mt-[60px] p-2">
                <div className={`ui-container ${fullWidth ? "full" : ""}`}>{children}</div>
            </main>
        </div>
    );
}
