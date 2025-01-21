'use client'
import dynamic from "next/dynamic";
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

export default function Home() {
    return (
        <GenomeBrowser
            featureSearchURI="/service/track/feature?id="
            genome="hg38"
            tracks={[]}
        />
    );
}
