import type { Metadata } from "next";
import { Providers } from "./provider";

import "./globals.css";
import NavigationMenu from "@/components/Navigation";

export const metadata: Metadata = {
    title: "NIAGADS IGVBrowser",
    description:
        "interactive genome visualization developed by the IGV team and customized by NIAGADS to display Alzheimer's disease relevant annotated variant, GWAS summary statistics, and xQTLs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <NavigationMenu></NavigationMenu>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
