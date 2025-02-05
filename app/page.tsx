"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import { MemoIGVBrowser as GenomeBrowser } from "@/components/IGVBrowser/IGVBrowser";

const GenomeBrowser = dynamic(
    () =>
        import("@/components/IGVBrowser/IGVBrowser").then(
            (mod) => mod.MemoIGVBrowser
        ),
    {
        ssr: false,
    }
);

interface TrackConfiguration {
    config: any;
    tracks: any;
}

export default function Home() {
    const [trackConfig, setTrackConfig] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`/api/${process.env.TRACK_SELECTOR_QUERY_NODE}`)
            .then((res) => res.json())
            .then((data) => {
                setTrackConfig(data);
                setLoading(false);
            });
    }, []);

    return (
        <GenomeBrowser
            featureSearchURI="/service/track/feature?id="
            genome="hg38"
            tracks={[]}
        />
    );
}
