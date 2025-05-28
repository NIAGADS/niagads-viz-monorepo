"use client";

import { RedocStandalone } from "redoc";
//https://redocly.com/docs/redoc/deployment/react
//<RedocStandalone spec={/* spec as an object */} 
export default function Page() {
    return (
        <main>
            <RedocStandalone specUrl="docs/openapi.json" />
        </main>
    );
}
