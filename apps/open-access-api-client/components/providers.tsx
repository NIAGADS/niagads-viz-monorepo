"use client";

import { LoadingProvider as CommonLoadingProvider } from "@niagads/common";
import type { ReactNode } from "react";

export function LoadingProvider({ children }: { children: ReactNode }) {
    return <CommonLoadingProvider>{children}</CommonLoadingProvider>;
}
