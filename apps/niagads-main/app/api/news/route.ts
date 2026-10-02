import { createHash } from "node:crypto";
import { URLS } from "@/data/url_ref";
import { getCachePaths, readCachedResponse, writeCachedResponse, type CachePaths } from "../cache";
import { parseNewsPost, type NewsPost } from "./news-post";

const BATCH_SIZE = 10;
const CACHE_FORMAT_VERSION = 1;

const getNewsGroups = (request: Request): string[] => {
    const groups = new URL(request.url).searchParams
        .get("groups")
        ?.split(",")
        .map((group) => group.trim());
    if (!groups?.length || groups.some((group) => !/^[1-9]\d*$/.test(group))) {
        throw new Error(
            "The groups query parameter must contain a comma-separated list of one or more positive category IDs."
        );
    }
    return [...new Set(groups)];
};

const fetchNewsPage = async (group: string, perPage: number, page = 1): Promise<NewsPost[] | null> => {
    const url = new URL(`${URLS.NEWS_API}/posts`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("categories", group);
    url.searchParams.set("page", String(page));
    url.searchParams.set("orderby", "date");
    url.searchParams.set("order", "desc");
    const response = await fetch(url, { cache: "no-store" });
    if (response.status === 400) {
        const error = await response.json();
        if (error?.code === "rest_post_invalid_page_number") return null;
    }
    if (!response.ok) throw new Error(`News feed request failed with status ${response.status}.`);
    const posts: NewsPost[] = await response.json();
    if (!Array.isArray(posts)) throw new Error("The news feed returned an unexpected response format.");
    return posts;
};

// Only the first provided group controls freshness, including an empty feed.
const checkLatestNewsItem = async (group: string): Promise<string> => {
    const posts = await fetchNewsPage(group, 1);
    return createHash("sha256")
        .update(JSON.stringify(posts?.[0] ?? null))
        .digest("hex");
};

const loadNewsGroup = async (group: string): Promise<NewsPost[]> => {
    const posts: NewsPost[] = [];
    for (let page = 1; ; page++) {
        const batch = await fetchNewsPage(group, BATCH_SIZE, page);
        if (batch === null) break;
        posts.push(...batch);
    }
    return posts;
};

export async function GET(request: Request) {
    let groups: string[];
    try {
        groups = getNewsGroups(request);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid news groups.";
        return Response.json({ error: message }, { status: 400 });
    }

    let paths: CachePaths | undefined;
    const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

    try {
        paths = getCachePaths("news", JSON.stringify({ groups, formatVersion: CACHE_FORMAT_VERSION }));
        const revision = await checkLatestNewsItem(groups[0]);
        const cached = await readCachedResponse(paths, revision);
        if (cached !== null) return new Response(cached, { headers });

        const posts = (await Promise.all(groups.map(loadNewsGroup))).flat();
        const uniquePosts = new Map(posts.map((post) => [post.id, post]));
        const news = [...uniquePosts.values()].map(parseNewsPost);
        news.sort((a, b) => b.date.localeCompare(a.date));

        if ((await checkLatestNewsItem(groups[0])) !== revision) {
            throw new Error("The news feed changed while loading news.");
        }

        const data = JSON.stringify(news);
        await writeCachedResponse(paths, revision, data);
        return new Response(data, { headers });
    } catch (error) {
        console.error("Unable to refresh news:", error);
        const cached = paths ? await readCachedResponse(paths) : null;
        if (cached !== null) return new Response(cached, { headers });
        const message = error instanceof Error ? error.message : "Unable to load news.";
        return Response.json({ error: message }, { status: 502 });
    }
}
