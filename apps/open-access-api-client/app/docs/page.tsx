"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

import { fetchDocumentation, statusBadgeCss } from "./status-badges";

export default function DocsPage() {
    return (
        <ApiReferenceReact
            configuration={{
                url: process.env.NEXT_PUBLIC_OPENAPI_URL,
                agent: { disabled: true },
                hideClientButton: true,
                customFetch: fetchDocumentation,
                customCss: statusBadgeCss,
            }}
        />
    );
}
