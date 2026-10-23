import type { Metadata } from "next";

export const APP_METADATA: Metadata = {
    title: {
        default: "NIAGADS Open Access API",
        template: "%s | NIAGADS Open Access API",
    },
    description:
        "Explore NIAGADS open access genetics and genomics data for Alzheimer's disease and related dementias with ASK NIAGADS and the API documentation.",
    keywords: ["NIAGADS", "Alzheimer's disease", "genetics", "genomics", "API"],
    authors: [{ name: "NIAGADS Team" }],
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};
