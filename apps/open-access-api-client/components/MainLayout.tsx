"use client";

import { Footer, NIAGADSAPILogo } from "@niagads/ui";
import { BackToTop, Header } from "@niagads/ui/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigationLinks = [
    { text: "ASK NIAGADS", url: "/ask" },
    { text: "Open Access", url: "/open-access" },
    { text: "NIAGADS Home", url: "https://www.niagads.org" },
    { text: "API documentation", url: "/docs" },
];

const MainLayoutContent = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    return (
        <div className="app-container">
            <Header
                logo={
                    <NIAGADSAPILogo
                        variant="white"
                        width={200}
                        height={48.26}
                        role="img"
                        aria-label="NIAGADS Open Access API"
                    />
                }
                links={navigationLinks.map((link) => ({
                    ...link,
                    active: link.url.startsWith("/") && (pathname === link.url || pathname.startsWith(`${link.url}/`)),
                }))}
                linkComponent={Link}
                mobileMenu
                mobileMenuConfig={{ footer: <div>NIAGADS Open Access API</div> }}
            />
            <div className="content-container">
                <main className="main-content">{children}</main>
            </div>
            <Footer
                siteName="NIAGADS"
                links={[
                    { display: "About", url: "https://www.niagads.org/about" },
                    { display: "Contact", url: "https://niagads.scrollhelp.site/support/contact-our-support-team" },
                    { display: "Privacy", url: "https://www.niagads.org/privacy-policy/" },
                    { display: "Terms", url: "https://niagads.scrollhelp.site/support/code-of-conduct" },
                ]}
            />
            <BackToTop />
        </div>
    );
};

// Match the other apps' client layout to avoid flashes from UI style injection.
export const MainLayout = dynamic(() => Promise.resolve(MainLayoutContent), { ssr: false });
