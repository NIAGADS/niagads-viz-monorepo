import { Home } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_SERVICE_NAME,
    description: process.env.NEXT_PUBLIC_SERVICE_DESCRIPTION,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body
                style={{
                    minHeight: "100vh",
                    margin: 0,
                    background: "#f8fafc",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem 2rem",
                        background: "#fff",
                        borderBottom: "1px solid #e5e7eb",
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)",
                    }}
                >
                    <img
                        src={process.env.NEXT_PUBLIC_LOGO || "/images/logo.svg"}
                        alt="NIAGADS Logo"
                        style={{ height: 32, width: 32 }}
                    />
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            letterSpacing: "0.01em",
                            color: "#1e293b",
                        }}
                    >
                        {process.env.NEXT_PUBLIC_NAME || "NIAGADS Genome Browser"}
                    </span>
                    <div style={{ flex: 1 }} />
                    {process.env.NEXT_PUBLIC_HOME && (
                        <Link
                            href={process.env.NEXT_PUBLIC_HOME}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                color: "#2563eb",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1rem",
                            }}
                        >
                            <Home size={20} /> Home
                        </Link>
                    )}
                </nav>
                <main
                    style={{
                        width: "80%",
                        margin: "0 auto",
                        paddingTop: "2.5rem",
                        minHeight: "calc(100vh - 64px)",
                    }}
                >
                    {children}
                </main>
            </body>
        </html>
    );
}
