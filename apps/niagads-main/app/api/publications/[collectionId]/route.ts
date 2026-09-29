import type { PublicationRow, PublicationsTableData } from "@/components/Publications/PublicationsTable";

const ZOTERO_COLLECTIONS_URL = "https://api.zotero.org/groups/2437940/collections";
const REVALIDATE_SECONDS = 60 * 60 * 24;

interface ZoteroAuthor {
    family?: string;
    given?: string;
    literal?: string;
}

interface ZoteroItem {
    abstract?: string;
    author?: ZoteroAuthor[];
    "container-title"?: string;
    DOI?: string;
    issued?: { "date-parts"?: Array<Array<number | string>> };
    note?: string;
    title?: string;
    type?: string;
    URL?: string;
}

const getYear = (item: ZoteroItem) => {
    const year = item.issued?.["date-parts"]?.[0]?.[0];
    return typeof year === "number" ? year : Number(year) || null;
};

const getNoteField = (note: string | undefined, field: string) =>
    note
        ?.replaceAll("\\n", "\n")
        .match(new RegExp(`(?:^|\\r?\\n)${field}:\\s*([^\\r\\n]+)`, "i"))?.[1]
        ?.trim() || "n/a";

const toTableRow = (item: ZoteroItem): PublicationRow => {
    const doi = item.DOI ? `https://doi.org/${item.DOI}` : undefined;
    const pmid = getNoteField(item.note, "PMID").match(/\d+/)?.[0];
    const pubmed = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : undefined;
    const title = item.title || "Untitled publication";
    const titleUrl = item.URL || doi;
    const links = [
        ...(doi ? [{ value: "DOI", url: doi }] : []),
        ...(pubmed ? [{ value: "PubMed", url: pubmed }] : []),
    ];
    const authors = item.author
        ?.map(({ given, family, literal }) => literal || `${given || ""} ${family || ""}`.trim())
        .filter((name) => name !== "")
        .join("; ") || "n/a";

    return {
        title: titleUrl ? { value: title, url: titleUrl } : title,
        authors,
        year: getYear(item),
        journal: item["container-title"] || "n/a",
        publicationType: item.type
            ? item.type
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
            : "n/a",
        links: links.length ? links : "n/a",
        abstract: item.abstract || "n/a",
        pmid: pmid || "n/a",
        grants: getNoteField(item.note, "Grants"),
    };
};

const loadCollection = async (collectionId: string): Promise<PublicationsTableData> => {
    const apiKey = process.env.ZOTERO_API_KEY;
    if (!apiKey) throw new Error("The Zotero API key is not configured.");

    const items: ZoteroItem[] = [];
    let start = 0;

    while (true) {
        const url = new URL(`${ZOTERO_COLLECTIONS_URL}/${encodeURIComponent(collectionId)}/items`);
        url.searchParams.set("format", "csljson");
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
        const total = Number(response.headers.get("total-results"));
        if (page.length === 0 || (Number.isFinite(total) && items.length >= total)) break;
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
