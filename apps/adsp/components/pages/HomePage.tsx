"use client";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { Button } from "@niagads/ui";
import { useSiteVals } from "@/lib/useSiteVals";
import type { LiveStats } from "@/lib/types";
import { ADSP_DATA as D } from "@/lib/data";
import Link from "next/link";
import { ext } from "@/lib/util";

export function HomePage({ live }: { live?: LiveStats | null }) {
    const {
        availNow,
        cumulNote,
        glanceDars,
        glanceVersion,
        growth,
        growthAria,
        guideCards,
        hasProdNow,
        heroGenomes,
        inProdNow,
        wesN,
    } = useSiteVals({ page: "home", live });

    const links = D.links;
    const gen3 = ext(D.links.gen3);

    return (
        <>
            <main style={{ flex: "1" }}>
                <section style={{ background: "var(--niagads-dark-blue)", color: "#fff", padding: "4rem 2rem 0" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
                                gap: "3rem 4rem",
                                alignItems: "end",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.8125rem",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        fontWeight: "700",
                                        color: "var(--niagads-gold)",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    NIAGADS · ADSP Umbrella Dataset NG00067
                                </div>
                                <h1
                                    style={{
                                        fontSize: "3.25rem",
                                        lineHeight: "1.08",
                                        fontWeight: "700",
                                        margin: "0 0 1rem",
                                        letterSpacing: "-0.02em",
                                        color: "#ffffff",
                                    }}
                                >
                                    ADSP Data
                                </h1>
                                <p
                                    style={{
                                        fontSize: "1.5rem",
                                        lineHeight: "1.35",
                                        color: "var(--niagads-gold)",
                                        margin: "0 0 1.25rem",
                                    }}
                                >
                                    Your guide to the ADSP sequencing data resource
                                </p>
                                <p
                                    style={{
                                        fontSize: "1.0625rem",
                                        lineHeight: "1.65",
                                        color: "var(--gray-300)",
                                        maxWidth: "56ch",
                                        margin: "0 0 2rem",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Understand what ADSP data are available through NIAGADS, how the genomic data are
                                    generated and quality controlled, what phenotype resources are available, and what's
                                    currently in production.
                                </p>
                                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                                    <Link href="/releases">
                                        <Button color="white">
                                            Explore ADSP Data →
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <figure style={{ margin: "0" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: "0.25rem 0.75rem",
                                        flexWrap: "wrap",
                                        lineHeight: "1.2",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "3.5rem",
                                            fontWeight: "700",
                                            lineHeight: "1",
                                            letterSpacing: "-0.02em",
                                            fontVariantNumeric: "tabular-nums",
                                            color: "#ffffff",
                                        }}
                                    >
                                        {heroGenomes}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "1.0625rem",
                                            fontWeight: "600",
                                            color: "var(--niagads-gold)",
                                        }}
                                    >
                                        whole genomes in R5
                                    </span>
                                </div>
                                <figcaption
                                    style={{
                                        fontSize: "0.9375rem",
                                        color: "var(--gray-300)",
                                        margin: "0.75rem 0 1.5rem",
                                    }}
                                >
                                    Each WGS round includes the one before it.
                                </figcaption>
                                <div
                                    role="img"
                                    aria-label={growthAria}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: "0.75rem",
                                        height: "180px",
                                        borderBottom: "1px solid rgba(255,255,255,0.3)",
                                    }}
                                >
                                    {(growth ?? []).map((g: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <div
                                                style={{
                                                    flex: "1",
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "flex-end",
                                                    alignItems: "center",
                                                    gap: "0.35rem",
                                                }}
                                            >
                                                <span
                                                    style={
                                                        {
                                                            fontSize: "0.8125rem",
                                                            fontWeight: "700",
                                                            fontVariantNumeric: "tabular-nums",
                                                            color: `${g.numColor ?? ""}`,
                                                        } as CSSProperties
                                                    }
                                                >
                                                    {g.n}
                                                </span>
                                                <div
                                                    style={
                                                        {
                                                            width: "100%",
                                                            height: `${g.h ?? ""}%`,
                                                            background: `${g.bg ?? ""}`,
                                                            borderRadius: "3px 3px 0 0",
                                                        } as CSSProperties
                                                    }
                                                />
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    {(growth ?? []).map((g: any, $index: number) => (
                                        <Fragment key={$index}>
                                            <span
                                                style={{
                                                    flex: "1",
                                                    textAlign: "center",
                                                    fontSize: "0.8125rem",
                                                    fontWeight: "600",
                                                    paddingTop: "0.5rem",
                                                    color: "var(--gray-300)",
                                                }}
                                            >
                                                {g.label}
                                            </span>
                                        </Fragment>
                                    ))}
                                </div>
                                <p style={{ fontSize: "0.8125rem", color: "var(--gray-300)", margin: "1rem 0 0" }}>
                                    Plus {wesN} exomes in R2, the separate whole-exome round.
                                </p>
                            </figure>
                        </div>
                        <div
                            role="region"
                            aria-label="ADSP Data at a Glance"
                            style={{
                                marginTop: "3.5rem",
                                borderTop: "1px solid rgba(255,255,255,0.18)",
                                padding: "1.75rem 0 1.75rem",
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr)",
                                gap: "2rem",
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        fontSize: "0.75rem",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "var(--gray-300)",
                                        fontWeight: "700",
                                        margin: "0 0 1.1rem",
                                    }}
                                >
                                    Access the data
                                </h2>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "flex-end",
                                        gap: "1.25rem 4rem",
                                    }}
                                >
                                    <Link
                                        href={links.ng00067}
                                        target="_blank"
                                        rel="noopener"
                                        title="Open NG00067 on DSS"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.3rem",
                                            textDecoration: "none",
                                            minWidth: "0",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "700",
                                                letterSpacing: "0.06em",
                                                color: "var(--gray-300)",
                                            }}
                                        >
                                            DATASET
                                        </span>{" "}
                                        <span
                                            style={
                                                {
                                                    fontSize: "1.5rem",
                                                    fontWeight: "700",
                                                    fontVariantNumeric: "tabular-nums",
                                                    whiteSpace: "nowrap",
                                                    textDecoration: "underline",
                                                    textDecorationColor: "var(--niagads-gold)",
                                                    textUnderlineOffset: "5px",
                                                    color: `${glanceVersion.valueColor ?? ""}`,
                                                } as CSSProperties
                                            }
                                        >
                                            {glanceVersion.value} ↗
                                        </span>{" "}
                                        <span
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "var(--gray-300)",
                                                lineHeight: "1.45",
                                            }}
                                        >
                                            {glanceVersion.note}
                                        </span>
                                    </Link>
                                    <Link
                                        href={glanceDars.href!}
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.3rem",
                                            textDecoration: "none",
                                            minWidth: "0",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "700",
                                                letterSpacing: "0.06em",
                                                color: "var(--gray-300)",
                                            }}
                                        >
                                            APPROVED DARS
                                        </span>{" "}
                                        <span
                                            style={
                                                {
                                                    fontSize: "1.5rem",
                                                    fontWeight: "700",
                                                    fontVariantNumeric: "tabular-nums",
                                                    whiteSpace: "nowrap",
                                                    textDecoration: "underline",
                                                    textDecorationColor: "var(--niagads-gold)",
                                                    textUnderlineOffset: "5px",
                                                    color: `${glanceDars.valueColor ?? ""}`,
                                                } as CSSProperties
                                            }
                                        >
                                            {glanceDars.value} ↗
                                        </span>{" "}
                                        <span
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "var(--gray-300)",
                                                lineHeight: "1.45",
                                            }}
                                        >
                                            Data Access Requests
                                        </span>
                                    </Link>
                                    <div
                                        style={{
                                            marginLeft: "auto",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: "0.5rem",
                                            maxWidth: "360px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "0.875rem",
                                                lineHeight: "1.5",
                                                color: "var(--gray-300)",
                                            }}
                                        >
                                            Access is through a NIAGADS DAR for NG00067.
                                        </span>
                                        <Link href="/access">
                                            <Button color="white">
                                                How to access ADSP data →
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: "0.75rem 1.25rem",
                                flexWrap: "wrap",
                                padding: "1rem 0 1.25rem",
                                borderTop: "1px solid rgba(255,255,255,0.18)",
                            }}
                        >
                            <Link
                                href={links.adseq}
                                target="_blank"
                                rel="noopener"
                                style={{
                                    color: "#ffffff",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    textDecoration: "underline",
                                    textDecorationColor: "var(--niagads-gold)",
                                    textUnderlineOffset: "4px",
                                }}
                            >
                                Learn more about the ADSP at adseq.org ↗
                            </Link>
                            <Link
                                href={links.adseq}
                                target="_blank"
                                rel="noopener"
                                aria-label="Alzheimer's Disease Sequencing Project (adseq.org)"
                                style={{ display: "block", flex: "none" }}
                            >
                                <img
                                    src="/assets/adsp-logo-horizontal-light.png"
                                    alt="Alzheimer's Disease Sequencing Project"
                                    style={{ display: "block", height: "28px", width: "auto" }}
                                />
                            </Link>
                        </div>
                    </div>
                </section>
                <section
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "4.5rem 2rem 0",
                        boxSizing: "border-box",
                        width: "100%",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "1.875rem",
                            fontWeight: "700",
                            margin: "0 0 0.4rem",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        ADSP Data Guide
                    </h2>
                    <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", margin: "0 0 2rem" }}>
                        Understand the ADSP data resource.
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                            gap: "2rem 3rem",
                        }}
                    >
                        {(guideCards ?? []).map((c: any, $index: number) => (
                            <Fragment key={$index}>
                                <Link
                                    className="hv2"
                                    href={c.href}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                        paddingTop: "1.25rem",
                                        borderTop: "3px solid var(--primary-blue)",
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "0.8125rem",
                                            fontWeight: "700",
                                            color: "var(--text-muted)",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {c.n}
                                    </span>{" "}
                                    <h3
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: "700",
                                            margin: "0",
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {c.title}
                                    </h3>{" "}
                                    <p
                                        style={{
                                            fontSize: "0.9375rem",
                                            lineHeight: "1.55",
                                            color: "var(--text-secondary)",
                                            margin: "0",
                                            textWrap: "pretty",
                                            flex: "1",
                                        }}
                                    >
                                        {c.body}
                                    </p>{" "}
                                    <span
                                        style={{
                                            fontSize: "0.875rem",
                                            fontWeight: "700",
                                            color: "var(--primary-blue)",
                                        }}
                                    >
                                        {c.cta}
                                    </span>
                                </Link>
                            </Fragment>
                        ))}
                    </div>
                </section>
                <section
                    aria-labelledby="avail-h"
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "4.5rem 2rem 0",
                        boxSizing: "border-box",
                        width: "100%",
                    }}
                >
                    <h2
                        id="avail-h"
                        style={{
                            fontSize: "1.875rem",
                            fontWeight: "700",
                            margin: "0 0 0.4rem",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Available Data &amp; What’s Next
                    </h2>
                    <p
                        style={{
                            fontSize: "1.0625rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 2rem",
                            maxWidth: "70ch",
                        }}
                    >
                        What you can work with today, and what’s coming.
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                            gap: "1.25rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.1rem",
                                padding: "1.5rem",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderTop: "4px solid var(--success-green)",
                                borderRadius: "var(--border-radius)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.6875rem",
                                    fontWeight: "700",
                                    letterSpacing: "0.1em",
                                    color: "var(--success-green)",
                                }}
                            >
                                ● AVAILABLE NOW
                            </span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 2.5rem" }}>
                                {(availNow ?? []).map((i: any, $index: number) => (
                                    <Fragment key={$index}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                                            <span
                                                style={{
                                                    fontSize: "1.375rem",
                                                    fontWeight: "700",
                                                    color: "var(--text-primary)",
                                                    fontVariantNumeric: "tabular-nums",
                                                }}
                                            >
                                                {i.big}
                                            </span>
                                            <span style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>
                                                {i.sub}
                                            </span>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                            <p
                                style={{
                                    fontSize: "0.8125rem",
                                    lineHeight: "1.55",
                                    color: "var(--text-muted)",
                                    margin: "0",
                                    maxWidth: "60ch",
                                    textWrap: "pretty",
                                }}
                            >
                                {cumulNote}
                            </p>
                            <div style={{ marginTop: "auto" }}>
                                <Link
                                    className="hv3"
                                    href="/releases"
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: "700",
                                        color: "var(--primary-blue)",
                                        textDecoration: "none",
                                    }}
                                >
                                    Explore released data →
                                </Link>
                            </div>
                        </div>
                        {hasProdNow ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.1rem",
                                        padding: "1.5rem",
                                        background: "var(--surface)",
                                        border: "1px solid var(--border)",
                                        borderTop: "4px solid var(--warning-amber)",
                                        borderRadius: "var(--border-radius)",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "0.6875rem",
                                            fontWeight: "700",
                                            letterSpacing: "0.1em",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        ◐ IN PRODUCTION
                                    </span>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 2.5rem" }}>
                                        {(inProdNow ?? []).map((i: any, $index: number) => (
                                            <Fragment key={$index}>
                                                <div
                                                    style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "1.375rem",
                                                            fontWeight: "700",
                                                            color: "var(--text-primary)",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {i.big}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "0.9375rem",
                                                            color: "var(--text-secondary)",
                                                        }}
                                                    >
                                                        {i.sub}
                                                    </span>
                                                </div>
                                            </Fragment>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: "auto" }}>
                                        <Link
                                            className="hv3"
                                            href="/releases/production"
                                            style={{
                                                fontSize: "0.9375rem",
                                                fontWeight: "700",
                                                color: "var(--primary-blue)",
                                                textDecoration: "none",
                                            }}
                                        >
                                            View production status →
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </section>
                <section
                    aria-labelledby="explore-h"
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "4.5rem 2rem 4.5rem",
                        boxSizing: "border-box",
                        width: "100%",
                    }}
                >
                    <h2
                        id="explore-h"
                        style={{
                            fontSize: "1.875rem",
                            fontWeight: "700",
                            margin: "0 0 0.4rem",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Explore and Access ADSP Data
                    </h2>
                    <p
                        style={{
                            fontSize: "1.0625rem",
                            lineHeight: "1.6",
                            color: "var(--text-secondary)",
                            margin: "0 0 2rem",
                            maxWidth: "78ch",
                            textWrap: "pretty",
                        }}
                    >
                        You can browse information about the ADSP resource without an approval. Signing in to Gen3
                        provides privacy-protected summary exploration, while an approved NG00067 Data Access Request
                        provides access to controlled data.
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                            gap: "1.25rem",
                            alignItems: "stretch",
                            gridAutoRows: "auto",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridRow: "span 3",
                                gridTemplateRows: "subgrid",
                                rowGap: "0",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderTop: "4px solid var(--gray-400)",
                                borderRadius: "var(--border-radius)",
                            }}
                        >
                            <div
                                style={{
                                    padding: "1.25rem 1.5rem 1rem",
                                    display: "flex",
                                    gap: "0.9rem",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        flex: "none",
                                        width: "2.25rem",
                                        height: "2.25rem",
                                        borderRadius: "50%",
                                        background: "var(--gray-100)",
                                        color: "var(--text-primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "700",
                                        fontSize: "1.0625rem",
                                    }}
                                >
                                    1
                                </span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                        Browse Publicly
                                    </h3>
                                    <span
                                        style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: "600" }}
                                    >
                                        No login required
                                    </span>
                                </div>
                            </div>
                            <ul
                                style={{
                                    margin: "0",
                                    padding: "0 1.5rem 1.25rem 2.7rem",
                                    fontSize: "0.9375rem",
                                    lineHeight: "1.6",
                                    color: "var(--text-secondary)",
                                    flex: "1",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.4rem",
                                }}
                            >
                                <li>Learn about sequencing rounds, methods, phenotypes, and production on this site</li>
                                <li>
                                    Browse the NG00067 dataset record, studies, cohorts, filesets, and public
                                    information on DSS
                                </li>
                                <li>
                                    Access open-access data products through the{" "}
                                    <Link
                                        href="https://dss.niagads.org/open-access-data-portal/#NG00067"
                                        target="_blank"
                                        rel="noopener"
                                        style={{ color: "var(--primary-blue)", fontWeight: "600" }}
                                    >
                                        NIAGADS Open Access Data Portal ↗
                                    </Link>
                                </li>
                            </ul>
                            <div
                                style={{
                                    padding: "1rem 1.5rem",
                                    borderTop: "1px solid var(--border)",
                                    background: "var(--gray-50)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.4rem",
                                }}
                            >
                                <Link
                                    className="hv3"
                                    href={links.ng00067}
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: "700",
                                        color: "var(--primary-blue)",
                                        textDecoration: "none",
                                    }}
                                >
                                    Browse NG00067 on DSS ↗
                                </Link>
                                <Link
                                    className="hv3"
                                    href="https://dss.niagads.org/open-access-data-portal/#NG00067"
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: "700",
                                        color: "var(--primary-blue)",
                                        textDecoration: "none",
                                    }}
                                >
                                    Open Access Data Portal ↗
                                </Link>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridRow: "span 3",
                                gridTemplateRows: "subgrid",
                                rowGap: "0",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderTop: "4px solid var(--primary-blue)",
                                borderRadius: "var(--border-radius)",
                            }}
                        >
                            <div
                                style={{
                                    padding: "1.25rem 1.5rem 1rem",
                                    display: "flex",
                                    gap: "0.9rem",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        flex: "none",
                                        width: "2.25rem",
                                        height: "2.25rem",
                                        borderRadius: "50%",
                                        background: "var(--primary-blue)",
                                        color: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "700",
                                        fontSize: "1.0625rem",
                                    }}
                                >
                                    2
                                </span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                        Explore in Gen3
                                    </h3>
                                    <span
                                        style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: "600" }}
                                    >
                                        NIH RAS sign-in
                                    </span>
                                </div>
                            </div>
                            <ul
                                style={{
                                    margin: "0",
                                    padding: "0 1.5rem 1.25rem 2.7rem",
                                    fontSize: "0.9375rem",
                                    lineHeight: "1.6",
                                    color: "var(--text-secondary)",
                                    flex: "1",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.4rem",
                                }}
                            >
                                <li>Explore summary-level cohort and phenotype information</li>
                                <li>Filter and query available ADSP data</li>
                                <li>Privacy protections prevent exploration of small protected groups</li>
                                <li>Controlled subject/sample-level information requires ADSP authorization</li>
                            </ul>
                            <div
                                style={{
                                    padding: "1rem 1.5rem",
                                    borderTop: "1px solid var(--border)",
                                    background: "var(--gray-50)",
                                }}
                            >
                                <Link
                                    className="hv3"
                                    href={gen3.href!}
                                    target="_blank"
                                    rel="noopener"
                                    title={gen3.disabled ? "Gen3 production URL to be confirmed" : "NIAGADS Gen3 Discovery Portal"}
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: "700",
                                        color: "var(--primary-blue)",
                                        textDecoration: "none",
                                    }}
                                >
                                    Explore in Gen3 ↗
                                </Link>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridRow: "span 3",
                                gridTemplateRows: "subgrid",
                                rowGap: "0",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderTop: "4px solid var(--niagads-dark-blue)",
                                borderRadius: "var(--border-radius)",
                            }}
                        >
                            <div
                                style={{
                                    padding: "1.25rem 1.5rem 1rem",
                                    display: "flex",
                                    gap: "0.9rem",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        flex: "none",
                                        width: "2.25rem",
                                        height: "2.25rem",
                                        borderRadius: "50%",
                                        background: "var(--niagads-dark-blue)",
                                        color: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "700",
                                        fontSize: "1.0625rem",
                                    }}
                                >
                                    3
                                </span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                        Access Controlled Data
                                    </h3>
                                    <span
                                        style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: "600" }}
                                    >
                                        Approved NG00067 Data Access Request
                                    </span>
                                </div>
                            </div>
                            <ul
                                style={{
                                    margin: "0",
                                    padding: "0 1.5rem 1.25rem 2.7rem",
                                    fontSize: "0.9375rem",
                                    lineHeight: "1.6",
                                    color: "var(--text-secondary)",
                                    flex: "1",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.4rem",
                                }}
                            >
                                <li>Download controlled ADSP genomic and phenotype data through DSS</li>
                                <li>
                                    Explore detailed subject/sample-level information in Gen3 according to authorization
                                </li>
                                <li>Access is limited by approved data-use/consent terms</li>
                            </ul>
                            <div
                                style={{
                                    padding: "1rem 1.5rem",
                                    borderTop: "1px solid var(--border)",
                                    background: "var(--gray-50)",
                                }}
                            >
                                <Link
                                    className="hv3"
                                    href="/access/apply"
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: "700",
                                        color: "var(--primary-blue)",
                                        textDecoration: "none",
                                    }}
                                >
                                    How to request access →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
