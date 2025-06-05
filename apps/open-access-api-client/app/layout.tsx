import "./globals.css";

import type { Metadata } from "next";
import __navConfig from "@/config/navigation.config";
import { RootLayout as StandardRootLayout, ThemeVariant } from "@niagads/ui/layouts";
import favicon from "@niagads/common/assets/images/favicon.ico";

// import { MenuItem, NavigationBar } from "@niagads/ui";

export const metadata: Metadata = {
    title: "NIAGADS Open Access API",
    description: "Documentation and visualization endpoints for the NIAGADS Open Access API",
    icons: {
        icon: favicon.src,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const theme: ThemeVariant = (process.env.NEXT_PUBLIC_THEME as ThemeVariant) || "primary";

    const bannerMsg = process.env.NEXT_PUBLIC_MESSAGE || undefined;

    return (
        <html>
            <body>
                <StandardRootLayout
                    theme={theme}
                    navigationContent={__navConfig}
                    fullWidth={true}
                    bannerMsg={bannerMsg}
                >
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
