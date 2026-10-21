"use client";

import { Alert, Card, CardBody, CardHeader } from "@niagads/ui";
import dynamic from "next/dynamic";
import { Component, useState, type ReactNode } from "react";
import { parseEnvelope, sourceCounts, tableData, type ResultSet } from "./contracts";
import styles from "./ask.module.css";

const EvidenceTable = dynamic(() => import("@niagads/table"), { ssr: false });
const SourceBar = dynamic(() => import("@niagads/charts").then((m) => m.BarChart), { ssr: false });

class ComponentBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}

function TableView({ result }: { result: ResultSet }) {
    const config = tableData(result);
    return (
        <div
            className={styles.table}
            role="region"
            tabIndex={0}
            aria-label="Evidence table; scroll horizontally on narrow screens"
        >
            <div className={styles.tableContent}>
                <EvidenceTable
                    id={result.id}
                    columns={config.columns}
                    data={config.data}
                    options={{ enableExport: true, enableColumnFilters: false }}
                />
            </div>
        </div>
    );
}

function SourceSummary({ result }: { result: ResultSet }) {
    const [chartOpen, setChartOpen] = useState(false);
    const counts = sourceCounts(result);
    if (!counts.length) return <p>No association counts are available for this result.</p>;
    return (
        <figure>
            <figcaption>Association counts by track from the returned summary</figcaption>
            <details onToggle={(event) => setChartOpen(event.currentTarget.open)}>
                <summary>Show source chart</summary>
                <div className={styles.chart} aria-label="Association counts by track">
                    {chartOpen && (
                        <SourceBar
                            id={`${result.id}-sources`}
                            keys={["count"]}
                            data={counts}
                            xAxisLabel="Associations"
                        />
                    )}
                </div>
            </details>
            <table className={styles.sourceTable}>
                <caption className={styles.srOnly}>Association summary counts</caption>
                <thead>
                    <tr>
                        <th scope="col">Track</th>
                        <th scope="col">Associations</th>
                    </tr>
                </thead>
                <tbody>
                    {counts.map((row) => (
                        <tr key={row.term}>
                            <th scope="row">{row.term}</th>
                            <td>{row.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}

// Explicit registry: the model selects a name and a result reference, never code.
const registry = { table: TableView, association_source_bar: SourceSummary };

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
            {envelope.presentation.map((panel, i) => {
                const result = envelope.results.find((r) => r.id === panel.result_id)!;
                const View = registry[panel.component];
                return (
                    <Card key={`${panel.result_id}-${panel.component}-${i}`} className={styles.panel}>
                        <CardHeader>
                            <h3>{panel.title}</h3>
                        </CardHeader>
                        <CardBody>
                            <p>
                                {result.rows.length} records · Page {result.page}
                                {result.has_more ? " · More results available; this is not the full result set." : ""}
                            </p>
                            {result.warnings.map((warning, j) => (
                                <p key={j}>{warning}</p>
                            ))}
                            {result.sources.length > 0 && <p>Source identifiers: {result.sources.join(", ")}</p>}
                            <ComponentBoundary
                                fallback={
                                    <p role="alert">
                                        This component could not be loaded. Full records remain available below.
                                    </p>
                                }
                            >
                                <View result={result} />
                            </ComponentBoundary>
                            <details>
                                <summary>Full retrieved records and provenance</summary>
                                <pre className={styles.raw}>{JSON.stringify(result.rows, null, 2)}</pre>
                            </details>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
