import { ReleasesView, useSiteVals } from "@/lib/useSiteVals";
import Link from "next/link";
import { CSSProperties, Fragment } from "react";
import { Card } from "@niagads/ui";
import { Badge } from "@/components/ds";

export const Production = () => {
    const { cardStyle2, cardStyle3, prodBadge, prodCards, prodCols, r6, r7 } = useSiteVals({ page: "releases" });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                    gap: "1.25rem",
                }}
            >
                {(prodCards ?? []).map((c: any, $index: number) => (
                    <Fragment key={$index}>
                        <Link
                            className="hv6"
                            href={c.href}
                            onClick={c.onClick}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.45rem",
                                padding: "1.25rem 1.5rem",
                                background: "var(--surface)",
                                border: "1px dashed var(--warning-amber)",
                                borderRadius: "var(--border-radius-lg)",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <span style={{ fontSize: "1.375rem", fontWeight: "700" }}>{c.title}</span>{" "}
                            <span
                                style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "700",
                                    letterSpacing: "0.06em",
                                    color: "var(--warning-amber)",
                                }}
                            >
                                ◐ IN PRODUCTION
                            </span>{" "}
                            <span style={{ fontSize: "1rem", fontWeight: "700" }}>{c.activity}</span>{" "}
                            <span
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "var(--primary-blue)",
                                }}
                            >
                                Jump to {c.id} ↓
                            </span>
                        </Link>
                    </Fragment>
                ))}
            </div>
            <section
                id="prod-r6"
                style={{
                    scrollMarginTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid var(--border)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0" }}>R6 · WGS</h2>
                    <Badge color="warning">◐ IN PRODUCTION</Badge>
                    {prodBadge ? (
                        <>
                            <Badge color="gold">{prodBadge}</Badge>
                        </>
                    ) : null}
                </div>
                <p
                    style={{
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        margin: "0",
                        maxWidth: "72ch",
                        textWrap: "pretty",
                    }}
                >
                    {r6.summary}
                </p>
                <p style={{ fontSize: "1rem", margin: "0" }}>
                    <span style={{ color: "var(--text-muted)" }}>Current status:</span>{" "}
                    <strong>{r6.activitySummary}</strong>
                </p>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0.75rem 0 0" }}>
                    1 · Individual-level processing
                </h4>
                <p
                    style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        margin: "0",
                        maxWidth: "72ch",
                    }}
                >
                    {r6.indivNote}
                </p>
                <Card {...cardStyle2}>
                    <div
                        style={{
                            padding: "1rem 1.25rem",
                            borderBottom: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <h4 style={{ fontSize: "1rem", fontWeight: "700", margin: "0" }}>
                            Project &amp; Batch Processing
                        </h4>
                        <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{r6.prod.summary}</span>
                    </div>
                    {r6.prod.loading ? (
                        <>
                            <div
                                role="status"
                                style={{
                                    padding: "2rem 1.25rem",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                Loading production status…
                            </div>
                        </>
                    ) : null}
                    {r6.prod.unavailable ? (
                        <>
                            <div
                                role="status"
                                style={{
                                    padding: "2rem 1.25rem",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Production status is temporarily unavailable. Please check back later.
                            </div>
                        </>
                    ) : null}
                    {r6.prod.empty ? (
                        <>
                            <div
                                style={{
                                    padding: "2rem 1.25rem",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                No projects are currently listed for {r6.id}.
                            </div>
                        </>
                    ) : null}
                    {r6.prod.hasRows ? (
                        <>
                            <div style={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        minWidth: "680px",
                                        borderCollapse: "collapse",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {(prodCols ?? []).map((c: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <th
                                                        scope="col"
                                                        style={
                                                            {
                                                                textAlign: `${c.align ?? ""}`,
                                                                fontSize: "0.75rem",
                                                                letterSpacing: "0.05em",
                                                                textTransform: "uppercase",
                                                                color: "var(--text-muted)",
                                                                fontWeight: "700",
                                                                padding: "0.75rem 1rem",
                                                                borderBottom: "1px solid var(--border)",
                                                                whiteSpace: "nowrap",
                                                                background: "var(--gray-50)",
                                                            } as CSSProperties
                                                        }
                                                    >
                                                        {c.label}
                                                    </th>
                                                </Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    {(r6.prod.projects ?? []).map((p: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <tbody style={{ borderBottom: "1px solid var(--border)" }}>
                                                <tr>
                                                    <th
                                                        scope="rowgroup"
                                                        style={{
                                                            textAlign: "left",
                                                            padding: "0.75rem 1rem 0.35rem",
                                                            fontWeight: "700",
                                                            verticalAlign: "top",
                                                        }}
                                                    >
                                                        {p.name}{" "}
                                                        <span
                                                            style={{
                                                                fontFamily: "var(--font-mono)",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "400",
                                                                color: "var(--text-muted)",
                                                            }}
                                                        >
                                                            {p.id}
                                                        </span>
                                                    </th>
                                                    <td
                                                        style={{
                                                            padding: "0.75rem 1rem 0.35rem",
                                                            color: "var(--text-muted)",
                                                            fontSize: "0.8125rem",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {p.batchLabel}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "0.75rem 1rem 0.35rem",
                                                            textAlign: "right",
                                                            fontWeight: "700",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {p.total}
                                                    </td>
                                                    <td colSpan={3} />
                                                </tr>
                                                {(p.batches ?? []).map((b: any, $index: number) => (
                                                    <Fragment key={$index}>
                                                        <tr
                                                            style={{
                                                                borderTop: "1px solid var(--gray-100)",
                                                            }}
                                                        >
                                                            <td />
                                                            <td
                                                                style={{
                                                                    padding: "0.55rem 1rem",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {b.batch}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: "0.55rem 1rem",
                                                                    textAlign: "right",
                                                                    fontVariantNumeric: "tabular-nums",
                                                                }}
                                                            >
                                                                {b.samples}
                                                            </td>
                                                            <td
                                                                style={
                                                                    {
                                                                        padding: "0.55rem 1rem",
                                                                        whiteSpace: "nowrap",
                                                                        color: `${b.c1 ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {b.fileReceived}
                                                            </td>
                                                            <td
                                                                style={
                                                                    {
                                                                        padding: "0.55rem 1rem",
                                                                        whiteSpace: "nowrap",
                                                                        color: `${b.c2 ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {b.adspIds}
                                                            </td>
                                                            <td
                                                                style={
                                                                    {
                                                                        padding: "0.55rem 1rem",
                                                                        whiteSpace: "nowrap",
                                                                        color: `${b.c3 ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {b.pipeline}
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                ))}
                                            </tbody>
                                        </Fragment>
                                    ))}
                                </table>
                            </div>
                        </>
                    ) : null}
                    <div
                        style={{
                            padding: "0.8rem 1.25rem",
                            background: "var(--gray-50)",
                            borderTop: "1px solid var(--border)",
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                        }}
                    >
                        File Received → ADSP IDs Generated → Pipeline Completed · dates show milestone completion · —
                        not yet completed
                    </div>
                </Card>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0.75rem 0 0" }}>
                    2 · Project-level processing
                </h4>
                <Card {...cardStyle3}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0 0 0.25rem" }}>Where R6 is now</h3>
                    <ul style={{ listStyle: "none", margin: "0.5rem 0 0", padding: "0" }}>
                        <li
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.5rem minmax(0, 1fr)",
                                gap: "0.75rem",
                                padding: "1rem 0",
                                borderTop: "1px solid var(--gray-100)",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    fontSize: "1.125rem",
                                    lineHeight: "1.4",
                                    color: "var(--success-green)",
                                }}
                            >
                                ●
                            </span>{" "}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                <span style={{ fontSize: "1rem", fontWeight: "700" }}>Sample set closed</span>
                                <span
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.55",
                                        color: "var(--text-secondary)",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Individual gVCFs have been generated for every R6 project and batch. No new samples
                                    will be added to R6.
                                </span>
                            </div>
                        </li>
                        <li
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.5rem minmax(0, 1fr)",
                                gap: "0.75rem",
                                padding: "1rem 0",
                                borderTop: "1px solid var(--gray-100)",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    fontSize: "1.125rem",
                                    lineHeight: "1.4",
                                    color: "var(--warning-amber)",
                                }}
                            >
                                ◐
                            </span>{" "}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                                    Joint calling and release preparation underway
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.55",
                                        color: "var(--text-secondary)",
                                        textWrap: "pretty",
                                    }}
                                >
                                    The gVCFs are being joint-called into a single release-wide callset. Final sample
                                    identity and quality checks determine which samples are excluded from the release.
                                </span>
                            </div>
                        </li>
                        <li
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.5rem minmax(0, 1fr)",
                                gap: "0.75rem",
                                padding: "1rem 0",
                                borderTop: "1px solid var(--gray-100)",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    fontSize: "1.125rem",
                                    lineHeight: "1.4",
                                    color: "var(--text-muted)",
                                }}
                            >
                                ○
                            </span>{" "}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                                    Next: release through NG00067
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.55",
                                        color: "var(--text-secondary)",
                                        textWrap: "pretty",
                                    }}
                                >
                                    QC'd pVCFs, GDS, and companion files will be released once joint calling and final
                                    checks are complete.
                                </span>
                            </div>
                        </li>
                    </ul>
                    <p
                        style={{
                            fontSize: "0.875rem",
                            margin: "0.75rem 0 0",
                            paddingTop: "0.75rem",
                            borderTop: "1px solid var(--gray-100)",
                        }}
                    >
                        <Link href="/methods" style={{ fontWeight: "700" }}>
                            How ADSP data are processed → Pipelines &amp; Methods
                        </Link>
                    </p>
                </Card>
            </section>
            <section
                id="prod-r7"
                style={{
                    scrollMarginTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid var(--border)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0" }}>R7 · WGS</h2>
                    <Badge color="warning">◐ IN PRODUCTION</Badge>
                    {prodBadge ? (
                        <>
                            <Badge color="gold">{prodBadge}</Badge>
                        </>
                    ) : null}
                </div>
                <p
                    style={{
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        margin: "0",
                        maxWidth: "72ch",
                        textWrap: "pretty",
                    }}
                >
                    {r7.summary}
                </p>
                <p style={{ fontSize: "1rem", margin: "0" }}>
                    <span style={{ color: "var(--text-muted)" }}>Current status:</span>{" "}
                    <strong>{r7.activitySummary}</strong>
                </p>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0.75rem 0 0" }}>
                    1 · Individual-level processing
                </h4>
                <p
                    style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        margin: "0",
                        maxWidth: "72ch",
                    }}
                >
                    {r7.indivNote}
                </p>
                <Card {...cardStyle2}>
                    <div
                        style={{
                            padding: "1rem 1.25rem",
                            borderBottom: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <h4 style={{ fontSize: "1rem", fontWeight: "700", margin: "0" }}>
                            Project &amp; Batch Processing
                        </h4>
                        <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{r7.prod.summary}</span>
                    </div>
                    {r7.prod.loading ? (
                        <>
                            <div
                                role="status"
                                style={{
                                    padding: "2rem 1.25rem",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                Loading production status…
                            </div>
                        </>
                    ) : null}
                    {r7.prod.unavailable ? (
                        <>
                            <div
                                role="status"
                                style={{
                                    padding: "2rem 1.25rem",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Production status is temporarily unavailable. Please check back later.
                            </div>
                        </>
                    ) : null}
                    {r7.prod.empty ? (
                        <>
                            <div
                                style={{
                                    padding: "2rem 1.25rem",
                                    fontSize: "0.9375rem",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                No projects are currently listed for {r7.id}.
                            </div>
                        </>
                    ) : null}
                    {r7.prod.hasRows ? (
                        <>
                            <div style={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        minWidth: "680px",
                                        borderCollapse: "collapse",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {(prodCols ?? []).map((c: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <th
                                                        scope="col"
                                                        style={
                                                            {
                                                                textAlign: `${c.align ?? ""}`,
                                                                fontSize: "0.75rem",
                                                                letterSpacing: "0.05em",
                                                                textTransform: "uppercase",
                                                                color: "var(--text-muted)",
                                                                fontWeight: "700",
                                                                padding: "0.75rem 1rem",
                                                                borderBottom: "1px solid var(--border)",
                                                                whiteSpace: "nowrap",
                                                                background: "var(--gray-50)",
                                                            } as CSSProperties
                                                        }
                                                    >
                                                        {c.label}
                                                    </th>
                                                </Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    {(r7.prod.projects ?? []).map((p: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <tbody style={{ borderBottom: "1px solid var(--border)" }}>
                                                <tr>
                                                    <th
                                                        scope="rowgroup"
                                                        style={{
                                                            textAlign: "left",
                                                            padding: "0.75rem 1rem 0.35rem",
                                                            fontWeight: "700",
                                                            verticalAlign: "top",
                                                        }}
                                                    >
                                                        {p.name}{" "}
                                                        <span
                                                            style={{
                                                                fontFamily: "var(--font-mono)",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "400",
                                                                color: "var(--text-muted)",
                                                            }}
                                                        >
                                                            {p.id}
                                                        </span>
                                                    </th>
                                                    <td
                                                        style={{
                                                            padding: "0.75rem 1rem 0.35rem",
                                                            color: "var(--text-muted)",
                                                            fontSize: "0.8125rem",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {p.batchLabel}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "0.75rem 1rem 0.35rem",
                                                            textAlign: "right",
                                                            fontWeight: "700",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {p.total}
                                                    </td>
                                                    <td colSpan={3} />
                                                </tr>
                                                {(p.batches ?? []).map((b: any, $index: number) => (
                                                    <Fragment key={$index}>
                                                        <tr
                                                            style={{
                                                                borderTop: "1px solid var(--gray-100)",
                                                            }}
                                                        >
                                                            <td />
                                                            <td
                                                                style={{
                                                                    padding: "0.55rem 1rem",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {b.batch}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: "0.55rem 1rem",
                                                                    textAlign: "right",
                                                                    fontVariantNumeric: "tabular-nums",
                                                                }}
                                                            >
                                                                {b.samples}
                                                            </td>
                                                            <td
                                                                style={
                                                                    {
                                                                        padding: "0.55rem 1rem",
                                                                        whiteSpace: "nowrap",
                                                                        color: `${b.c1 ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {b.fileReceived}
                                                            </td>
                                                            <td
                                                                style={
                                                                    {
                                                                        padding: "0.55rem 1rem",
                                                                        whiteSpace: "nowrap",
                                                                        color: `${b.c2 ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {b.adspIds}
                                                            </td>
                                                            <td
                                                                style={
                                                                    {
                                                                        padding: "0.55rem 1rem",
                                                                        whiteSpace: "nowrap",
                                                                        color: `${b.c3 ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {b.pipeline}
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                ))}
                                            </tbody>
                                        </Fragment>
                                    ))}
                                </table>
                            </div>
                        </>
                    ) : null}
                    <div
                        style={{
                            padding: "0.8rem 1.25rem",
                            background: "var(--gray-50)",
                            borderTop: "1px solid var(--border)",
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                        }}
                    >
                        File Received → ADSP IDs Generated → Pipeline Completed · dates show milestone completion · —
                        not yet completed
                    </div>
                </Card>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0.75rem 0 0" }}>
                    2 · Project-level processing
                </h4>
                {true ? (
                    <>
                        <p
                            style={{
                                fontSize: "0.9375rem",
                                color: "var(--text-secondary)",
                                margin: "0",
                                maxWidth: "72ch",
                            }}
                        >
                            Not started. Joint calling and release-wide processing begin once individual-level
                            processing is complete.
                        </p>
                    </>
                ) : null}
            </section>
        </div>
    );
};
