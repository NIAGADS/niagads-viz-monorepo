"use client";

import { Fragment } from "react";
import type { CSSProperties } from "react";
import { Button } from "@niagads/ui";
import Link from "next/link";

export function AboutPage() {
    const aboutRoles = [];
    const timeline = [];
    const adseqLink = "";

    return (
        <>
            <main
                style={{
                    flex: "1",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "2.5rem 2rem 4rem",
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3.5rem",
                }}
            >
                <section>
                    <div>
                        <h1
                            style={{
                                fontSize: "2.25rem",
                                fontWeight: "700",
                                margin: "0 0 1.5rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            About ADSP Data at NIAGADS
                        </h1>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0 0 0.6rem" }}>
                            NIAGADS and the ADSP
                        </h2>
                        <p
                            style={{
                                fontSize: "1.0625rem",
                                lineHeight: "1.65",
                                margin: "0 0 1rem",
                                maxWidth: "64ch",
                                textWrap: "pretty",
                            }}
                        >
                            NIAGADS serves as the Data Coordinating Center for the Alzheimer's Disease Sequencing
                            Project (ADSP). In this role, NIAGADS coordinates the collection, production, integration,
                            quality assessment, storage, and distribution of large-scale ADSP sequencing data.
                        </p>
                        <p
                            style={{
                                fontSize: "1rem",
                                lineHeight: "1.65",
                                color: "var(--text-secondary)",
                                margin: "0",
                                maxWidth: "64ch",
                                textWrap: "pretty",
                            }}
                        >
                            This site provides a guide to the ADSP data resource at NIAGADS including sequencing
                            releases, data production, processing methods, phenotype resources, and data access.
                        </p>
                    </div>
                </section>
                <section>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0 0 1.25rem" }}>
                        What NIAGADS Does for ADSP Data
                    </h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                            gap: "1.5rem 2.5rem",
                        }}
                    >
                        {(aboutRoles ?? []).map((r: any, $index: number) => (
                            <Fragment key={$index}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.45rem",
                                        paddingTop: "1rem",
                                        borderTop: "3px solid var(--primary-blue)",
                                    }}
                                >
                                    <span
                                        style={{ fontSize: "0.8125rem", fontWeight: "700", color: "var(--text-muted)" }}
                                    >
                                        {r.n}
                                    </span>
                                    <h3 style={{ fontSize: "1.0625rem", fontWeight: "700", margin: "0" }}>{r.title}</h3>
                                    <p
                                        style={{
                                            fontSize: "0.9375rem",
                                            lineHeight: "1.55",
                                            color: "var(--text-secondary)",
                                            margin: "0",
                                            textWrap: "pretty",
                                        }}
                                    >
                                        {r.body}
                                    </p>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0 0 1.5rem" }}>
                        ADSP Data at NIAGADS: Growth Over Time
                    </h2>
                    <ol
                        style={{
                            listStyle: "none",
                            margin: "0",
                            padding: "0",
                            display: "grid",
                            gridAutoFlow: "column",
                            gridAutoColumns: "minmax(0, 1fr)",
                            position: "relative",
                        }}
                    >
                        {(timeline ?? []).map((t: any, $index: number) => (
                            <Fragment key={$index}>
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                        position: "relative",
                                    }}
                                >
                                    <span
                                        style={
                                            {
                                                fontSize: "1.125rem",
                                                fontWeight: "700",
                                                color: `${t.yearColor ?? ""}`,
                                                fontVariantNumeric: "tabular-nums",
                                            } as CSSProperties
                                        }
                                    >
                                        {t.year}
                                    </span>{" "}
                                    <div style={{ position: "relative", height: "18px" }}>
                                        <div
                                            aria-hidden="true"
                                            style={
                                                {
                                                    position: "absolute",
                                                    left: "0",
                                                    right: "0",
                                                    top: "8px",
                                                    borderTop: `2px ${t.lineStyle ?? ""} var(--gray-300)`,
                                                } as CSSProperties
                                            }
                                        />
                                        <span
                                            aria-hidden="true"
                                            style={
                                                {
                                                    position: "absolute",
                                                    left: "0",
                                                    top: "2px",
                                                    width: "14px",
                                                    height: "14px",
                                                    borderRadius: "999px",
                                                    background: `${t.dot ?? ""}`,
                                                    border: `2px solid ${t.dotBorder ?? ""}`,
                                                    boxSizing: "border-box",
                                                } as CSSProperties
                                            }
                                        />
                                    </div>{" "}
                                    <Link
                                        href={t.href}
                                        style={
                                            {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "0.15rem",
                                                paddingRight: "0.75rem",
                                                textDecoration: "none",
                                                color: "inherit",
                                                pointerEvents: `${t.pe ?? ""}`,
                                            } as CSSProperties
                                        }
                                    >
                                        <span
                                            style={
                                                {
                                                    fontSize: "0.9375rem",
                                                    fontWeight: "700",
                                                    color: `${t.titleColor ?? ""}`,
                                                    lineHeight: "1.3",
                                                } as CSSProperties
                                            }
                                        >
                                            {t.title}
                                        </span>{" "}
                                        <span
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: "1.4",
                                            }}
                                        >
                                            {t.note}
                                        </span>
                                    </Link>
                                </li>
                            </Fragment>
                        ))}
                    </ol>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "1rem 0 0" }}>
                        Selected milestones in the growth of the ADSP data resource at NIAGADS. See{" "}
                        <Link href="/releases">Sequencing Rounds</Link> for detailed release history.
                    </p>
                </section>
                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
                        gap: "1.5rem 4rem",
                        alignItems: "center",
                        padding: "2rem 0",
                        borderTop: "1px solid var(--border)",
                        borderBottom: "1px solid var(--border)",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: "1.375rem", fontWeight: "700", margin: "0 0 0.6rem" }}>
                            Part of the Broader Alzheimer's Disease Sequencing Project
                        </h2>
                        <p
                            style={{
                                fontSize: "0.9375rem",
                                lineHeight: "1.65",
                                color: "var(--text-secondary)",
                                margin: "0 0 0.6rem",
                                maxWidth: "66ch",
                                textWrap: "pretty",
                            }}
                        >
                            The ADSP is a collaborative NIA-supported initiative bringing together investigators and
                            cohorts to identify genetic variation associated with Alzheimer's disease and related
                            dementias. NIAGADS supports the data-production, coordination, and distribution components
                            of the program.
                        </p>
                        <p
                            style={{
                                fontSize: "0.9375rem",
                                lineHeight: "1.65",
                                color: "var(--text-secondary)",
                                margin: "0",
                                maxWidth: "66ch",
                            }}
                        >
                            For information about the broader ADSP consortium, research activities, investigators, and
                            organization, visit adseq.org.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.5rem",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                        }}
                    >
                        <img
                            src="/assets/adsp-logo-primary.png"
                            alt="Alzheimer's Disease Sequencing Project"
                            style={{ display: "block", height: "72px", width: "auto" }}
                        />
                        <Link href={adseqLink} target="_blank">
                            <Button color="primary">Learn about the ADSP consortium ↗</Button>
                        </Link>
                    </div>
                </section>
                <section style={{ maxWidth: "72ch" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0 0 0.4rem" }}>
                        Genomic data production, formerly GCAD
                    </h2>
                    <p
                        style={{
                            fontSize: "0.9375rem",
                            lineHeight: "1.6",
                            color: "var(--text-secondary)",
                            margin: "0 0 0.6rem",
                            textWrap: "pretty",
                        }}
                    >
                        ADSP genomic data production was previously performed by the Genome Center for Alzheimer’s
                        Disease (GCAD). NIAGADS now carries out this work as part of its ADSP Data Coordinating Center
                        role.
                    </p>
                    <Link href="/methods" style={{ fontSize: "0.9375rem", fontWeight: "700" }}>
                        Learn how ADSP genomic data are processed →
                    </Link>
                </section>
                <section
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.35rem",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    <strong style={{ fontSize: "0.9375rem", color: "var(--text-primary)" }}>NIAGADS</strong>
                    <span>
                        NIA-designated repository for Alzheimer's disease and related dementias genetics and genomics
                        data
                    </span>
                    <span>University of Pennsylvania</span>
                    <span style={{ color: "var(--text-muted)" }}>
                        NIAGADS is supported by an NIH/NIA collaborative agreement (U24-AG041689).{" "}
                        <Link href="https://www.niagads.org/about/" target="_blank" rel="noopener">
                            About NIAGADS ↗
                        </Link>
                    </span>
                </section>
            </main>
        </>
    );
}
