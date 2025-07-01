"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import type { ReactNode } from "react";

interface ConditionalMainLayoutProps {
    children: ReactNode;
}

export function ConditionalMainLayout({ children }: ConditionalMainLayoutProps) {
    const pathname = usePathname();

    // Define which pages should have the header search
    const pagesWithSearch = ["/", "/browse-datasets", "/genome-browser", "/search"];
    const shouldShowSearch = true;

    // Option for future: define pages WITHOUT search (if needed)
    // const pagesWithoutSearch: string[] = [] // Add paths here if you want to exclude search
    // const shouldShowSearch = !pagesWithoutSearch.some(path =>
    //   path === "/" ? pathname === "/" : pathname.startsWith(path)
    // )

    // Customize search placeholder and suggestions based on the page
    const getSearchConfig = () => {
        if (pathname.startsWith("/browse-datasets")) {
            return {
                placeholder: "Search datasets, genes, variants...",
                suggestions: ["APOE", "TREM2", "APP", "PSEN1", "Alzheimer's disease"],
            };
        }
        if (pathname.startsWith("/genome-browser")) {
            return {
                placeholder: "Search genes, regions (e.g., chr19:44905791-44909393)",
                suggestions: ["APOE", "chr19:44905791-44909393", "rs429358"],
            };
        }
        if (pathname.startsWith("/search")) {
            return {
                placeholder: "Refine your search...",
                suggestions: ["APOE", "TREM2", "APP", "PSEN1"],
            };
        }
        return {
            placeholder: "Search genes, variants, datasets...",
            suggestions: ["APOE", "TREM2", "APP", "PSEN1"],
        };
    };

    const searchConfig = getSearchConfig();

    return (
        <MainLayout
            showHeaderSearch={shouldShowSearch}
            headerSearchPlaceholder={searchConfig.placeholder}
            headerSearchSuggestions={searchConfig.suggestions}
        >
            {children}
        </MainLayout>
    );
}
