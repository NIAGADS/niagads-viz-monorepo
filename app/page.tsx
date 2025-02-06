"use client";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Collection, fetchTrackConfiguration, fetchTrackSelector } from "@/components/IGVBrowser/IGVBrowserWithSelector";

const GenomeBrowser = dynamic(
    () =>
        import("@/components/IGVBrowser/IGVBrowserWithSelector").then(
            (mod) => mod.MemoIGVBrowserWithSelector
        ),
    {
        ssr: false,
    }
);

// FIXME: move to "genomics:igv-variant-tracks"
const _reference = [
    {
        name: "ADSP R4 Variants",
        url: "/service/track/variant",
        type: "variant_service",
        format: "webservice",
        visibilityWindow: 1000000,
        supportsWholeGenome: false,
        queryable: true,
        description:
            "Variants from the Alzheimer''s Disease Sequencing Project (ADSP) 36K R4 whole genome sequencing effort - INDELs and SNVs that passed the ADSP biallelic quality control (QC) criteria. Variants are annotated by the ADSP Annotation Pipeline.",
        id: "ADSP_R4",
        order: 1,
        infoURL: "/record",
        removable: false,
    }
]


export default function Home() {
    const [loading, setLoading] = useState<boolean>(true);
    
    const collections = useMemo<Collection[]>(() => {
        let c: Collection[] = [];
        try {
            c = process.env
                .NEXT_PUBLIC_TRACK_COLLECTIONS!.split(",")
                .map((pair) => {
                    const [route, name] = pair.split(":");
                    return { route: route, name: name } as Collection;
                });
        } catch (err) {
            console.error(
                "Error parsing track collections; NEXT_PUBLIC_TRACK_COLLECTIONS (set in application .env file) and a comma separated list of API route:collection_name pairs."
            );
        } finally {
            return c;
        }
    }, []);

    fetchTrackConfiguration(collections);
    fetchTrackSelector(collections);


    return (
        collections && (
            <GenomeBrowser
                featureSearchURI="/service/track/feature?id="
                genome="hg38"
                collection={collections}
                tracks={_reference}
            />
        )
    );
}
