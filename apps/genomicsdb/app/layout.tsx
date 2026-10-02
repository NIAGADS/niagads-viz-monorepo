import "./globals.css";

import { LoadingProvider, SessionProvider } from "@/components/providers";

import { MainLayout } from "@/components/MainLayout";
import type { Metadata } from "next";
import type React from "react";
import { authOptions } from "./api/auth/[...nextauth]/authConfig";
import { getServerSession } from "next-auth";

// Viewport (Next.js handles meta injection)
export const viewport = {
    width: "device-width",
    initialScale: 1,
};

// Metadata
export const metadata: Metadata = {
    title: "NIAGADS GenomicsDB",
    description: "An interactive knowledge base for Alzheimer's disease (AD) genetics.",
    // SEO metadata
    keywords: "genomics, alzheimer's, genetics, database, NIAGADS",
    authors: [{ name: "NIAGADS Team" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en" className={`${inter.variable} ${robotoMono.variable} ${lato.variable}`}>
            <body className={inter.className}>
                <LoadingProvider>
                    <SessionProvider session={session}>
                        <MainLayout>{children}</MainLayout>
                    </SessionProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
