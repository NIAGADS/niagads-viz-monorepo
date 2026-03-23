import { IGVBrowser, IGVBrowserTrack, IGVBrowserWithSelector } from "@niagads/igv";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
// Story with parent component and external locus controls
import React, { useState } from "react";
import { histoneModTracks, qtlTracks } from "../../examples/igvbrowser-tracks";

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

export const WithSelectorAndDefaultTracks: StoryObj<typeof IGVBrowserWithSelector> = {
    args: {
        locus: "WDR18",
        hideNavigation: false,
        trackConfig: qtlTracks,
        defaultTracks: ["NGGTXAMZZNCCLT"],
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowserWithSelector {...args} />,
    tags: ["dev"], // hide for now
};

const LocusControlWrapper = (props: any) => {
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
                <IGVBrowser {...props} locus={locus} />
            </div>
        </div>
    );
};

export const WithExternalLocusControl: StoryObj<typeof IGVBrowser> = {
    args: {
        genome: "GRCh38",
        hideNavigation: true,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <LocusControlWrapper {...args} />,
    tags: ["dev"],
};

const DynamicTrackConfigWrapper = (props: any) => {
    const [locus, setLocus] = useState("ABCA7");
    const [trackConfig, setTrackConfig] = useState<any>(qtlTracks);
    const [defaultTracks, setDefaultTracks] = useState<string[]>(qtlTracks.slice(3, 5).map((track) => track.id));
    const [trackConfigSelection, setTrackConfigSelection] = useState<"qtl" | "histone">("qtl");

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLocus(formData.get("locusInput") as string);

        const selectedTrackConfig = formData.get("trackConfigSelect") as string;
        const currentTrackConfig = selectedTrackConfig === "qtl" ? qtlTracks : histoneModTracks;
        setTrackConfig(currentTrackConfig);
        setDefaultTracks(currentTrackConfig.slice(3, 5).map((track) => track.id));
    };

    const handleTrackConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTrackConfigSelection(e.target.value as "qtl" | "histone");
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
                <label htmlFor="track-config-select" style={{ fontWeight: 600, minWidth: "120px" }}>
                    Track Config:
                </label>
                <select
                    id="track-config-select"
                    name="trackConfigSelect"
                    value={trackConfigSelection}
                    onChange={handleTrackConfigChange}
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        maxWidth: "180px",
                    }}
                >
                    <option value="qtl">QTL Tracks</option>
                    <option value="histone">Histone Mod Tracks</option>
                </select>
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
                    Current Locus: <strong>{locus}</strong> / Current Track Config:{" "}
                    <strong>{trackConfig === qtlTracks ? "qtl" : "histone"}</strong>
                </span>
            </form>
            <div style={{ flex: 1, overflow: "auto" }}>
                <IGVBrowserWithSelector
                    {...props}
                    locus={locus}
                    defaultTracks={defaultTracks}
                    trackConfig={trackConfig}
                />
            </div>
        </div>
    );
};

export const WithDynamicTrackConfigs: StoryObj<typeof IGVBrowser> = {
    args: {
        genome: "GRCh38",
        hideNavigation: true,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <DynamicTrackConfigWrapper {...args} />,
    tags: ["dev"],
    parameters: {
        docs: {
            description: {
                story: "This story demonstrates how the IGVBrowser (with Selector) will respond if locus and track configurations will by dynamically altered by parent application.",
            },
        },
    },
};
