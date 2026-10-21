"use client";

import { Alert, Card, CardBody, CardHeader } from "@niagads/ui";
import dynamic from "next/dynamic";
import { useState } from "react";
import { parseEnvelope, presentationSchema, type ResultSet, type PresentationIntent } from "./contracts";
import styles from "./ask.module.css";
import { resolvePresentation } from "./translators/presentation.ts";
import { MAX_BAR_CATEGORIES } from "./translators/config.ts";
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
    panel: PresentationIntent;
    maxCategories: number;
    panelIndex: number;
}) {
    const [chartOpen, setChartOpen] = useState(false);
    const resolved = resolvePresentation(result, panel, maxCategories);
    if (resolved.kind === "unsupported") return <Alert variant="info" message={resolved.message} />;
    if (resolved.kind === "table") {
        const config = resolved.config;
        config.id = `${config.id}-${panelIndex}`;
        if (result.entity === "track" && (result.annotation === null || result.annotation === "report")) {
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
    const summary = resolved.config;
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
                                id={`${result.id}-bar-${panelIndex}`}
                                keys={["count"]}
                                data={summary.data}
                                xAxisLabel={
                                    result.annotation === "associations" && result.content === "summary"
                                        ? "Associations"
                                        : "Loaded records"
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
        return (
            <Alert
                variant="error"
                message="The results could not be displayed. Contact support if the problem continues."
            />
        );
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
                    <Alert
                        key={`issue-${i}`}
                        variant="error"
                        message={`${issue.message}${issue.request_id ? ` Reference: ${issue.request_id}.` : ""}`}
                    />
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
                const preferences = envelope.presentation.filter((intent) => intent.result_id === result.id);
                const panels = preferences.length
                    ? preferences
                    : [presentationSchema.parse({ result_id: result.id, title: "Retrieved records" })];
                return (
                    <Card key={result.id} className={styles.panel}>
                        <CardHeader>
                            <h3>{panels.length === 1 ? panels[0].title : "Retrieved records"}</h3>
                        </CardHeader>
                        <CardBody>
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
                            {panels.map((panel, i) => (
                                <div key={`${panel.view}-${i}`}>
                                    {panels.length > 1 && <h4>{panel.title}</h4>}
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
                                            maxCategories={MAX_BAR_CATEGORIES}
                                            panelIndex={i}
                                        />
                                    </ComponentBoundary>
                                </div>
                            ))}
                            <details>
                                <summary>Full retrieved records and provenance</summary>
                                <pre className={styles.raw}>{JSON.stringify(result, null, 2)}</pre>
                            </details>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
