import type { NavigationConfig } from "@niagads/ui";

const Config: NavigationConfig = {
    brand: {
        label: "NIAGADS Open Access API",
        href: process.env.NEXT_PUBLIC_HOST_URL!,
    },
    items: [
        {
            label: "Documentation",
            href: "/docs"
        },
        {
            label: "NIAGADS Home",
            href: "https://www.niagads.org",
        },

    ],
    publicHostUrl: process.env.NEXT_PUBLIC_HOST_URL
}

export default Config;