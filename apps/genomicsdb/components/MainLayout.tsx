"use client";

import React, { type ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@niagads/ui";
import { BackToTop } from "@niagads/ui/client";
import dynamic from "next/dynamic";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayoutContent = ({ children }: MainLayoutProps) => {
    return (
        <div className="app-container">
            <Header />

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

// Dynamically import/export the header to bypass server-side rendering and eliminate style flash
// caused by the style-injected @niagads/UI
export const MainLayout = dynamic(() => Promise.resolve(MainLayoutContent), { ssr: false });
