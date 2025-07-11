import type React from "react";
import type { Metadata } from "next";
import { Inter, Roboto_Mono, Lato } from "next/font/google";
import { LoadingProvider } from "@/components/loading-context";
import { ConditionalMainLayout } from "@/components/conditional-main-layout";
import "@niagads/ui/css";
import "./globals.css";

// Add viewport export for better mobile performance
export const viewport = {
    width: "device-width",
    initialScale: 1,
};
// Configure Google Fonts
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

// const sourceSans = Source_Sans_3({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-source-sans",
//   weight: ["300", "400", "500", "600", "700"],
// })
const sourceSans = Lato({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-source-sans",
    weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
    title: "NIAGADS GenomicsDB",
    description: "An interactive knowledgebase for Alzheimer's disease (AD) genetics.",
    // SEO metadata
    keywords: "genomics, alzheimer's, genetics, database, NIAGADS",
    authors: [{ name: "NIAGADS Team" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${robotoMono.variable} ${sourceSans.variable}`}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={inter.className}>
                <LoadingProvider>
                    <ConditionalMainLayout>{children}</ConditionalMainLayout>
                </LoadingProvider>
            </body>
        </html>
    );
}
