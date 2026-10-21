"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { parseEnvelope, type ResultSet, type Presentation } from "./contracts";
import styles from "./ask.module.css";
import { translateBar, translateTable } from "./translators/index.ts";
import ComponentBoundary from "./ComponentBoundary";
import TrackSelectionTable from "./TrackSelectionTable";

const EvidenceTable = dynamic(() => import("@niagads/table"), { ssr: false });
const SourceBar = dynamic(() => import("@niagads/charts").then((m) => m.BarChart), { ssr: false });

function PanelView({
    result,
    panel,
    maxCategories,
    panelIndex,
}: {
    result: ResultSet;
    panel: Presentation;
    maxCategories: number;
    panelIndex: number;
}) {
    const [chartOpen, setChartOpen] = useState(false);
    if (panel.translator !== "category_counts_bar" && panel.translator !== "association_counts_bar") {
        const config = translateTable(result, panel);
        config.id = `${config.id}-${panelIndex}`;
        if (
            result.entity === "track" &&
            (panel.translator === "search_matches_table" || panel.translator === "track_records_table")
        ) {
            return <TrackSelectionTable config={config} />;
        }
        return (
            <div
                className={styles.table}
                role="region"
                tabIndex={0}
                aria-label="Evidence table; scroll horizontally on narrow screens"
            >
                <div className={styles.tableContent}>
                    <EvidenceTable {...config} />
                </div>
            </div>
        );
    }
    const summary = translateBar(result, panel, maxCategories);
    return (
        <figure>
            <figcaption>{summary.scope}</figcaption>
            {summary.notice && <p role="status">{summary.notice}</p>}
            {!summary.data.length && <p>No categorical counts are available for this result.</p>}
            {summary.showChart && (
                <details onToggle={(event) => setChartOpen(event.currentTarget.open)}>
                    <summary>Show bar chart</summary>
                    <div className={styles.chart} aria-label={panel.title}>
                        {chartOpen && (
                            <SourceBar
                                id={`${result.id}-${panel.translator}-${panelIndex}`}
                                keys={["count"]}
                                data={summary.data}
                                xAxisLabel={
                                    panel.translator === "association_counts_bar" ? "Associations" : "Loaded records"
                                }
                            />
                        )}
                    </div>
                </details>
            )}
            <div
                className={styles.table}
                role="region"
                tabIndex={0}
                aria-label="Summary counts; scroll horizontally on narrow screens"
            >
                <div className={styles.tableContent}>
                    <EvidenceTable {...summary.table} id={`${summary.table.id}-${panelIndex}`} />
                </div>
            </div>
        </figure>
    );
}

export default function Results({ value }: { value: unknown }) {
    let envelope;
    try {
        envelope = parseEnvelope(value);
    } catch {
        return <p role="alert">The results could not be displayed. Contact support if the problem continues.</p>;
    }
    return (
        <div>
            {envelope.status !== "ok" && !envelope.issues.length && !envelope.warnings.length && (
                <p className={styles.notice}>
                    {envelope.status === "empty"
                        ? "No matching records were returned."
                        : envelope.status === "clarification"
                          ? "More information is needed to complete this request."
                          : "Part of this request could not be completed."}
                </p>
            )}
            {Array.from(new Map(envelope.issues.map((issue) => [JSON.stringify(issue), issue])).values()).map(
                (issue, i) => (
                    <p key={`issue-${i}`} role="alert" className={styles.error}>
                        {issue.message}
                        {issue.request_id ? ` Reference: ${issue.request_id}.` : ""}
                    </p>
                )
            )}
            {[...new Set(envelope.warnings)]
                .filter((warning) => !envelope.issues.some((issue) => issue.message === warning))
                .map((warning, i) => (
                    <p key={i} className={styles.notice}>
                        {warning}
                    </p>
                ))}
            {envelope.results.map((result) => {
                const panels = envelope.presentation.filter((panel) => panel.result_id === result.id);
                return (
                    <section key={result.id} className={styles.panel}>
                        <p>
                            {result.rows.length} loaded records · API page {result.page}
                            {result.has_more ? " · More results available; this is not the full result set." : ""}
                            {result.annotation === null
                                ? " · Ranked candidates are not an exhaustive set of matches."
                                : ""}
                        </p>
                        {result.warnings.map((warning, j) => (
                            <p key={j}>{warning}</p>
                        ))}
                        {result.sources.length > 0 && <p>Source identifiers: {result.sources.join(", ")}</p>}
                        {!panels.length && (
                            <p>
                                No registered presentation was selected for this result. Retrieved records remain
                                available below.
                            </p>
                        )}
                        {panels.map((panel, i) => (
                            <div key={`${panel.translator}-${i}`}>
                                <h3>{panel.title}</h3>
                                <ComponentBoundary
                                    fallback={
                                        <p role="alert">
                                            This presentation is incompatible with its data or could not be loaded.
                                            Retrieved records remain available below.
                                        </p>
                                    }
                                >
                                    <PanelView
                                        result={result}
                                        panel={panel}
                                        maxCategories={envelope.max_bar_categories}
                                        panelIndex={i}
                                    />
                                </ComponentBoundary>
                            </div>
                        ))}
                        <details>
                            <summary>Full retrieved records and provenance</summary>
                            <pre className={styles.raw}>{JSON.stringify(result, null, 2)}</pre>
                        </details>
                    </section>
                );
            })}
        </div>
    );
}
