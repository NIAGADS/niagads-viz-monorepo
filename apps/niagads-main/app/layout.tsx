import "./globals.css";

import { Inter, Lato, Roboto_Mono } from "next/font/google";

import { LoadingProvider } from "@niagads/common";
import type { Metadata } from "next";
import type React from "react";


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


// Viewport (Next.js handles meta injection)
export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: "NIAGADS",
    description:
        "NIAGADS is a collaborative agreement between the National Institute on Aging and the University of Pennsylvania that stores and distributes genetics and genomics data from studies on Alzheimer’s disease, related dementias, and aging to qualified researchers globally.",
};

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
}
