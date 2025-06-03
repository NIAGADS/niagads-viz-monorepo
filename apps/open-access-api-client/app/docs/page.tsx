"use client";

import dynamic from "next/dynamic";

const RapiDoc = dynamic(() => import("@/component_wrappers/RapiDocWrapper"), { ssr: false });
export default function Page() {
    return (
        <main>
            <RapiDoc specUrl="/openapi.json" />
        </main>
    );
}
