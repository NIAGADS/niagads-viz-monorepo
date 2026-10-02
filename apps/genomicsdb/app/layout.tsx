import "./globals.css";

import { LoadingProvider, SessionProvider } from "@/components/providers";

import { APP_METADATA } from "@/data/metadata";
import { MainLayout } from "@/components/MainLayout";
import type React from "react";
import { authOptions } from "./api/auth/[...nextauth]/authConfig";
import { getServerSession } from "next-auth";

// Viewport (Next.js handles meta injection)
export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata = APP_METADATA;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body>
                <LoadingProvider>
                    <SessionProvider session={session}>
                        <MainLayout>{children}</MainLayout>
                    </SessionProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
