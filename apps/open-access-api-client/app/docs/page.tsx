"use client";

import { RedocStandalone, SideNavStyleEnum } from "redoc";

import React from "react";

//https://github.com/Redocly/redoc/blob/HEAD/docs/config.md

export default function Page() {
    return (
        <RedocStandalone
            specUrl="v0/openapi.json"
            options={{
                nativeScrollbars: true,
                pathInMiddlePanel: false,
                downloadDefinitionUrl: "v0/openapi.yaml",
                sideNavStyle: SideNavStyleEnum.PathOnly,
                // hideSchemaTitles: false,
                // menuToggle: true,
                theme: { colors: { primary: { main: "#dd5522" } } },
            }}
        />
    );
}
