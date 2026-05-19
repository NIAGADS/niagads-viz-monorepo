import type { Metadata } from "next";
import type React from "react";
import { Inter, Lato, Roboto_Mono } from "next/font/google";
import { MainLayout } from "@/components/main-layout";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

// Viewport (Next.js handles meta injection)
export const viewport = {
    width: "device-width",
    initialScale: 1,
};

// Fonts
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
});

const lato = Lato({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-source-sans",
    weight: ["300", "400", "700"],
});

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
