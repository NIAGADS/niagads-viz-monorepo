import "./globals.css";

import type { Metadata } from "next";
import NavigationConfig from "@/config/navigation.config";
import { RootLayout as StandardRootLayout } from "@niagads/ui/layouts";
import favicon from "@niagads/common/assets/images/favicon.ico";

// import { MenuItem, NavigationBar } from "@niagads/ui";

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
        <html>
            <body>
                <StandardRootLayout navConfig={NavigationConfig} fullWidth={true}>
                    {children}
                    <footer className="footer-bg-primary">
                        <div className="footer-content">
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
                </StandardRootLayout>
            </body>
        </html>
    );
}
