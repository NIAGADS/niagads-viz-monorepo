import { Alert } from "@niagads/ui";
import type { PublicationCollectionResult } from "@/components/Publications/PublicationsTabs";
import type { PublicationRow } from "@/components/Publications/PublicationsTable";
import { PublicationsTabs } from "@/components/Publications/PublicationsTabs";

const ZOTERO_COLLECTIONS_URL = "https://api.zotero.org/groups/2437940/collections";
const ZOTERO_PAGE_SIZE = 1000;
const REVALIDATE_SECONDS = 60 * 60 * 24;

export const dynamic = "force-dynamic";

interface ZoteroAuthor {
    family?: string;
    given?: string;
    literal?: string;
}

interface ZoteroItem {
    id?: string;
    type?: string;
    abstract?: string;
    author?: ZoteroAuthor[];
    "container-title"?: string;
    DOI?: string;
    issued?: { "date-parts"?: Array<Array<number | string>> };
    note?: string;
    title?: string;
    URL?: string;
}

const formatAuthor = ({ given, family, literal }: ZoteroAuthor) => literal || `${given || ""} ${family || ""}`.trim();

const formatAuthors = (authors?: ZoteroAuthor[]) => {
    const names = authors?.map(formatAuthor).filter((name) => name !== "");
    return names?.join("; ") || "n/a";
};

const getNoteField = (note: string | undefined, field: string) => {
    const normalizedNote = note?.replaceAll("\\n", "\n");
    const match = normalizedNote?.match(new RegExp(`(?:^|\\r?\\n)${field}:\\s*([^\\r\\n]+)`, "i"));
    return match?.[1]?.trim() || "n/a";
};

const getYear = (item: ZoteroItem) => {
    const year = item.issued?.["date-parts"]?.[0]?.[0];
    return typeof year === "number" ? year : Number(year) || null;
};

const formatType = (type?: string) =>
    type
        ? type
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
        : "n/a";

const toTableRow = (item: ZoteroItem): PublicationRow => {
    const doi = item.DOI ? `https://doi.org/${item.DOI}` : undefined;
    const pmid = getNoteField(item.note, "PMID").match(/\d+/)?.[0];
    const pubmed = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : undefined;
    const links = [...(doi ? [{ value: "DOI", url: doi }] : []), ...(pubmed ? [{ value: "PubMed", url: pubmed }] : [])];
    const title = item.title || "Untitled publication";
    const titleUrl = item.URL || doi;

    return {
        title: titleUrl ? { value: title, url: titleUrl } : title,
        authors: formatAuthors(item.author),
        year: getYear(item),
        journal: item["container-title"] || "n/a",
        publicationType: formatType(item.type),
        links: links.length > 0 ? links : "n/a",
        abstract: item.abstract || "n/a",
        pmid: pmid || "n/a",
        grants: getNoteField(item.note, "Grants"),
    };
};

const getCollectionPublications = async (
    collectionId: string,
    apiKey: string | undefined
): Promise<PublicationCollectionResult> => {
    if (!apiKey) return { id: collectionId, data: [], error: "The Zotero API key is not configured." };

    try {
        const items: ZoteroItem[] = [];
        let start = 0;

        while (true) {
            const url = new URL(`${ZOTERO_COLLECTIONS_URL}/${collectionId}/items`);
            url.searchParams.set("format", "csljson");
            url.searchParams.set("limit", String(ZOTERO_PAGE_SIZE));
            url.searchParams.set("start", String(start));

            const response = await fetch(url, {
                headers: { "Content-Type": "text/plain", "Zotero-API-Key": apiKey },
                next: { revalidate: REVALIDATE_SECONDS },
            });
            if (!response.ok) throw new Error(`Zotero request failed with status ${response.status}.`);

            const payload = await response.json();
            const page = Array.isArray(payload) ? payload : payload?.items;
            if (!Array.isArray(page)) throw new Error("Zotero returned an unexpected response format.");

            items.push(...page);
            if (page.length === 0) break;
            start += page.length;
        }

        return {
            id: collectionId,
            data: items.sort((a, b) => (getYear(b) || 0) - (getYear(a) || 0)).map(toTableRow),
        };
    } catch (error) {
        return {
            id: collectionId,
            data: [],
            error: error instanceof Error ? error.message : "Unable to load publications.",
        };
    }
};

export default async function PublicationsPage() {
    const collectionIds = [
        ...new Set((process.env.ZOTERO_COLLECTION_IDS || "").split(",").map((id) => id.trim())),
    ].filter((id) => id !== "");

    if (collectionIds.length === 0) {
        return (
            <main>
                <h1>Publications</h1>
                <Alert variant="error" message="Publications are currently unavailable.">
                    The Zotero collection IDs are not configured.
                </Alert>
            </main>
        );
    }

    const collections = await Promise.all(
        collectionIds.map((collectionId) => getCollectionPublications(collectionId, process.env.ZOTERO_API_KEY))
    );

    return (
        <main>
            <h1>Publications</h1>

            <PublicationsTabs collections={collections} />
        </main>
    );
}
