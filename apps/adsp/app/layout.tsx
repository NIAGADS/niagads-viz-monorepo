import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { ADSP_DATA } from "@/lib/data";
import { Footer } from "@niagads/ui";
import "./globals.css";

export const metadata: Metadata = {
    title: { default: "ADSP Data · NIAGADS", template: "%s · ADSP Data · NIAGADS" },
    description: "Your guide to the ADSP sequencing data resource (NG00067) at NIAGADS.",
};

const footerLinks = [
    { display: "DSS · NG00067", url: ADSP_DATA.links.ng00067 },
    { display: "adseq.org", url: ADSP_DATA.links.adseq },
    { display: "Support", url: ADSP_DATA.links.support },
];

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        fontFamily: "var(--font-sans)",
                        color: "var(--text-primary)",
                        background: "var(--gray-50)",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <SiteHeader />
                    {children}
                    <Footer siteName="ADSP Data · NIAGADS" links={footerLinks} />
                </div>
            </body>
        </html>
    );
}
