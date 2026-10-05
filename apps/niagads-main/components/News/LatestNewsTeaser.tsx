"use client";

import { Alert, LoadingSpinner } from "@niagads/ui";
import { useNews } from "./NewsArchive";
import styles from "../HomePage/home-page.module.css";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

export const LatestNewsTeaser = ({ groups }: { groups: string }) => {
    const { data, error, isLoading } = useNews(groups);
    const latest = data?.length ? data.reduce((newest, item) => (item.date > newest.date ? item : newest)) : undefined;

    return (
        <article className={styles["home-page-news-teaser"]} aria-labelledby="latest-news-heading">
            <div id="latest-news-heading" className={styles["home-page-news-label"]}>
                Latest news
            </div>
            {isLoading ? (
                <div role="status" aria-label="Loading latest news">
                    <LoadingSpinner />
                </div>
            ) : error || !groups.trim() ? (
                <Alert variant="info" message="Latest news is currently unavailable." />
            ) : latest ? (
                <>
                    <h2>{latest.title}</h2>
                    <time dateTime={latest.date.slice(0, 10)}>
                        {dateFormatter.format(new Date(`${latest.date.slice(0, 10)}T12:00:00Z`))}
                    </time>
                    <p>
                        {latest.summary &&
                            (latest.summary.length > 240
                                ? `${latest.summary.slice(0, 240).trimEnd()}… `
                                : `${latest.summary} `)}
                        <a href={latest.url || "#niagads-news"}>Read more</a>
                    </p>
                </>
            ) : (
                <p>No news available.</p>
            )}
        </article>
    );
};
