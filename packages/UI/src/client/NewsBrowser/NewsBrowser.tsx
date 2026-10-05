"use client";

import React, { useId, useMemo, useState } from "react";

import { Badge } from "@/src/Badge";
import { Button } from "@/src/Button";
import { Select } from "@/src/Select";
import { StylingProps } from "../../types";
import { TextInput } from "@/src/TextInput";
import styles from "./news-browser.module.css";

export interface NewsItem {
    date: string;
    title: string;
    summary?: string;
    resources?: readonly string[];
    news_type?: string;
    url?: string;
    body?: string;
}

export interface NewsBrowserProps extends StylingProps {
    news: readonly NewsItem[];
    heading?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const SUMMARY_LENGTH = 240;

const NewsContent = ({ item }: { item: NewsItem }) => {
    const summary = item.summary?.trim() || "";
    const truncated = summary.length > SUMMARY_LENGTH;
    const preview = truncated
        ? `${summary
              .slice(0, SUMMARY_LENGTH - 1)
              .replace(/\s+\S*$/, "")
              .trimEnd()}…`
        : summary;
    const showBody = !item.url && Boolean(item.body);
    const showMore = showBody || truncated;

    return (
        <>
            {summary && <p className={styles.summary}>{preview}</p>}
            {showMore && (
                <details className={styles.details}>
                    <summary>
                        Read more{" "}
                        <span className={styles.arrow} aria-hidden="true">
                            ↓
                        </span>
                    </summary>
                    {showBody ? (
                        <div className={styles.body} dangerouslySetInnerHTML={{ __html: item.body! }} />
                    ) : (
                        <p className={styles.body}>{summary}</p>
                    )}
                </details>
            )}
        </>
    );
};

/** Searchable, newest-first news grouped by publication year. Filters are local to each instance. */
export const NewsBrowser = ({ news, heading, className = "", style, id }: NewsBrowserProps) => {
    const generatedId = useId();
    const prefix = id ?? generatedId;
    const [query, setQuery] = useState("");
    const [resource, setResource] = useState("");
    const [type, setType] = useState("");
    const [year, setYear] = useState("");

    const options = useMemo(() => {
        const resourceOptions = new Set<string>();
        const typeOptions = new Set<string>();
        const yearOptions = new Set<string>();

        for (const item of news) {
            yearOptions.add(item.date.slice(0, 4));
            if (item.news_type !== undefined) typeOptions.add(item.news_type);
            item.resources?.forEach((value) => resourceOptions.add(value));
        }

        return {
            resources: Array.from(resourceOptions).sort(),
            types: Array.from(typeOptions).sort(),
            years: Array.from(yearOptions).sort().reverse(),
        };
    }, [news]);

    const { groups, count } = useMemo(() => {
        const entriesByYear = new Map<string, NewsItem[]>();
        const search = query.trim().toLowerCase();
        let count = 0;

        for (const item of news) {
            const itemYear = item.date.slice(0, 4);
            const text = [item.title, item.summary, item.body, item.news_type, item.resources?.join(" ")]
                .join(" ")
                .toLowerCase();
            const matchesSearch = search === "" || text.includes(search);
            const matchesResource = resource === "" || item.resources?.includes(resource) === true;
            const matchesType = type === "" || item.news_type === type;
            const matchesYear = year === "" || itemYear === year;

            if (matchesSearch && matchesResource && matchesType && matchesYear) {
                let entries = entriesByYear.get(itemYear);
                if (entries === undefined) {
                    entries = [];
                    entriesByYear.set(itemYear, entries);
                }
                entries.push(item);
                count += 1;
            }
        }

        const groups = Array.from(entriesByYear, ([year, entries]) => ({
            year,
            entries: entries.sort((a, b) => b.date.slice(0, 10).localeCompare(a.date.slice(0, 10))),
        })).sort((a, b) => b.year.localeCompare(a.year));

        return { groups, count };
    }, [news, query, resource, type, year]);

    const clearFilters = () => {
        setQuery("");
        setResource("");
        setType("");
        setYear("");
    };

    return (
        <section
            id={id}
            style={style}
            className={`${styles.browser} ${className}`.trim()}
            aria-labelledby={heading ? `${prefix}-heading` : undefined}
            aria-label={heading ? undefined : "News"}
        >
            <div className={styles.header}>
                {heading && <h2 id={`${prefix}-heading`}>{heading}</h2>}
                <Button className={styles.clear} onClick={clearFilters}>
                    Clear filters
                </Button>
            </div>
            <div className={styles.filters}>
                <label htmlFor={`${prefix}-search`}>
                    Search
                    <TextInput
                        id={`${prefix}-search`}
                        type="search"
                        placeholder="Search news…"
                        value={query}
                        onChange={setQuery}
                    />
                </label>
                <Select
                    id={`${prefix}-resource`}
                    label="Resource"
                    fields={options.resources}
                    defaultValue="All resources"
                    value={resource || "All resources"}
                    onChange={(event) => setResource(event.target.value === "All resources" ? "" : event.target.value)}
                />
                <Select
                    id={`${prefix}-type`}
                    label="Type"
                    fields={options.types}
                    defaultValue="All types"
                    value={type || "All types"}
                    onChange={(event) => setType(event.target.value === "All types" ? "" : event.target.value)}
                />
                <Select
                    id={`${prefix}-year`}
                    label="Year"
                    fields={options.years}
                    defaultValue="All years"
                    value={year || "All years"}
                    onChange={(event) => setYear(event.target.value === "All years" ? "" : event.target.value)}
                />
            </div>
            <p className={styles.count} role="status" aria-atomic="true">
                {count} news {count === 1 ? "item" : "items"} · Newest first
            </p>
            {count === 0 && (
                <p className={styles.empty}>{news.length ? "No news matches these filters." : "No news available."}</p>
            )}
            {groups.map(({ year: groupYear, entries }) => (
                <section key={groupYear} className={styles.yearGroup} aria-labelledby={`${prefix}-year-${groupYear}`}>
                    <h3 id={`${prefix}-year-${groupYear}`} className={styles.year}>
                        {groupYear}
                    </h3>
                    <div>
                        {entries.map((item, index) => (
                            <article key={index} className={styles.entry}>
                                <div className={styles.meta}>
                                    <time dateTime={item.date.slice(0, 10)}>
                                        {dateFormatter.format(new Date(`${item.date.slice(0, 10)}T12:00:00Z`))}
                                    </time>
                                    {item.news_type && <Badge className={styles.badge}>{item.news_type}</Badge>}
                                    {item.resources?.map((value) => (
                                        <span key={value} className={styles.resource}>
                                            {value}
                                        </span>
                                    ))}
                                </div>
                                <h4 className={styles.title}>
                                    {item.url ? <a href={item.url}>{item.title}</a> : item.title}
                                </h4>
                                <NewsContent item={item} />
                                {item.url && (
                                    <a className={styles.source} href={item.url}>
                                        View original post ↗
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </section>
    );
};
