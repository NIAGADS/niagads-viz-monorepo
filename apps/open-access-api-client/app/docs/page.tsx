"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@niagads/ui";

//FIXME: hardcoded version
const RapiDoc = dynamic(() => import("@/component_wrappers/RapiDocWrapper"), { ssr: false });
export default function Page() {
    return (
        <main>
            <Suspense fallback={<Skeleton type="default" />}>
                <RapiDoc specUrl="v0/openapi.yaml" />
            </Suspense>
        </main>
    );
}
