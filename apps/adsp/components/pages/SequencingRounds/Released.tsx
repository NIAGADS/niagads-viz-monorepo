"use client";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { FilterChip, TextInput } from "@/components/ds";
import { Button, Card } from "@niagads/ui";
import { useSiteVals } from "@/lib/useSiteVals";
import { ADSP_DATA as D } from "@/lib/data";
import Link from "next/link";
import { ext } from "@/lib/util";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const Released = () => {
    const {
        arNav,
        cardStyle2,
        cardStyle3,
        cohortsDssHref,
        compBars,
        compLegend,
        coreCols,
        coreRows,
        cross,
        dim2Tabs,
        dimTabs,
        isWide,
        relPubs,
        roundOverview,
        samplesAll,
    } = useSiteVals({ page: "releases" });

    const links = D.links;
    const gen3 = ext(D.links.gen3);

    return (
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>
            {isWide ? (
                <>
                    <nav aria-label="On this page" style={{ flex: "0 0 210px", position: "sticky", top: "1.5rem" }}>
                        <ul
                            style={{
                                listStyle: "none",
                                margin: "0",
                                padding: "0",
                                display: "flex",
                                flexDirection: "column",
                                borderLeft: "1px solid var(--border)",
                            }}
                        >
                            {(arNav ?? []).map((n: any, $index: number) => (
                                <Fragment key={$index}>
                                    <li>
                                        <Link
                                            className="hv5"
                                            href="/sequencing-rounds"
                                            onClick={n.onClick}
                                            style={
                                                {
                                                    display: "block",
                                                    marginLeft: "-1px",
                                                    padding: "0.6rem 1rem",
                                                    borderLeft: `3px solid ${n.bl ?? ""}`,
                                                    color: `${n.fg ?? ""}`,
                                                    fontWeight: `${n.fw ?? ""}`,
                                                    fontSize: "0.9375rem",
                                                    textDecoration: "none",
                                                } as CSSProperties
                                            }
                                        >
                                            {n.label}
                                        </Link>
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
                    </nav>
                </>
            ) : null}
            <div
                style={{
                    flex: "1 1 520px",
                    minWidth: "0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2.75rem",
                }}
            >
                <section id="ar-overview" style={{ scrollMarginTop: "1rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0 0 0.4rem" }}>Round Overview</h2>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 1rem",
                            maxWidth: "76ch",
                        }}
                    >
                        <strong style={{ color: "var(--text-primary)" }}>
                            WGS rounds are cumulative: R3 includes R1, R4 includes R3, and R5 includes R4.
                        </strong>{" "}
                        R2 is the separate whole-exome sequencing round.
                    </p>
                    <Card {...cardStyle2}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", minWidth: "680px", fontSize: "0.875rem" }}>
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            style={{
                                                textAlign: "left",
                                                fontSize: "0.75rem",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color: "var(--text-muted)",
                                                fontWeight: "700",
                                                padding: "0.75rem 1rem",
                                                borderBottom: "1px solid var(--border)",
                                                whiteSpace: "nowrap",
                                                background: "var(--gray-50)",
                                            }}
                                        >
                                            Round
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                textAlign: "left",
                                                fontSize: "0.75rem",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color: "var(--text-muted)",
                                                fontWeight: "700",
                                                padding: "0.75rem 1rem",
                                                borderBottom: "1px solid var(--border)",
                                                whiteSpace: "nowrap",
                                                background: "var(--gray-50)",
                                            }}
                                        >
                                            Assay
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                textAlign: "right",
                                                fontSize: "0.75rem",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color: "var(--text-muted)",
                                                fontWeight: "700",
                                                padding: "0.75rem 1rem",
                                                borderBottom: "1px solid var(--border)",
                                                whiteSpace: "nowrap",
                                                background: "var(--gray-50)",
                                            }}
                                        >
                                            Samples
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                textAlign: "left",
                                                fontSize: "0.75rem",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color: "var(--text-muted)",
                                                fontWeight: "700",
                                                padding: "0.75rem 1rem",
                                                borderBottom: "1px solid var(--border)",
                                                whiteSpace: "nowrap",
                                                background: "var(--gray-50)",
                                            }}
                                        >
                                            Release
                                        </th>
                                        <th
                                            scope="col"
                                            style={{
                                                textAlign: "left",
                                                fontSize: "0.75rem",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color: "var(--text-muted)",
                                                fontWeight: "700",
                                                padding: "0.75rem 1rem",
                                                borderBottom: "1px solid var(--border)",
                                                whiteSpace: "nowrap",
                                                background: "var(--gray-50)",
                                            }}
                                        >
                                            Project fileset
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(roundOverview ?? []).map((r: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                                                <th
                                                    scope="row"
                                                    style={{
                                                        textAlign: "left",
                                                        padding: "0.7rem 1rem",
                                                        fontWeight: "700",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {r.label}
                                                </th>
                                                <td style={{ padding: "0.7rem 1rem" }}>{r.assay}</td>
                                                <td
                                                    style={{
                                                        padding: "0.7rem 1rem",
                                                        textAlign: "right",
                                                        fontVariantNumeric: "tabular-nums",
                                                    }}
                                                >
                                                    {r.samples}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.7rem 1rem",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <Link
                                                        href={r.href}
                                                        target="_blank"
                                                        rel="noopener"
                                                        title={`NG00067.${r.firstV ?? ""} release notes`}
                                                        style={{ fontWeight: "700" }}
                                                    >
                                                        {r.firstV}
                                                    </Link>{" "}
                                                    · {r.firstD}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.7rem 1rem",
                                                        fontFamily: "var(--font-mono)",
                                                        fontSize: "0.8125rem",
                                                    }}
                                                >
                                                    {r.fileset}
                                                </td>
                                            </tr>
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>
                <section id="ar-products" style={{ scrollMarginTop: "1rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0 0 0.4rem" }}>Core Data Products</h2>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 1rem",
                            maxWidth: "76ch",
                        }}
                    >
                        The main sequencing products released for each round. This is not a complete inventory of every
                        derivative resource.
                    </p>
                    <Card {...cardStyle2}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", minWidth: "760px", fontSize: "0.875rem" }}>
                                <thead>
                                    <tr>
                                        {(coreCols ?? []).map((c: any, $index: number) => (
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
                                <tbody>
                                    {(coreRows ?? []).map((r: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                                                <th
                                                    scope="row"
                                                    style={{
                                                        textAlign: "left",
                                                        padding: "0.7rem 1rem",
                                                        fontWeight: "700",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {r.label}
                                                </th>
                                                {(r.cells ?? []).map((c: any, $index: number) => (
                                                    <Fragment key={$index}>
                                                        <td
                                                            style={{
                                                                padding: "0.7rem 1rem",
                                                                textAlign: "center",
                                                                verticalAlign: "top",
                                                            }}
                                                        >
                                                            {c.has ? (
                                                                <>
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            gap: "0.1rem",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <Link
                                                                            href={c.href}
                                                                            target="_blank"
                                                                            rel="noopener"
                                                                            title={`NG00067.${c.v ?? ""} release notes`}
                                                                            style={{
                                                                                fontSize: "0.9375rem",
                                                                                fontWeight: "700",
                                                                            }}
                                                                        >
                                                                            {c.v}
                                                                        </Link>
                                                                        <span
                                                                            style={{
                                                                                fontSize: "0.75rem",
                                                                                color: "var(--text-secondary)",
                                                                                whiteSpace: "nowrap",
                                                                            }}
                                                                        >
                                                                            {c.date}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                            {c.none ? (
                                                                <>
                                                                    <span
                                                                        style={{
                                                                            color: "var(--gray-400)",
                                                                            fontWeight: "700",
                                                                        }}
                                                                    >
                                                                        —
                                                                    </span>
                                                                </>
                                                            ) : null}
                                                        </td>
                                                    </Fragment>
                                                ))}
                                            </tr>
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div
                            style={{
                                padding: "0.9rem 1.25rem",
                                background: "var(--gray-50)",
                                borderTop: "1px solid var(--border)",
                                fontSize: "0.8125rem",
                                lineHeight: "1.55",
                                color: "var(--text-secondary)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.4rem",
                            }}
                        >
                            <span>
                                Version and date indicate when each core data product was first released through
                                NG00067. Later releases may include expansions, additional chromosomes, formats, or
                                corrections. A dash indicates that the product was not released for that sequencing
                                round.
                            </span>
                        </div>
                    </Card>
                </section>
                <section id="ar-samples" style={{ scrollMarginTop: "1rem" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                            marginBottom: "0.4rem",
                        }}
                    >
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0" }}>Samples &amp; Studies</h2>
                        <Link
                            href={cohortsDssHref}
                            target="_blank"
                            rel="noopener"
                            style={{ fontSize: "0.875rem", fontWeight: "600" }}
                        >
                            Browse ADSP cohorts on DSS ↗
                        </Link>
                    </div>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 1rem",
                            maxWidth: "76ch",
                        }}
                    >
                        Grouped by cohort; each study and sample set links to its DSS page. Columns are{" "}
                        <strong>samples in each release</strong> (not unique participants). WGS releases are cumulative
                        including every sample from earlier WGS rounds. R2 is the separate exome release.
                    </p>
                    <Card {...cardStyle2}>
                        <div
                            style={{
                                display: "flex",
                                gap: "0.75rem",
                                alignItems: "center",
                                flexWrap: "wrap",
                                padding: "0.75rem 1.25rem",
                                borderBottom: "1px solid var(--border)",
                            }}
                        >
                            <div style={{ flex: "1 1 260px", maxWidth: "380px" }}>
                                <TextInput
                                    type="search"
                                    value={samplesAll.q}
                                    onChange={samplesAll.onQ}
                                    placeholder="Filter by cohort, study or sample set"
                                    aria-label="Filter sample sets"
                                />
                            </div>
                            <div role="group" aria-label="Table detail" style={{ display: "flex", gap: "0.4rem" }}>
                                {(samplesAll.viewTabs ?? []).map((d: any, $index: number) => (
                                    <Fragment key={$index}>
                                        <button
                                            type="button"
                                            onClick={d.onClick}
                                            aria-pressed={d.active}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                padding: "0",
                                                cursor: "pointer",
                                                fontFamily: "inherit",
                                            }}
                                        >
                                            <FilterChip label={d.label} selected={d.active} />
                                        </button>
                                    </Fragment>
                                ))}
                            </div>
                            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                {samplesAll.countLabel}
                            </span>
                            <div
                                style={{
                                    marginLeft: "auto",
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                            >
                                {samplesAll.filtered ? (
                                    <>
                                        <button
                                            className="hv3"
                                            type="button"
                                            onClick={samplesAll.onReset}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                padding: "0.25rem 0.5rem",
                                                font: "inherit",
                                                fontSize: "0.875rem",
                                                color: "var(--primary-blue)",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </>
                                ) : null}
                                <Button onClick={samplesAll.onExport}>Export CSV</Button>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem 0.75rem",
                                flexWrap: "wrap",
                                padding: "0.75rem 1.25rem",
                                borderBottom: "1px solid var(--border)",
                                background: "var(--gray-50)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.8125rem",
                                    fontWeight: "700",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Rounds
                            </span>
                            <div
                                role="group"
                                aria-label="Rounds to show"
                                style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                            >
                                {(samplesAll.roundPicks ?? []).map((p: any, $index: number) => (
                                    <Fragment key={$index}>
                                        <button
                                            type="button"
                                            onClick={p.onClick}
                                            aria-pressed={p.pressed}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                padding: "0",
                                                cursor: "pointer",
                                                fontFamily: "inherit",
                                            }}
                                        >
                                            <FilterChip label={p.label} selected={p.active} />
                                        </button>
                                    </Fragment>
                                ))}
                            </div>
                            <div
                                style={{
                                    marginLeft: "auto",
                                    display: "flex",
                                    gap: "1rem",
                                    fontSize: "0.8125rem",
                                }}
                            >
                                <button
                                    className="hv3"
                                    type="button"
                                    onClick={samplesAll.onLatest}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "0",
                                        font: "inherit",
                                        fontWeight: "600",
                                        color: "var(--primary-blue)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Latest only (R5 + R2)
                                </button>
                                <button
                                    className="hv3"
                                    type="button"
                                    onClick={samplesAll.onAllRounds}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "0",
                                        font: "inherit",
                                        fontWeight: "600",
                                        color: "var(--primary-blue)",
                                        cursor: "pointer",
                                    }}
                                >
                                    All rounds
                                </button>
                            </div>
                        </div>
                        <div style={{ overflow: "auto", maxHeight: "620px" }}>
                            <table style={{ width: "100%", minWidth: "720px", fontSize: "0.875rem" }}>
                                <thead>
                                    <tr>
                                        {(samplesAll.cols ?? []).map((c: any, $index: number) => (
                                            <Fragment key={$index}>
                                                <th
                                                    scope="col"
                                                    colSpan={c.colspan}
                                                    aria-sort={c.ariaSort}
                                                    style={
                                                        {
                                                            textAlign: `${c.align ?? ""}`,
                                                            fontSize: "0.75rem",
                                                            letterSpacing: "0.05em",
                                                            textTransform: "uppercase",
                                                            color: `${c.color ?? ""}`,
                                                            fontWeight: "700",
                                                            padding: "0.75rem 1rem",
                                                            borderBottom: "1px solid var(--border)",
                                                            whiteSpace: "nowrap",
                                                            background: "var(--gray-50)",
                                                            position: "sticky",
                                                            top: "0",
                                                            zIndex: "1",
                                                        } as CSSProperties
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={c.onSort}
                                                        disabled={c.disabled}
                                                        style={
                                                            {
                                                                background: "none",
                                                                border: "none",
                                                                padding: "0",
                                                                margin: "0",
                                                                font: "inherit",
                                                                color: "inherit",
                                                                letterSpacing: "inherit",
                                                                textTransform: "inherit",
                                                                cursor: `${c.cursor ?? ""}`,
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "0.35rem",
                                                            } as CSSProperties
                                                        }
                                                    >
                                                        {c.label}
                                                        <span
                                                            aria-hidden="true"
                                                            style={
                                                                {
                                                                    color: `${c.arrowColor ?? ""}`,
                                                                    fontSize: "0.625rem",
                                                                } as CSSProperties
                                                            }
                                                        >
                                                            {c.arrow}
                                                        </span>
                                                    </button>
                                                </th>
                                            </Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(samplesAll.rows ?? []).map((r: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <tr
                                                style={
                                                    {
                                                        borderBottom: "1px solid var(--gray-100)",
                                                        background: `${r.bg ?? ""}`,
                                                    } as CSSProperties
                                                }
                                            >
                                                {r.group ? (
                                                    <>
                                                        <td
                                                            colSpan={2}
                                                            style={{
                                                                padding: "0.6rem 1rem",
                                                                fontWeight: "700",
                                                            }}
                                                        >
                                                            {/* <Link
                                                                                className="hv3"
                                                                                href={r.href}
                                                                                target="_blank"
                                                                                rel="noopener"
                                                                                style={{
                                                                                    color: "var(--text-primary)",
                                                                                    textDecoration: "none",
                                                                                }}
                                                                            >
                                                                                {r.label}
                                                                            </Link> */}
                                                        </td>
                                                    </>
                                                ) : null}
                                                {r.item ? (
                                                    <>
                                                        <td
                                                            style={{
                                                                padding: "0.5rem 1rem",
                                                                verticalAlign: "top",
                                                                lineHeight: "1.3",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "0.1rem",
                                                                }}
                                                            >
                                                                <Link
                                                                    className="hv3"
                                                                    href={r.study.href}
                                                                    target="_blank"
                                                                    rel="noopener"
                                                                    style={{
                                                                        color: "var(--primary-blue)",
                                                                        textDecoration: "none",
                                                                        fontWeight: "500",
                                                                    }}
                                                                >
                                                                    {r.study.name}
                                                                </Link>
                                                                <span
                                                                    style={{
                                                                        fontFamily:
                                                                            "var(--font-mono, ui-monospace, monospace)",
                                                                        fontSize: "0.75rem",
                                                                        color: "var(--text-muted)",
                                                                    }}
                                                                >
                                                                    {r.study.id}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "0.5rem 1rem",
                                                                verticalAlign: "top",
                                                                lineHeight: "1.3",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "0.1rem",
                                                                }}
                                                            >
                                                                <Link
                                                                    className="hv3"
                                                                    href={r.set.href}
                                                                    target="_blank"
                                                                    rel="noopener"
                                                                    style={{
                                                                        color: "var(--primary-blue)",
                                                                        textDecoration: "none",
                                                                        fontWeight: "500",
                                                                    }}
                                                                >
                                                                    {r.set.name}
                                                                </Link>
                                                                <span
                                                                    style={{
                                                                        fontFamily:
                                                                            "var(--font-mono, ui-monospace, monospace)",
                                                                        fontSize: "0.75rem",
                                                                        color: "var(--text-muted)",
                                                                    }}
                                                                >
                                                                    {r.set.id}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : null}
                                                {(r.cells ?? []).map((c: any, $index: number) => (
                                                    <Fragment key={$index}>
                                                        <td
                                                            style={
                                                                {
                                                                    textAlign: `${c.align ?? ""}`,
                                                                    padding: `0.55rem 1rem 0.55rem ${c.padL ?? ""}`,
                                                                    color: `${c.color ?? ""}`,
                                                                    fontWeight: `${c.weight ?? ""}`,
                                                                    fontVariantNumeric: "tabular-nums",
                                                                    whiteSpace: `${c.ws ?? ""}`,
                                                                    maxWidth: "360px",
                                                                } as CSSProperties
                                                            }
                                                        >
                                                            {c.v}
                                                        </td>
                                                    </Fragment>
                                                ))}
                                            </tr>
                                        </Fragment>
                                    ))}
                                    {samplesAll.empty ? (
                                        <>
                                            <tr>
                                                <td
                                                    colSpan={samplesAll.ncols}
                                                    style={{
                                                        padding: "2rem 1rem",
                                                        textAlign: "center",
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    No sample sets match “{samplesAll.q}”.
                                                </td>
                                            </tr>
                                        </>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                        <div
                            style={{
                                padding: "0.8rem 1.25rem",
                                background: "var(--gray-50)",
                                borderTop: "1px solid var(--border)",
                                fontSize: "0.8125rem",
                                color: "var(--text-secondary)",
                            }}
                        >
                            {samplesAll.caption}
                        </div>
                    </Card>
                </section>
                <section id="ar-characteristics" style={{ scrollMarginTop: "1rem" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                            marginBottom: "0.4rem",
                        }}
                    >
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0" }}>Sample Characteristics</h2>
                    </div>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 1rem",
                            maxWidth: "76ch",
                        }}
                    >
                        Denominator: <strong>samples in each round</strong> (WGS rounds cumulative; R2 = exome). Race,
                        ethnicity and APOE are as reported by contributing studies.
                    </p>
                    <Card {...cardStyle3}>
                        <div
                            role="group"
                            aria-label="Composition dimension"
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                marginBottom: "1.5rem",
                                flexWrap: "wrap",
                            }}
                        >
                            {(dimTabs ?? []).map((d: any, $index: number) => (
                                <Fragment key={$index}>
                                    <button
                                        type="button"
                                        onClick={d.onClick}
                                        aria-pressed={d.active}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            padding: "0",
                                            cursor: "pointer",
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        <FilterChip label={d.label} selected={d.active} />
                                    </button>
                                </Fragment>
                            ))}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                flexWrap: "wrap",
                                margin: "-0.75rem 0 1.5rem",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.8125rem",
                                    fontWeight: "700",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Compare with
                            </span>
                            <div
                                role="group"
                                aria-label="Second variable"
                                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                            >
                                {(dim2Tabs ?? []).map((d: any, $index: number) => (
                                    <Fragment key={$index}>
                                        <button
                                            type="button"
                                            onClick={d.onClick}
                                            aria-pressed={d.active}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                padding: "0",
                                                cursor: "pointer",
                                                fontFamily: "inherit",
                                            }}
                                        >
                                            <FilterChip label={d.label} selected={d.active} />
                                        </button>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                        {cross.pending ? (
                            <>
                                <div
                                    style={{
                                        padding: "1.25rem",
                                        border: "1px dashed var(--border-hover)",
                                        borderRadius: "var(--border-radius)",
                                        background: "var(--gray-50)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.6rem",
                                    }}
                                >
                                    <span style={{ fontSize: "1rem", fontWeight: "700" }}>{cross.pairLabel}</span>
                                    <p
                                        style={{
                                            fontSize: "0.9375rem",
                                            lineHeight: "1.6",
                                            color: "var(--text-secondary)",
                                            margin: "0",
                                            maxWidth: "68ch",
                                        }}
                                    >
                                        This combined breakdown is not currently available here. Explore additional
                                        phenotype combinations in Gen3.
                                    </p>
                                    <div>
                                        <Link href={gen3.href!} target="_blank">
                                            <Button disabled={gen3.disabled}>
                                                {gen3.disabled
                                                    ? "Gen3 production URL to be confirmed"
                                                    : "NIAGADS Gen3 Discovery Portal"}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        {cross.ready ? (
                            <>
                                {cross.showRoundTabs ? (
                                    <>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                flexWrap: "wrap",
                                                marginBottom: "1.25rem",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "0.8125rem",
                                                    fontWeight: "700",
                                                    color: "var(--text-secondary)",
                                                }}
                                            >
                                                {cross.pairLabel} in
                                            </span>
                                            {(cross.roundTabs ?? []).map((d: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <button
                                                        type="button"
                                                        onClick={d.onClick}
                                                        aria-pressed={d.active}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            padding: "0",
                                                            cursor: "pointer",
                                                            fontFamily: "inherit",
                                                        }}
                                                    >
                                                        <FilterChip label={d.label} selected={d.active} />
                                                    </button>
                                                </Fragment>
                                            ))}
                                        </div>
                                    </>
                                ) : null}
                                {cross.showRoundLabel ? (
                                    <>
                                        <p
                                            style={{
                                                fontSize: "0.8125rem",
                                                fontWeight: "700",
                                                color: "var(--text-secondary)",
                                                margin: "0 0 1.25rem",
                                            }}
                                        >
                                            {cross.pairLabel} in {cross.round}
                                        </p>
                                    </>
                                ) : null}
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {(cross.rows ?? []).map((b: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "150px minmax(0, 1fr)",
                                                    gap: "1rem",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span
                                                        style={{
                                                            fontWeight: "700",
                                                            fontSize: "0.875rem",
                                                        }}
                                                    >
                                                        {b.label}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            color: "var(--text-muted)",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {b.totalLabel}
                                                    </span>
                                                </div>
                                                <div
                                                    role="img"
                                                    aria-label={b.aria}
                                                    style={{
                                                        display: "flex",
                                                        height: "28px",
                                                        borderRadius: "4px",
                                                        overflow: "hidden",
                                                        background: "var(--gray-100)",
                                                    }}
                                                >
                                                    {(b.segs ?? []).map((s: any, $index: number) => (
                                                        <Fragment key={$index}>
                                                            <div
                                                                title={s.title}
                                                                style={
                                                                    {
                                                                        width: `${s.pct ?? ""}%`,
                                                                        background: `${s.color ?? ""}`,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        color: "#fff",
                                                                        fontSize: "0.6875rem",
                                                                        fontWeight: "700",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {s.inner}
                                                            </div>
                                                        </Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "1.25rem",
                                        flexWrap: "wrap",
                                        marginTop: "1.5rem",
                                        paddingTop: "1.25rem",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    {(cross.legend ?? []).map((l: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <span
                                                    style={
                                                        {
                                                            width: "12px",
                                                            height: "12px",
                                                            borderRadius: "2px",
                                                            background: `${l.color ?? ""}`,
                                                            display: "inline-block",
                                                        } as CSSProperties
                                                    }
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "0.8125rem",
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    {l.label}
                                                </span>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                                <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            fontSize: "0.875rem",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                {(cross.cols ?? []).map((c: any, $index: number) => (
                                                    <Fragment key={$index}>
                                                        <th
                                                            scope="col"
                                                            style={
                                                                {
                                                                    textAlign: `${c.align ?? ""}`,
                                                                    fontSize: "0.75rem",
                                                                    letterSpacing: "0.04em",
                                                                    textTransform: "uppercase",
                                                                    color: "var(--text-muted)",
                                                                    fontWeight: "700",
                                                                    padding: "0.6rem 0.5rem",
                                                                    borderBottom: "1px solid var(--border)",
                                                                } as CSSProperties
                                                            }
                                                        >
                                                            {c.label}
                                                        </th>
                                                    </Fragment>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(cross.tableRows ?? []).map((r: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <tr
                                                        style={
                                                            {
                                                                borderBottom: "1px solid var(--gray-100)",
                                                                background: `${r.bg ?? ""}`,
                                                            } as CSSProperties
                                                        }
                                                    >
                                                        <th
                                                            scope="row"
                                                            style={
                                                                {
                                                                    textAlign: "left",
                                                                    padding: "0.55rem 0.5rem",
                                                                    fontWeight: `${r.weight ?? ""}`,
                                                                } as CSSProperties
                                                            }
                                                        >
                                                            {r.label}
                                                        </th>
                                                        {(r.cells ?? []).map((v: any, $index: number) => (
                                                            <Fragment key={$index}>
                                                                <td
                                                                    style={
                                                                        {
                                                                            textAlign: "right",
                                                                            padding: "0.55rem 0.5rem",
                                                                            fontWeight: `${r.weight ?? ""}`,
                                                                            color: `${v.color ?? ""}`,
                                                                        } as CSSProperties
                                                                    }
                                                                >
                                                                    {v.text}
                                                                </td>
                                                            </Fragment>
                                                        ))}
                                                    </tr>
                                                </Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "1rem",
                                        flexWrap: "wrap",
                                        marginTop: "0.75rem",
                                    }}
                                >
                                    <span />
                                    <Button onClick={cross.onExport}>Export CSV</Button>
                                </div>
                            </>
                        ) : null}
                        {cross.single ? (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {(compBars ?? []).map((b: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "110px minmax(0, 1fr)",
                                                    gap: "1rem",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span
                                                        style={{
                                                            fontWeight: "700",
                                                            fontSize: "0.9375rem",
                                                        }}
                                                    >
                                                        {b.round}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            color: "var(--text-muted)",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {b.totalLabel}
                                                    </span>
                                                </div>
                                                <div
                                                    role="img"
                                                    aria-label={b.aria}
                                                    style={{
                                                        display: "flex",
                                                        height: "28px",
                                                        borderRadius: "4px",
                                                        overflow: "hidden",
                                                        background: "var(--gray-100)",
                                                    }}
                                                >
                                                    {(b.segs ?? []).map((s: any, $index: number) => (
                                                        <Fragment key={$index}>
                                                            <div
                                                                style={
                                                                    {
                                                                        width: `${s.pct ?? ""}%`,
                                                                        background: `${s.color ?? ""}`,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        color: "#fff",
                                                                        fontSize: "0.6875rem",
                                                                        fontWeight: "700",
                                                                    } as CSSProperties
                                                                }
                                                            >
                                                                {s.inner}
                                                            </div>
                                                        </Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "1.25rem",
                                        flexWrap: "wrap",
                                        marginTop: "1.5rem",
                                        paddingTop: "1.25rem",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    {(compLegend ?? []).map((l: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <span
                                                    style={
                                                        {
                                                            width: "12px",
                                                            height: "12px",
                                                            borderRadius: "2px",
                                                            background: `${l.color ?? ""}`,
                                                            display: "inline-block",
                                                        } as CSSProperties
                                                    }
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "0.8125rem",
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    {l.label}
                                                </span>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </>
                        ) : null}
                        <p
                            style={{
                                fontSize: "0.8125rem",
                                color: "var(--text-muted)",
                                margin: "1rem 0 0",
                            }}
                        >
                            Need other combinations or filters?{" "}
                            <Link href={gen3.href!} target="_blank" rel="noopener">
                                Build custom counts in Gen3 ↗
                            </Link>
                        </p>
                    </Card>
                </section>
                <section id="ar-pubs" style={{ scrollMarginTop: "1rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0 0 0.4rem" }}>
                        Related Publications
                    </h2>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 1rem",
                            maxWidth: "76ch",
                        }}
                    >
                        Publications describing or analyzing released ADSP sequencing data. Methods papers are listed
                        under <Link href="/methods">Pipelines &amp; Methods</Link>.
                    </p>
                    <Card {...cardStyle2}>
                        <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
                            {(relPubs ?? []).map((p: any, $index: number) => (
                                <Fragment key={$index}>
                                    <li
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "72px minmax(0, 1fr)",
                                            gap: "0.25rem 1.25rem",
                                            padding: "0.9rem 1.25rem",
                                            borderBottom: "1px solid var(--gray-100)",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "0.8125rem",
                                                fontWeight: "700",
                                                color: "var(--primary-blue)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {p.roundsLabel}
                                        </span>{" "}
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "0.3rem",
                                                minWidth: "0",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "0.9375rem",
                                                    lineHeight: "1.5",
                                                    textWrap: "pretty",
                                                }}
                                            >
                                                {p.citation}
                                            </span>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "0.75rem",
                                                    flexWrap: "wrap",
                                                    fontSize: "0.8125rem",
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                <span>{p.note}</span>
                                                <Link
                                                    href={p.href}
                                                    target="_blank"
                                                    rel="noopener"
                                                    style={{ fontFamily: "var(--font-mono)" }}
                                                >
                                                    PMID {p.pmid} ↗
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
                    </Card>
                </section>
                <p style={{ fontSize: "1rem", margin: "0" }}>
                    <Link href={links.ng00067} target="_blank" rel="noopener" style={{ fontWeight: "700" }}>
                        View complete NG00067 release history on NIAGADS DSS ↗
                    </Link>
                </p>
            </div>
        </div>
    );
};
