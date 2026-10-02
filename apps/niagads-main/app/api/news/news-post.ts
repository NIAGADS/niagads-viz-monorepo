export interface NewsItem {
    year: number;
    date: string;
    title: string;
    content: string;
    excerpt: string;
    resource: string[];
    type: string[];
}

export interface NewsPost {
    id: number;
    date: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    class_list?: string[];
}

// FIXME: temporary to handle legacy wordpress hosted news
const resourcesByCategory = new Map([
    ["category-niagads", "NIAGADS"],
    ["category-adsp", "ADSP"],
    ["category-gcad", "GCAD"],
    ["category-dss", "DSS"],
]);

const parseResources = (classes: string[] = []): string[] => [
    ...new Set(
        classes.flatMap((className) => {
            const resource = resourcesByCategory.get(className.toLowerCase());
            return resource ? [resource] : [];
        })
    ),
];

// Temporary classification heuristics, in priority order within each text field.
const typeRules = [
    {
        type: "Patch / correction",
        pattern: /\b(patch(?:es|ed)?|hotfix|bug\s*fix(?:es)?|correction(?:s)?|errat(?:a|um)|corrected)\b/i,
    },
    {
        type: "Service notice",
        pattern: /\b(maintenance|outage|downtime|service disruption|service restored|temporarily unavailable)\b/i,
    },
    {
        type: "Event / training",
        pattern: /\b(webinar|workshop|training|conference|symposium|registration|register for)\b/i,
    },
    {
        type: "Data release",
        pattern:
            /\b(data(?:set)? release|release of .{0,60}(?:data|genomes|variants|summary statistics)|new datasets?|(?:data|datasets?|summary statistics) (?:are |is |now )*(?:available|released))\b/i,
    },
    {
        type: "Resource update",
        pattern:
            /\b(new features?|feature updates?|resource updates?|updated tools?|new tools?|new functionality|interface updates?|platform updates?|API updates?)\b/i,
    },
];

const plainText = (html: string): string =>
    html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&(?:nbsp|amp|quot|apos|#\d+|#x[\da-f]+);/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

const extractNewsType = (post: NewsPost): string => {
    // A matching title takes precedence over any match in the body.
    for (const html of [post.title.rendered, post.content.rendered]) {
        const text = plainText(html);
        const match = typeRules.find(({ pattern }) => pattern.test(text));
        if (match) return match.type;
    }
    return "Announcement";
};

export const parseNewsPost = (post: NewsPost): NewsItem => ({
    year: Number(post.date.slice(0, 4)),
    date: post.date,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.content.rendered,
    resource: parseResources(post.class_list),
    type: [extractNewsType(post)],
});
