"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { Header } from "./Header/Header";
import { Footer } from "@niagads/ui";
import { BackToTop } from "./BackToTop";
import { MobileMenu } from "./MobileMenu/MobileMenu";

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Header onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <div className="content-container">
                <main className="main-content">{children}</main>
            </div>

            <Footer
                siteName="NIAGADS GenomicsDB"
                links={[
                    { display: "About", url: "/about" },
                    { display: "Contact", url: "#" },
                    { display: "Privacy", url: "#" },
                    { display: "Terms", url: "#" },
                ]}
            />
            <BackToTop />
        </div>
    );
};
