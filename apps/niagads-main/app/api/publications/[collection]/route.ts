import { parse, filter, type TNode } from "txml";
import { revalidateTag, unstable_cache } from "next/cache";
import type { PublicationRow, PublicationsTableData } from "@/components/Publications/PublicationsTable";
import { URLS } from "@/data/url_ref";

const REVALIDATE_SECONDS = 60 * 60 * 24;
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

const getNoteField = (note: string | undefined, field: string) =>
    note
        ?.replaceAll("\\n", "\n")
        .match(new RegExp(`(?:^|\\r?\\n)${field}:\\s*([^\\r\\n]+)`, "i"))?.[1]
        ?.trim() || null;

const elements = (node: TNode | null | undefined, tag: string): TNode[] | null => {
    if (!node) return null;
    const matches = filter(node.children, (child) => child.tagName === tag);
    return matches.length ? matches : null;
};

const first = (node: TNode | null | undefined, tag: string) => elements(node, tag)?.[0] ?? null;

// Concatenate inline text without adding spaces inside words or before punctuation.
const text = (node: TNode | string | null | undefined): string | null => {
    if (node == null) return null;
    return typeof node === "string" ? node : node.children.map(text).join("") || null;
};

const content = (node: TNode | null | undefined) => text(node)?.replace(/\s+/g, " ").trim() || null;

const parsePubMedArticle = (xml: TNode, grantsByPmid: Map<string, string | null>): PublicationRow | null => {
    const citation = first(xml, "MedlineCitation");
    const pmid = content(first(citation, "PMID"));
    const article = first(citation, "Article");
    if (!pmid || !article) return null;

    const authors: string[] = [];
    for (const author of elements(article, "Author") ?? []) {
        let name = content(first(author, "CollectiveName"));
        if (!name) {
            const foreName = content(first(author, "ForeName"));
            const lastName = content(first(author, "LastName"));
            name = foreName && lastName ? `${foreName} ${lastName}` : foreName || lastName;
        }
        if (name) authors.push(name);
    }
    const abstract: string[] = [];
    for (const section of elements(article, "AbstractText") ?? []) {
        const value = content(section);
        if (value) {
            const label = section.attributes.Label || section.attributes.NlmCategory;
            abstract.push(label ? `${label}: ${value}` : value);
        }
    }
    const publicationTypes: string[] = [];
    for (const publicationType of elements(article, "PublicationType") ?? []) {
        const value = content(publicationType);
        if (value) publicationTypes.push(value);
    }
    const ids = elements(first(xml, "PubmedData"), "ArticleId");
    const journal = first(article, "Journal");
    const pubDate = first(journal, "PubDate");
    const year = (content(first(pubDate, "Year")) || content(first(pubDate, "MedlineDate")))?.match(/\d{4}/)?.[0];
    const meshTerms: string[] = [];
    for (const heading of elements(citation, "MeshHeading") ?? []) {
        const descriptor = content(first(heading, "DescriptorName"));
        if (descriptor) meshTerms.push(descriptor);
    }

    const doi = content(ids?.find((id) => id.attributes.IdType?.toLowerCase() === "doi"));
    const pmcid = content(ids?.find((id) => id.attributes.IdType?.toLowerCase() === "pmc"));
    const title = content(first(article, "ArticleTitle"));
    const pubmedUrl = `${URLS.PUBMED}/${pmid}/`;
    const links: { value: string; url: string }[] = [];
    if (doi) links.push({ value: "DOI", url: `${URLS.DOI}/${doi}` });
    links.push({ value: "PubMed", url: pubmedUrl });
    if (pmcid) links.push({ value: "PMC", url: `${URLS.PMC}/${pmcid}/` });

    return {
        pmid,
        authors: authors.join("; ") || null,
        title: title === null ? null : { value: title, url: pubmedUrl },
        abstract: abstract.join(" ") || null,
        doi,
        journal: content(first(journal, "Title")),
        publicationType: publicationTypes.join("; ") || null,
        year: year ? Number(year) : null,
        pmcid,
        meshTerms,
        links,
        grants: grantsByPmid.get(pmid) ?? null,
    };
};

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
        const pmid = getNoteField(note, "PMID")?.match(/\d+/)?.[0];
        if (pmid) grantsByPmid.set(pmid, getNoteField(note, "Grants"));
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

        const document = parse(await response.text(), {
            decodeEntities: true,
            keepWhitespace: true,
            skipXmlDeclaration: true,
            selfClosingTags: [],
        });
        for (const article of filter(document, (node) => node.tagName === "PubmedArticle")) {
            const row = parsePubMedArticle(article, grantsByPmid);
            if (row) publications.push(row);
        }
    }
    return publications;
};

const loadCollection = async (collection: string): Promise<PublicationsTableData> => {
    const publicationRequests: Promise<PublicationsTableData>[] = [];
    let start = 0;
    let total = 0;

    do {
        const page = await fetchZoteroPage(collection, start);
        total = page.total;
        // Start this page's PubMed request before retrieving the next Zotero page.
        publicationRequests.push(fetchPubMedPublications(page.grantsByPmid));
        start += ZOTERO_PAGE_SIZE;
    } while (start < total);

    const publications = (await Promise.all(publicationRequests)).flat();
    return publications.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
};

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
    try {
        const { collection } = await params;
        const revision = await checkCollection(collection);
        const tag = `publications:${collection}`;
        // Only the processed rows and their freshness marker enter the Data Cache.
        // Keep a stable collection key; store the revision alongside the rows to
        // compare it with the live check before serving the response.
        const getCachedCollection = unstable_cache(
            async () => ({ revision, publications: await loadCollection(collection) }),
            ["processed-publications", collection],
            { tags: [tag], revalidate: REVALIDATE_SECONDS },
        );
        let cached = await getCachedCollection();
        if (cached.revision !== revision) {
            // Expire immediately so this request waits for the rebuilt response.
            revalidateTag(tag, { expire: 0 });
            cached = await getCachedCollection();
        }
        return Response.json(cached.publications, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load this collection.";
        return Response.json({ error: message }, { status: 502 });
    }
}
