import "./globals.css";

import type { Metadata } from "next";
import favicon from "@niagads/common/assets/images/favicon.ico";

// import { MenuItem, NavigationBar } from "@niagads/ui";

// TODO: update tailwind imported fonts w/localFonts
// see layout.tsx.orig

export const metadata: Metadata = {
    title: "NIAGADS Open Access API",
    description: "Documentation and visualization endpoints for the NIAGADS Open Access API",
    icons: {
        icon: favicon.src,
    },
};

const NAV_MENU_ITEMS = [
    { label: "Documentation", href: "/docs" },
    { label: "NIAGADS Home", href: "https://www.niagads.org" },
    { label: "Open Access", href: "https://www.niagads.org/open-access" },
    { label: "Usage", href: "https://github.com/NIAGADS/example" },
];

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <html lang="en">
                <body className={`m-0 antialiased`}>
                    <div className="flex flex-col h-screen justify-between">
                        <header>
                            {/*<Alert variant="danger" message="API Temporarily Down"><p>Under maintenance from 1:00-2:00 PM 11/13/2024</p></Alert> */}
                            {/*<NavigationBar
                            variant="accent"
                            brand={{
                                label: "NIAGADS Open Access API",
                                href: "/",
                            }}
                            menuItems={NAV_MENU_ITEMS}></NavigationBar>*/}
                        </header>
                        {children}

                        <footer className="bg-primary text-white">
                            <div className="flex flex-row justify-between items-center text-lg p-4">
                                <div>
                                    Questions? Contact us at{" "}
                                    <span>
                                        <a
                                            className="text-white underline"
                                            href="mailto:help@niagads.org?subject=NIAGADS API"
                                        >
                                            help@niagads.org
                                        </a>
                                    </span>{" "}
                                    with the subject: <em>NIAGADS API</em>
                                </div>
                                <div>© Copyright 2024 University of Pennslyvania, Perelman School of Medicine</div>
                            </div>
                        </footer>
                    </div>
                </body>
            </html>
        </>
    );
}
