// /view/genome_browser
// import { getJsonValueFromCache } from "@/utils/cache";
import { Alert } from "@/components/UI/Alert";
import { MemoIGVBrowser as GenomeBrowser } from "@/components/IGVBrowser/IGVBrowser";
import { NextRequest } from "next/server";
import { backendFetchFromPath } from "@/utils/routeHandlers";
import { config } from "@/components/IGVBrowser/test/_tracks";
import { getJsonValueFromCache } from "@/utils/cache";
import { jsonSyntaxHighlight } from "@/common/utils";

/*
    useEffect(() => {
        if (initiateGenomeBrowserView) {
            const fetchTrackConfig = async () => {
                const tracks = Object.keys(selectedRows).join(',')
                const response = await fetch(`/genome_browser?track=${tracks}`)
                const result = await response.json()
                setBrowserConfig(result)
            }
            fetchTrackConfig()
        }
    }, [initiateGenomeBrowserView])

    useEffect(() => {
        if (browserConfig)

    }, [browserConfig])
    */

type props = { locus: string; tracks: string };

const BROWSER_CONFIG_ENDPOINT = "config/igvbrowser/?track";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const qp = await searchParams;
    const locus: string = qp.locus as string;

    //FIXME: need to extract the /db path from the route
    const configEndpoint = `${process.env.API_SERVICE_URL}/filer/${BROWSER_CONFIG_ENDPOINT}=${qp.tracks}`;
    const response = await fetch(configEndpoint);
    const config = (await response.json()).response;

    return (
        <main>
            {config ? (
                <GenomeBrowser locus={locus} tracks={config} genome="hg38"></GenomeBrowser>
            ) : (
                <Alert variant="info" message="Loading">
                    {configEndpoint}
                </Alert>
            )}
        </main>
    );
}

//
