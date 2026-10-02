import "./globals.css";

import { LoadingProvider } from "@/components/providers";
import { MainLayout } from "@/components/MainLayout";
import type { Metadata } from "next";
import type React from "react";

// Viewport (Next.js handles meta injection)
export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: "NIAGADS",
    keywords: "genomics, alzheimer's, genetics, database, NIAGADS",

    authors: [{ name: "NIAGADS Team" }],
    description:
        "NIAGADS is a collaborative agreement between the National Institute on Aging and the University of Pennsylvania that stores and distributes genetics and genomics data from studies on Alzheimer’s disease, related dementias, and aging to qualified researchers globally.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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

/*
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${inter.variable} ${robotoMono.variable} ${lato.variable}`}>
            <body className={inter.className}>
                <LoadingProvider></LoadingProvider>
                



            <body className="site-content">
                <Header
                    logo={
                        <figure>
                            <Image width={200} height={60} src={logo} alt="Niagads GenomicsDB logo" loading="eager" />
                        </figure>
                    }
                    links={[
                        { text: "About Us", url: "/about" },
                        { text: "Publications", url: "/publications" },
                        { text: "Cite and Acknowledge", url: "" },
                        { text: "Help", url: "" },
                    ]}
                />
                <div className="content-container">{children}</div>
                <Footer
                    siteName="NIAGADS"
                    links={[
                        { display: "About", url: "/about" },
                        { display: "Contact", url: "#" },
                        { display: "Privacy", url: "#" },
                        { display: "Terms", url: "#" },
                    ]}
                />
            </body>
        </html>
    );
} */
