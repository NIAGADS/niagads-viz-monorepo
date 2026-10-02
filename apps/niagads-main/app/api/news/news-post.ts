export interface NewsItem {
    year: number;
    date: string;
    title: string;
    text: string;
    resource: string[];
    type: string[];
}

export interface NewsPost {
    id: number;
    date: string;
    title: { rendered: string };
    content: { rendered: string };
    class_list?: string[];
}

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

// Keep the publication timestamp in the site's timezone and the full rendered
// HTML body. Resources come only from recognized categories; news types are pending.
// WordPress's `type: "post"` is a content kind, not a news classification.
export const parseNewsPost = (post: NewsPost): NewsItem => ({
    year: Number(post.date.slice(0, 4)),
    date: post.date,
    title: post.title.rendered,
    text: post.content.rendered,
    resource: parseResources(post.class_list),
    type: [],
});
