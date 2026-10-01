import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";

import type { PublicationsTableData } from "@/components/Publications/PublicationsTable";
import { URLS } from "@/data/url_ref";
import { parsePubMedPublications } from "./pubmed";
import path from "node:path";

const ZOTERO_PAGE_SIZE = 100;
const PUBMED_BATCH_SIZE = 100;

interface ZoteroItem {
    data?: { extra?: string };
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

// Check upstream on every request, without downloading the full collection.
const checkCollection = async (collection: string): Promise<string> => {
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

const extractZoteroNote = (note: string | undefined, field: string) =>
    note
        ?.replaceAll("\\n", "\n")
        .match(new RegExp(`(?:^|\\r?\\n)${field}:\\s*([^\\r\\n]+)`, "i"))?.[1]
        ?.trim() || null;

interface ZoteroPage {
    grantsByPmid: Map<string, string | null>;
    total: number;
}

const fetchZoteroPage = async (collection: string, start: number): Promise<ZoteroPage> => {
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

interface CachePaths {
    directory: string;
    data: string;
    revision: string;
}

const getCachePaths = (collection: string): CachePaths => {
    const directory = path.resolve(process.env.CACHE_DIR || "/tmp/next-cache");
    const key = createHash("sha256").update(collection).digest("hex");
    return {
        directory,
        data: path.join(directory, `publications-${key}.json`),
        revision: path.join(directory, `publications-${key}.current-revision`),
    };
};

const isMissingFile = (error: unknown) => error instanceof Error && "code" in error && error.code === "ENOENT";

const readCacheFile = async (filename: string): Promise<string | null> => {
    try {
        return await readFile(filename, "utf8");
    } catch (error) {
        // A missing file is an ordinary cache miss; other failures need visibility.
        if (!isMissingFile(error)) console.warn(`Unable to read publications cache file ${filename}:`, error);
        return null;
    }
};

const dataHash = (data: string) => createHash("sha256").update(data).digest("hex");

const readCachedPublications = async (paths: CachePaths, revision?: string): Promise<string | null> => {
    // On upstream failure, the atomically saved data is usable regardless of revision.
    if (revision === undefined) return readCacheFile(paths.data);
    const marker = await readCacheFile(paths.revision);
    if (marker === null) return null;

    let cached: { revision: string; dataHash: string };
    try {
        cached = JSON.parse(marker);
        if (!cached || typeof cached.revision !== "string" || typeof cached.dataHash !== "string") {
            throw new Error("Invalid publications revision marker.");
        }
    } catch (error) {
        console.warn("Unable to parse the publications revision marker:", error);
        return null;
    }
    if (cached.revision !== revision) return null;
    const data = await readCacheFile(paths.data);
    if (data !== null && dataHash(data) !== cached.dataHash) {
        console.warn("Publications cache data and revision marker do not match; rebuilding.");
        return null;
    }
    return data;
};

const removeTemporaryFile = async (filename: string): Promise<void> => {
    try {
        await unlink(filename);
    } catch (error) {
        if (!isMissingFile(error)) console.warn(`Unable to remove temporary cache file ${filename}:`, error);
    }
};

const writeCachedPublications = async (paths: CachePaths, revision: string, data: string): Promise<void> => {
    const suffix = `${randomUUID()}.tmp`;
    const temporaryData = `${paths.data}.${suffix}`;
    const temporaryRevision = `${paths.revision}.${suffix}`;
    try {
        await mkdir(paths.directory, { recursive: true });
        await writeFile(temporaryData, data);
        await writeFile(temporaryRevision, JSON.stringify({ revision, dataHash: dataHash(data) }));
        await rename(temporaryData, paths.data);
        // The checksum lets readers reject mismatched pairs after an interrupted
        // or concurrent write, since two separate renames cannot be atomic together.
        await rename(temporaryRevision, paths.revision);
    } catch (error) {
        console.warn("Unable to save the publications cache; serving fetched data:", error);
    } finally {
        await removeTemporaryFile(temporaryData);
        await removeTemporaryFile(temporaryRevision);
    }
};

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
    let paths: CachePaths | undefined;
    const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
    try {
        const { collection } = await params;
        paths = getCachePaths(collection);
        const revision = await checkCollection(collection);
        const cached = await readCachedPublications(paths, revision);
        if (cached !== null) return new Response(cached, { headers });

        const publications = await loadCollection(collection);
        if ((await checkCollection(collection)) !== revision) {
            throw new Error("The Zotero collection changed while loading publications.");
        }
        const data = JSON.stringify(publications);
        await writeCachedPublications(paths, revision, data);
        return new Response(data, { headers });
    } catch (error) {
        console.error("Unable to refresh publications:", error);
        const cached = paths ? await readCachedPublications(paths) : null;
        if (cached !== null) return new Response(cached, { headers });
        const message = error instanceof Error ? error.message : "Unable to load this collection.";
        return Response.json({ error: message }, { status: 502 });
    }
}
