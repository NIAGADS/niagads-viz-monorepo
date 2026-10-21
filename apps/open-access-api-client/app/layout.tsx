import "./globals.css";

import { MainLayout } from "@/components/MainLayout";
import { LoadingProvider } from "@/components/providers";
import { APP_METADATA } from "@/data/metadata";

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata = APP_METADATA;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <LoadingProvider>
                    <MainLayout>{children}</MainLayout>
                </LoadingProvider>
            </body>
        </html>
    );
}
