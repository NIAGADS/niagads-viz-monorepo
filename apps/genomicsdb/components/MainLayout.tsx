"use client";

import React, { type ReactNode } from "react";
import { Header } from "./Header/Header";
import { Footer } from "@niagads/ui";
import { BackToTop } from "./BackToTop";

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
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
