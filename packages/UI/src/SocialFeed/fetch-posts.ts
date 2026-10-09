export type SocialPlatform = "Bluesky" | "X";

export interface SocialPost {
    author: string;
    date: string;
    text: string;
    url: string;
}

interface BlueskyFeed {
    feed: {
        post: {
            uri: string;
            author: { handle: string; displayName?: string };
            record: { text: string; createdAt: string };
        };
    }[];
}

interface XUser {
    data: { id: string; name: string; username: string };
}

interface XPosts {
    data?: { id: string; text: string; created_at: string }[];
}

async function request<T>(url: string, accessToken?: string): Promise<T> {
    const response = await fetch(url, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (!response.ok) throw new Error(`Feed request failed (${response.status}).`);
    return response.json();
}

export async function fetchSocialPosts(
    platform: SocialPlatform,
    handle: string,
    accessToken?: string
): Promise<SocialPost[]> {
    if (platform === "Bluesky") {
        const query = new URLSearchParams({ actor: handle, limit: "2", includePins: "false" });
        const { feed } = await request<BlueskyFeed>(
            `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?${query}`
        );
        return feed.slice(0, 2).map(({ post }) => ({
            author: post.author.displayName || post.author.handle,
            date: post.record.createdAt,
            text: post.record.text,
            url: `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split("/").pop()}`,
        }));
    }

    if (!accessToken) throw new Error("An access token is required for X feeds.");
    const { data: user } = await request<XUser>(
        `https://api.x.com/2/users/by/username/${encodeURIComponent(handle)}`,
        accessToken
    );
    const query = new URLSearchParams({ max_results: "5", "post.fields": "created_at" });
    const { data } = await request<XPosts>(`https://api.x.com/2/users/${user.id}/tweets?${query}`, accessToken);
    return data
        ? data.slice(0, 2).map((post) => ({
              author: user.name,
              date: post.created_at,
              text: post.text,
              url: `https://x.com/${user.username}/status/${post.id}`,
          }))
        : [];
}
