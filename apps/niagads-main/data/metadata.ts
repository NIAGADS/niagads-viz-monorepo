import { Metadata } from "next";

export const APP_METADATA: Metadata = {
    title: "NIAGADS",
    keywords: "genomics, alzheimer's, genetics, database, NIAGADS",
    manifest: "/site.webmanifest",
    icons: {
        icon: [
            {
                url: "/favicon.svg",
                type: "image/svg+xml",
            },
            {
                url: "/favicon-96x96.png",
                type: "image/png",
                sizes: "96x96",
            },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
            },
        ],
    },
    authors: [{ name: "NIAGADS Team" }],
    description:
        "NIAGADS is a collaborative agreement between the National Institute on Aging and the University of Pennsylvania that stores and distributes genetics and genomics data from studies on Alzheimer’s disease, related dementias, and aging to qualified researchers globally.",
};
