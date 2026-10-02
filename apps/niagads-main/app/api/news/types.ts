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
    title: string | { rendered: string };
    content?: { rendered: string };
    text?: string;
    resource?: string[];
    type?: string | string[];
}

// Resource/type taxonomy mapping can be added here when its upstream shape is known.
export const parseNewsPost = (post: NewsPost): NewsItem => ({
    year: Number(post.date.slice(0, 4)),
    date: post.date,
    title: typeof post.title === "string" ? post.title : post.title.rendered,
    text: post.text ?? post.content?.rendered ?? "",
    resource: post.resource ?? [],
    type: typeof post.type === "string" ? [post.type] : (post.type ?? []),
});
