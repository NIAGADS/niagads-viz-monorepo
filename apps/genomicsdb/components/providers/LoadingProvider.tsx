"use client";

import { LoadingProvider as CommonLoadingProvider } from "@niagads/common";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    return <CommonLoadingProvider>{children}</CommonLoadingProvider>;
}
