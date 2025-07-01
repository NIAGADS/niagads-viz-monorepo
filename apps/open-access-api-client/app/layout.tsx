import "@/styles/globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import __navConfig from "@/config/navigation.config";
import favicon from "@niagads/common/assets/images/favicon.ico";

export const metadata: Metadata = {
    title: "NIAGADS Open Access API",
    description: "Documentation and visualization endpoints for the NIAGADS Open Access API",
    icons: {
        icon: favicon.src,
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
