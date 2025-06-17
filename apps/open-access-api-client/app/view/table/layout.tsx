import { ReactNode } from "react";
export default function EmptyLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
