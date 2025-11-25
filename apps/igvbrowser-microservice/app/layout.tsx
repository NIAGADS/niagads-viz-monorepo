import type { Metadata } from "next";

// import "@/styles/globals.css";

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
            <body>{children}</body>
        </html>
    );
}
