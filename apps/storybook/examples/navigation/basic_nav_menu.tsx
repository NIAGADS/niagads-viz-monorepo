import { NavigationConfig } from "@niagads/ui";

export const NAV_DEFINTION: NavigationConfig = {
    brand: { label: "NIAGADS", href: "https://www.niagads.org" },
    items: [
        { label: "Home", href: "/" },
        { label: "GenomicsDB", href: "https://www.niagads.org/genomics", target: "_blank" },
        { label: "Documentation", href: "/docs", target: "_self" },
    ],
    variant: "white",
    publicHostUrl: "http://localhost:6006",
};
