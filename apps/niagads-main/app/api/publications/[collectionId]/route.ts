import type { PublicationRow, PublicationsTableData } from "@/components/Publications/PublicationsTable";

const ZOTERO_COLLECTIONS_URL = "https://api.zotero.org/groups/2437940/collections";
const REVALIDATE_SECONDS = 60 * 60 * 24;
const ZOTERO_PAGE_SIZE = 100;

interface ZoteroCreator {
    creatorType?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
}

interface ZoteroItem {
    data: {
        abstractNote?: string;
        creators?: ZoteroCreator[];
        date?: string;
        DOI?: string;
        extra?: string;
        itemType?: string;
        publicationTitle?: string;
        title?: string;
        url?: string;
    };
}

const getYear = (item: ZoteroItem) => {
    const year = item.data.date?.match(/\d{4}/)?.[0];
    return year ? Number(year) : null;
};

const getNoteField = (note: string | undefined, field: string) =>
    note
        ?.replaceAll("\\n", "\n")
        .match(new RegExp(`(?:^|\\r?\\n)${field}:\\s*([^\\r\\n]+)`, "i"))?.[1]
        ?.trim() || "n/a";

const toTableRow = (item: ZoteroItem): PublicationRow => {
    const { data } = item;
    const doi = data.DOI ? `https://doi.org/${data.DOI}` : undefined;
    const pmid = getNoteField(data.extra, "PMID").match(/\d+/)?.[0];
    const pubmed = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : undefined;
    const title = data.title || "Untitled publication";
    const titleUrl = data.url || doi;
    const links = [...(doi ? [{ value: "DOI", url: doi }] : []), ...(pubmed ? [{ value: "PubMed", url: pubmed }] : [])];
    const authors =
        data.creators
            ?.filter(({ creatorType }) => creatorType === "author")
            .map(({ firstName, lastName, name }) => name || `${firstName || ""} ${lastName || ""}`.trim())
            .filter((name) => name !== "")
            .join("; ") || "n/a";

    return {
        title: titleUrl ? { value: title, url: titleUrl } : title,
        authors,
        year: getYear(item),
        journal: data.publicationTitle || "n/a",
        publicationType: data.itemType
            ? data.itemType.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("-", " ")
            : "n/a",
        links: links.length ? links : "n/a",
        abstract: data.abstractNote || "n/a",
        pmid: pmid || "n/a",
        grants: getNoteField(data.extra, "Grants"),
    };
};

const loadCollection = async (collectionId: string): Promise<PublicationsTableData> => {
    const apiKey = process.env.ZOTERO_API_KEY;
    if (!apiKey) throw new Error("The Zotero API key is not configured.");

    const items: ZoteroItem[] = [];
    let start = 0;

    while (true) {
        const url = new URL(`${ZOTERO_COLLECTIONS_URL}/${encodeURIComponent(collectionId)}/items`);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", String(ZOTERO_PAGE_SIZE));
        url.searchParams.set("start", String(start));

        const response = await fetch(url, {
            headers: { "Content-Type": "text/plain", "Zotero-API-Key": apiKey },
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!response.ok) throw new Error(`Zotero request failed with status ${response.status}.`);

        const body = await response.json();
        const page = Array.isArray(body) ? body : body?.items;
        if (!Array.isArray(page)) throw new Error("Zotero returned an unexpected response format.");

        items.push(...page);
        const totalHeader = response.headers.get("total-results");
        const total = totalHeader ? Number(totalHeader) : undefined;
        if (page.length === 0 || (total !== undefined && Number.isFinite(total) && items.length >= total)) break;
        start += page.length;
    }

    return items.sort((a, b) => (getYear(b) || 0) - (getYear(a) || 0)).map(toTableRow);
};

export async function GET(_: Request, { params }: { params: Promise<{ collectionId: string }> }) {
    try {
        const { collectionId } = await params;
        return Response.json(await loadCollection(collectionId));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load this collection.";
        return Response.json({ error: message }, { status: 502 });
    }
}
