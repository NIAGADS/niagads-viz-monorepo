import { parse, filter, type TNode } from "txml";
import type { PublicationRow, PublicationsTableData } from "@/components/Publications/PublicationsTable";
import { URLS } from "@/data/url_ref";

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
    const meshTerms: { value: string; id: string | null }[] = [];
    for (const heading of elements(citation, "MeshHeading") ?? []) {
        const descriptor = first(heading, "DescriptorName");
        const value = content(descriptor);
        if (value) meshTerms.push({ value, id: descriptor?.attributes.UI || null });
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

export function parsePubMedPublications(xml: string, grantsByPmid: Map<string, string | null>): PublicationsTableData {
    const document = parse(xml, {
        decodeEntities: true,
        keepWhitespace: true,
        skipXmlDeclaration: true,
        selfClosingTags: [],
    });
    const publications: PublicationsTableData = [];
    for (const article of filter(document, (node) => node.tagName === "PubmedArticle")) {
        const row = parsePubMedArticle(article, grantsByPmid);
        if (row) publications.push(row);
    }
    return publications;
}
