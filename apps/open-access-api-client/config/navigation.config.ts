import type { NavigationConfig } from "@niagads/ui";

const Config: NavigationConfig = {
    brand: {
        label: "NIAGADS",
        href: "https://www.niagads.org",
    },
    items: [
        {
            label: "Open Access API",
            href: "/",
        },
        {
            label: "Documentation",
            href: "/docs"
        }
    ],
    variant: "dark",
    publicHostUrl: ""
}

export default Config;