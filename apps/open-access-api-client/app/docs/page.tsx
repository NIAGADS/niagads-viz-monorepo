"use client";
import { RedocStandalone } from "redoc";

export default function Page() {
    return (
        <main>
            <RedocStandalone specUrl="/openapi.json" />
        </main>
    );
}
