import "./globals.css";

import { APP_METADATA } from "@/data/metadata";
import { LoadingProvider } from "@/components/providers";
import { MainLayout } from "@/components/MainLayout";
import type React from "react";
import logo from "@public/niagads-logo.svg";

// Viewport (Next.js handles meta injection)
export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata = APP_METADATA;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <LoadingProvider>
                    <MainLayout>{children}</MainLayout>
                </LoadingProvider>
            </body>
        </html>
    );
}
