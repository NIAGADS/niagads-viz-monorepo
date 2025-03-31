import type { Metadata } from "next";

import { RootLayout as StandardRootLayout } from "@niagads/ui/layouts";
import NavigationConfig from "@/config/navigation.config";

import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "NIAGADS Template next.js Application",
    description: "https://github.com/NIAGADS/nextjs-template",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body>
                <StandardRootLayout navConfig={NavigationConfig} fullWidth={false}>
                    {children}
                </StandardRootLayout>
            </body>
        </html>
    );
}
