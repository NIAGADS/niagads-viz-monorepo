import { Inter, Lato, Roboto_Mono } from "next/font/google";
import { LoadingProvider } from "@/components/loading-context";
import type { Metadata } from "next";
import type React from "react";
import { MainLayout } from "@/components/main-layout";

import "./globals.css";

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
    description: "An interactive knowledgebase for Alzheimer's disease (AD) genetics.",
    keywords: "genomics, alzheimer's, genetics, database, NIAGADS",
    authors: [{ name: "NIAGADS Team" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${robotoMono.variable} ${lato.variable}`}>
            <body className={inter.className}>
                <LoadingProvider>
                    <MainLayout>{children}</MainLayout>
                </LoadingProvider>
            </body>
        </html>
    );
}