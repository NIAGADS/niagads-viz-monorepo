"use client";

import dynamic from "next/dynamic";
//FIXME: hardcoded version
const RapiDoc = dynamic(() => import("@/component_wrappers/RapiDocWrapper"), { ssr: false });
export default function Page() {
    return (
        <main>
            <RapiDoc specUrl="v0/openapi.yaml" />
        </main>
    );
}
