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

const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
});
const SUMMARY_LENGTH = 240;

const NewsContent = ({ item }: { item: NewsItem }) => {
    const [expanded, setExpanded] = useState(false);
    const summary = item.summary?.trim() || "";
    const truncated = summary.length > SUMMARY_LENGTH;
    const preview = truncated
        ? `${summary
              .slice(0, SUMMARY_LENGTH - 1)
              .replace(/\s+\S*$/, "")
              .trimEnd()}…`
        : summary;
    const hasBody = !item.url && Boolean(item.body);
    const canExpand = Boolean(summary) && (truncated || hasBody);
    const showingBody = expanded && hasBody;

    return (
        <>
            {showingBody ? (
                // Body HTML must come from a trusted or sanitized source.
                <div className={styles.body} dangerouslySetInnerHTML={{ __html: item.body! }} />
            ) : summary ? (
                <p className={styles.summary}>
                    {expanded ? summary : preview}
                    {canExpand && (
                        <>
                            {" "}
                            <button
                                type="button"
                                className={styles["read-toggle"]}
                                onClick={() => setExpanded((value) => !value)}
                                aria-expanded={expanded}
                            >
                                {expanded ? "Read less ↑" : "Read more ↓"}
                            </button>
                        </>
                    )}
                </p>
            ) : hasBody ? (
                <div className={styles.body} dangerouslySetInnerHTML={{ __html: item.body! }} />
            ) : null}

            {showingBody && (
                <button
                    type="button"
                    className={styles["read-toggle"]}
                    onClick={() => setExpanded(false)}
                    aria-expanded={true}
                >
                    Read less ↑
                </button>
            )}

            {item.url && (
                <a className={styles.source} href={item.url} target="_blank" rel="noopener noreferrer">
                    View original post ↗
                </a>
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
            {heading && (
                <div className={styles.header}>
                    <h2 id={`${prefix}-heading`}>{heading}</h2>
                </div>
            )}
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
            <div className={styles["filter-footer"]}>
                <p className={styles.count} role="status" aria-atomic="true">
                    {count} news {count === 1 ? "item" : "items"} · Newest first
                </p>

                <Button
                    className={styles.clear}
                    onClick={clearFilters}
                    disabled={!query && !resource && !type && !year}
                >
                    Clear filters
                </Button>
            </div>
            {count === 0 && (
                <p className={styles.empty}>{news.length ? "No news matches these filters." : "No news available."}</p>
            )}

            {groups.map(({ year: groupYear, entries }) => (
                <section
                    key={groupYear}
                    className={styles["year-group"]}
                    aria-labelledby={`${prefix}-year-${groupYear}`}
                >
                    <h3 id={`${prefix}-year-${groupYear}`} className={styles.year}>
                        {groupYear}
                    </h3>

                    <div className={styles["year-entries"]}>
                        {entries.map((item, index) => {
                            const date = new Date(`${item.date.slice(0, 10)}T12:00:00Z`);

                            return (
                                <article key={index} className={styles.entry}>
                                    <time className={styles["entry-date"]} dateTime={item.date.slice(0, 10)}>
                                        <span className={styles["date-month"]}>{monthFormatter.format(date)}</span>
                                        <span className={styles["date-day"]}>{date.getUTCDate()}</span>
                                    </time>

                                    <div className={styles["entry-content"]}>
                                        <div className={styles.meta}>
                                            {item.news_type && <Badge className={styles.badge}>{item.news_type}</Badge>}

                                            {item.resources?.map((value) => (
                                                <span key={value} className={styles.resource}>
                                                    {value}
                                                </span>
                                            ))}
                                        </div>

                                        <h4 className={styles.title}>
                                            {item.url ? (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                    {item.title}
                                                </a>
                                            ) : (
                                                item.title
                                            )}
                                        </h4>

                                        <NewsContent item={item} />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            ))}
        </section>
    );
};
