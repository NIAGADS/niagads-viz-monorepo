"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

export default function DocsPage() {
    return <ApiReferenceReact configuration={{ url: process.env.NEXT_PUBLIC_OPENAPI_URL }} />;
}
