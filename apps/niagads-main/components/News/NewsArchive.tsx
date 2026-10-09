"use client";

import type { ComponentProps } from "react";
import { Alert, Button, LoadingSpinner } from "@niagads/ui";
import { NewsBrowser } from "@niagads/ui/client";
import useSWR from "swr";

type NewsItems = ComponentProps<typeof NewsBrowser>["news"];

const fetchNews = async (url: string): Promise<NewsItems> => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok || !Array.isArray(body)) throw new Error("Unable to load news.");

    // WordPress returns HTML and entities; the browser's title and summary are plain text.
    const plainText = (html: string) => {
        const document = new DOMParser().parseFromString(html, "text/html");
        document.querySelectorAll("script, style").forEach((element) => element.remove());
        return (document.body.textContent || "").replace(/\s+/g, " ").trim();
    };
    return body.map((item) => ({
        ...item,
        title: plainText(item.title),
        summary: item.summary ? plainText(item.summary) : undefined,
    }));
};

export const useNews = (groups: string) =>
    useSWR<NewsItems>(groups.trim() ? `/api/news?${new URLSearchParams({ groups })}` : null, fetchNews, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });

export const NewsArchive = ({ groups }: { groups: string }) => {
    const { data, error, isLoading, mutate } = useNews(groups);

    if (!groups.trim()) return <Alert variant="info" message="News is currently unavailable." />;
    if (isLoading)
        return (
            <div role="status" aria-label="Loading news">
                <LoadingSpinner />
            </div>
        );
    if (error) {
        return (
            <Alert variant="error" message="News is currently unavailable.">
                <Button onClick={() => void mutate()}>Try again</Button>
            </Alert>
        );
    }
    return <NewsBrowser id="niagads-news" news={data || []} />;
};
