import type { PublicationsTableData } from "@/components/Publications/PublicationsTable";
import { URLS } from "@/data/url_ref";
import { parsePubMedPublications } from "./pubmed";
import { getCachePaths, readCachedResponse, writeCachedResponse, type CachePaths } from "../../cache";

const ZOTERO_PAGE_SIZE = 100;
const PUBMED_BATCH_SIZE = 100;

interface ZoteroItem {
    data?: { extra?: string };
}

interface ZoteroGrantsSummary {
    grantsByPmid: Map<string, string | null>;
    total: number;
}

interface PublicationsRouteContext {
    params: Promise<{ collection: string }>;
}

const zoteroItemsUrl = (collection: string) => {
    const [groupId, collectionId] = collection.split("-");
    return new URL(`${URLS.ZOTERO_API}/groups/${groupId}/collections/${collectionId}/items`);
};

const zoteroHeaders = () => {
    const apiKey = process.env.ZOTERO_API_KEY;
    if (!apiKey) throw new Error("The Zotero API key is not configured.");
    return { "Zotero-API-Key": apiKey, "Zotero-API-Version": "3" };
};

const extractZoteroNote = (note: string | undefined, field: string) =>
    note
        ?.replaceAll("\\n", "\n")
        .match(new RegExp(`(?:^|\\r?\\n)${field}:\\s*([^\\r\\n]+)`, "i"))?.[1]
        ?.trim() || null;

/**
 * Checks Zotero directly using a one-item request instead of downloading the
 * collection. Returns a freshness marker combining Last-Modified-Version and
 * Total-Results; if Zotero omits the version, only count changes are detectable.
 * The route checks this before reading cached data and again after rebuilding
 * to avoid saving results under a revision that changed during retrieval.
 * Throws on upstream failure or an invalid count so GET can use saved data.
 */
const checkZoteroCollectionRevision = async (collection: string): Promise<string> => {
    const url = zoteroItemsUrl(collection);
    url.searchParams.set("limit", "1");
    const response = await fetch(url, { headers: zoteroHeaders(), cache: "no-store" });
    if (!response.ok) throw new Error(`Zotero request failed with status ${response.status}.`);
    const total = response.headers.get("Total-Results");
    const version = response.headers.get("Last-Modified-Version");
    if (total === null || !/^\d+$/.test(total)) {
        throw new Error("Zotero did not return a valid collection count.");
    }
    return `${version ?? ""}:${total}`;
};

const fetchZoteroPage = async (collection: string, start: number): Promise<ZoteroGrantsSummary> => {
    const grantsByPmid = new Map<string, string | null>();
    const url = zoteroItemsUrl(collection);
    url.searchParams.set("format", "json");
    url.searchParams.set("include", "data");
    url.searchParams.set("start", String(start));
    url.searchParams.set("limit", String(ZOTERO_PAGE_SIZE));

    const response = await fetch(url, { headers: zoteroHeaders(), cache: "no-store" });
    if (!response.ok) throw new Error(`Zotero request failed with status ${response.status}.`);

    const page: ZoteroItem[] = await response.json();
    if (!Array.isArray(page)) throw new Error("Zotero returned an unexpected response format.");
    for (const item of page) {
        const note = item.data?.extra;
        const pmid = extractZoteroNote(note, "PMID")?.match(/\d+/)?.[0];
        if (pmid) grantsByPmid.set(pmid, extractZoteroNote(note, "Grants"));
    }

    const total = Number(response.headers.get("total-results"));
    if (!Number.isFinite(total)) throw new Error("Zotero did not return a valid collection count.");
    return { grantsByPmid, total };
};

const fetchPubMedPublications = async (grantsByPmid: Map<string, string | null>): Promise<PublicationsTableData> => {
    const pmids = [...grantsByPmid.keys()];
    const publications: PublicationsTableData = [];
    for (let start = 0; start < pmids.length; start += PUBMED_BATCH_SIZE) {
        const url = new URL(URLS.PUBMED_EUTILS_EFETCH);
        url.searchParams.set("db", "pubmed");
        url.searchParams.set("id", pmids.slice(start, start + PUBMED_BATCH_SIZE).join(","));
        url.searchParams.set("retmode", "xml");
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`PubMed E-utilities request failed with status ${response.status}.`);

        publications.push(...parsePubMedPublications(await response.text(), grantsByPmid));
    }
    return publications;
};

const loadCollection = async (collection: string): Promise<PublicationsTableData> => {
    const publicationRequests: Promise<PublicationsTableData | Error>[] = [];
    let start = 0;
    let total = 0;

    do {
        const page = await fetchZoteroPage(collection, start);
        total = page.total;
        // Start this page's PubMed request before retrieving the next Zotero page.
        // Capture failures immediately so an early rejection is not unhandled
        // while subsequent Zotero pages are still being fetched.
        publicationRequests.push(
            fetchPubMedPublications(page.grantsByPmid).catch((error) =>
                error instanceof Error ? error : new Error(String(error))
            )
        );
        start += ZOTERO_PAGE_SIZE;
    } while (start < total);

    const publications: PublicationsTableData = [];
    for (const result of await Promise.all(publicationRequests)) {
        if (result instanceof Error) throw result;
        publications.push(...result);
    }
    return publications.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
};

export async function GET(_: Request, { params }: PublicationsRouteContext) {
    let paths: CachePaths | undefined;
    const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
    try {
        const { collection } = await params;
        paths = getCachePaths("publications", collection);
        const revision = await checkZoteroCollectionRevision(collection);
        const cached = await readCachedResponse(paths, revision);
        if (cached !== null) return new Response(cached, { headers });

        const publications = await loadCollection(collection);
        if ((await checkZoteroCollectionRevision(collection)) !== revision) {
            throw new Error("The Zotero collection changed while loading publications.");
        }
        const data = JSON.stringify(publications);
        await writeCachedResponse(paths, revision, data);
        return new Response(data, { headers });
    } catch (error) {
        console.error("Unable to refresh publications:", error);
        const cached = paths ? await readCachedResponse(paths) : null;
        if (cached !== null) return new Response(cached, { headers });
        const message = error instanceof Error ? error.message : "Unable to load this collection.";
        return Response.json({ error: message }, { status: 502 });
    }
}
