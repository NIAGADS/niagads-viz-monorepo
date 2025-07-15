"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import Sidebar from "@/components/records/RecordSidebar";
import { Footer } from "@niagads/ui/client";
import { MobileMenu } from "@/components/mobile-menu";

interface MainLayoutProps {
    children: ReactNode;
    showHeaderSearch?: boolean;
    headerSearchPlaceholder?: string;
    headerSearchSuggestions?: string[];
}

export function MainLayout({
    children,
    showHeaderSearch = false,
    headerSearchPlaceholder,
    headerSearchSuggestions = [],
}: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Sidebar only shows on search results page
    const shouldShowSidebar = pathname === "";

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add("mobile-menu-open");
        } else {
            document.body.classList.remove("mobile-menu-open");
        }

        return () => {
            document.body.classList.remove("mobile-menu-open");
        };
    }, [mobileMenuOpen]);

    return (
        <div className="app-container">
            <Header
                onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                showSearch={showHeaderSearch}
                searchPlaceholder={headerSearchPlaceholder}
                searchSuggestions={headerSearchSuggestions}
            />
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                showSearch={showHeaderSearch}
                searchPlaceholder={headerSearchPlaceholder}
                searchSuggestions={headerSearchSuggestions}
            />

            <div className="content-container">
                {/*shouldShowSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />*/}
                {/*shouldShowSidebar && sidebarOpen && (
                    <div
                        className={`mobile-menu-overlay ${sidebarOpen ? "open" : ""}`}
                        onClick={() => setSidebarOpen(false)}
                    />
                )*/}
                <main className={`main-content ${shouldShowSidebar ? "with-sidebar" : "without-sidebar"}`}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
