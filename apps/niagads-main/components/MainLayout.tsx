"use client";

import { Footer } from "@niagads/ui";
import { BackToTop, Header } from "@niagads/ui/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { type ReactNode } from "react";
import logo from "@public/niagads-logo.svg";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
    children: ReactNode;
}

const navigationLinks = [
    { text: "About Us", url: "/about" },
    { text: "News", url: "/news" },
    { text: "Publications", url: "/publications" },
    { text: "Cite and Acknowledge", url: "" },
    { text: "Help", url: "" },
];

export const MainLayoutContent = ({ children }: MainLayoutProps) => {
    const pathname = usePathname();
    return (
        <div className="app-container">
            <Header
                logo={<Image width={200} height={60} src={logo} alt="NIAGADS" loading="eager" />}
                links={navigationLinks.map((link) => ({
                    ...link,
                    active: pathname === link.url || pathname.startsWith(`${link.url}/`),
                    url: link.url,
                }))}
                linkComponent={Link}
                mobileMenu
                mobileMenuConfig={{
                    footer: <div>NIAGADS</div>,
                }}
            />
            <div className="content-container">
                <main className="main-content">{children}</main>
            </div>

            <Footer
                siteName="NIAGADS"
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

// Dynamically import/export the MainLayout to bypass server-side rendering and eliminate style flash
// caused by the style-injected @niagads/UI
export const MainLayout = dynamic(() => Promise.resolve(MainLayoutContent), { ssr: false });
