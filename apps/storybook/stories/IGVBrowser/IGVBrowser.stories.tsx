import { IGVBrowser, IGVBrowserTrack, IGVBrowserWithSelector } from "@niagads/igv";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
// Story with parent component and external locus controls
import React, { useState } from "react";

import { qtlTracks } from "../../examples/igvbrowser-tracks";

const noop = () => {};

const meta: Meta<typeof IGVBrowser> = {
    title: "IGVBrowser/Browser",
    component: IGVBrowser,
    parameters: {
        docs: {
            description: {
                component: `
TBA - link to README
`,
            },
        },
    },
    argTypes: {
        genome: { control: "text" },
        searchUrl: { control: "text" },
        locus: { control: "text" },
        hideNavigation: { control: "boolean" },
        trackConfig: { control: "object" },
        onBrowserLoad: { action: "onBrowserLoad" },
        onTrackRemoved: { action: "onTrackRemoved" },
        onLocusChanged: { action: "onLocusChanged" },
    },
};

export default meta;

export const Default: StoryObj<typeof IGVBrowser> = {
    args: {
        locus: "ABCA7",
        hideNavigation: false,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowser {...args} />,
    tags: ["dev"], // hide for now
};

export const WithSelector: StoryObj<typeof IGVBrowserWithSelector> = {
    args: {
        locus: "ABCA7",
        hideNavigation: false,
        trackConfig: qtlTracks,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowserWithSelector {...args} />,
    tags: ["dev"], // hide for now
};

const ControlWrapper = (props: any) => {
    const [locus, setLocus] = useState("ABCA7");

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLocus(formData.get("locusInput") as string);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <label htmlFor="locus-input" style={{ fontWeight: 600, minWidth: "80px" }}>
                    Locus:
                </label>
                <input
                    id="locus-input"
                    name="locusInput"
                    type="text"
                    defaultValue="ABCA7"
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        flex: 1,
                        maxWidth: "200px",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Go
                </button>
                <span style={{ marginLeft: "auto", color: "#666", fontSize: "14px" }}>
                    Current Locus: <strong>{locus}</strong>
                </span>
            </form>
            <div style={{ flex: 1, overflow: "auto" }}>
                <IGVBrowserWithSelector {...props} locus={locus} />
            </div>
        </div>
    );
};

export const WithExternalControls: StoryObj<typeof IGVBrowser> = {
    args: {
        genome: "GRCh38",
        trackConfig: qtlTracks,
        hideNavigation: true,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <ControlWrapper {...args} />,
    tags: ["dev"],
};
