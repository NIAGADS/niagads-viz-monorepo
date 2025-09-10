"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@niagads/ui";
import { MobileMenu } from "@/components/mobile-menu";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
            <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
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
