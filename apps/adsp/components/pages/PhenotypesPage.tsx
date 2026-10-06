"use client";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { A } from "@/components/A";
import { Button, Card, TextInput } from "@/components/ds";
import { useSiteVals } from "@/lib/useSiteVals";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function PhenotypesPage() {
    const {
        cardStyle2,
        cardStyle3,
        cardStyle4,
        cardStyle6,
        links,
        phcBars,
        phcDisabled,
        phcHeadGroups,
        phcHref,
        phcLabel,
        phcStats,
        phcTable,
        toBasic,
        toPhc,
    } = useSiteVals({ page: "phc" });
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
                    gap: "3rem",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "2.25rem",
                            fontWeight: "700",
                            margin: "0 0 0.5rem",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        ADSP Phenotypes
                    </h1>
                    <p
                        style={{
                            fontSize: "1.0625rem",
                            color: "var(--text-secondary)",
                            margin: "0 0 1.5rem",
                            maxWidth: "74ch",
                        }}
                    >
                        NG00067 distributes two distinct phenotype resources. They are produced through separate
                        processes and released in separate filesets.
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                            gap: "1.25rem",
                        }}
                    >
                        <A
                            className="hv7"
                            href="/phenotypes"
                            onClick={toBasic}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                padding: "1.5rem",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderTop: "4px solid var(--primary-blue)",
                                borderRadius: "var(--border-radius-lg)",
                                textDecoration: "none",
                                color: "inherit",
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
                                FILESET <span style={{ fontFamily: "var(--font-mono)" }}>fsa000002</span>
                            </span>{" "}
                            <h2
                                style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "700",
                                    margin: "0",
                                    color: "var(--primary-blue)",
                                }}
                            >
                                ADSP Basic Phenotypes
                            </h2>{" "}
                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    lineHeight: "1.55",
                                    color: "var(--text-secondary)",
                                    margin: "0",
                                    flex: "1",
                                    textWrap: "pretty",
                                }}
                            >
                                Core phenotype and participant information maintained for ADSP participants and released
                                with the sequencing resource.
                            </p>{" "}
                            <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--primary-blue)" }}>
                                Go to Basic Phenotypes ↓
                            </span>
                        </A>
                        <A
                            className="hv7"
                            href="/phenotypes"
                            onClick={toPhc}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                padding: "1.5rem",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderTop: "4px solid var(--niagads-gold)",
                                borderRadius: "var(--border-radius-lg)",
                                textDecoration: "none",
                                color: "inherit",
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
                                FILESET <span style={{ fontFamily: "var(--font-mono)" }}>fsa000027</span>
                            </span>{" "}
                            <h2
                                style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "700",
                                    margin: "0",
                                    color: "var(--primary-blue)",
                                }}
                            >
                                ADSP-PHC Harmonized Phenotypes
                            </h2>{" "}
                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    lineHeight: "1.55",
                                    color: "var(--text-secondary)",
                                    margin: "0",
                                    flex: "1",
                                    textWrap: "pretty",
                                }}
                            >
                                A harmonized phenotype resource generated by the ADSP Phenotype Harmonization
                                Consortium.
                            </p>{" "}
                            <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--primary-blue)" }}>
                                Go to ADSP-PHC Phenotypes ↓
                            </span>
                        </A>
                    </div>
                </div>
                <section
                    id="ph-basic"
                    style={{
                        scrollMarginTop: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        paddingTop: "2rem",
                        borderTop: "4px solid var(--primary-blue)",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "0.6875rem",
                                fontWeight: "700",
                                letterSpacing: "0.1em",
                                color: "var(--text-muted)",
                                marginBottom: "0.4rem",
                            }}
                        >
                            RESOURCE 1 · FILESET <span style={{ fontFamily: "var(--font-mono)" }}>fsa000002</span>
                        </div>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0 0 0.5rem" }}>
                            ADSP Basic Phenotypes
                        </h2>
                        <p
                            style={{
                                fontSize: "1rem",
                                lineHeight: "1.6",
                                color: "var(--text-secondary)",
                                margin: "0",
                                maxWidth: "74ch",
                                textWrap: "pretty",
                            }}
                        >
                            Basic phenotypes are collected across ADSP cohorts and organized to accommodate different
                            study designs. Data dictionaries are available on the{" "}
                            <A href={links.ng00067} target="_blank" rel="noopener">
                                NG00067 dataset page ↗
                            </A>
                            .
                        </p>
                    </div>
                    <Card {...cardStyle2}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", minWidth: "520px", fontSize: "0.9375rem" }}>
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
                                            Basic phenotype resource
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
                                            Purpose
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                                        <th
                                            scope="row"
                                            style={{
                                                textAlign: "left",
                                                padding: "0.7rem 1rem",
                                                fontWeight: "700",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            Case/Control
                                        </th>
                                        <td
                                            style={{
                                                padding: "0.7rem 1rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            Phenotypes for case/control studies
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                                        <th
                                            scope="row"
                                            style={{
                                                textAlign: "left",
                                                padding: "0.7rem 1rem",
                                                fontWeight: "700",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            Family-Based
                                        </th>
                                        <td
                                            style={{
                                                padding: "0.7rem 1rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            Phenotypes for family-based studies; may include related family members who
                                            were not sequenced
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                                        <th
                                            scope="row"
                                            style={{
                                                textAlign: "left",
                                                padding: "0.7rem 1rem",
                                                fontWeight: "700",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            ADNI
                                        </th>
                                        <td
                                            style={{
                                                padding: "0.7rem 1rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            ADNI-specific phenotype information
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                                        <th
                                            scope="row"
                                            style={{
                                                textAlign: "left",
                                                padding: "0.7rem 1rem",
                                                fontWeight: "700",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            PSP/CBD
                                        </th>
                                        <td
                                            style={{
                                                padding: "0.7rem 1rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            Phenotypes for PSP/CBD studies
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            style={{
                                padding: "0.9rem 1.25rem",
                                background: "var(--gray-50)",
                                borderTop: "1px solid var(--border)",
                                fontSize: "0.875rem",
                                color: "var(--text-secondary)",
                            }}
                        >
                            Fileset <span style={{ fontFamily: "var(--font-mono)" }}>fsa000002</span> also contains
                            supporting resources, including the{" "}
                            <strong style={{ color: "var(--text-primary)" }}>Sample Manifest</strong> and{" "}
                            <strong style={{ color: "var(--text-primary)" }}>Subject Consent</strong> information.
                        </div>
                    </Card>
                    <section
                        aria-labelledby="ph-ids-h"
                        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                    >
                        <h2 id="ph-ids-h" style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0.5rem 0 0" }}>
                            Connecting Phenotypes to Genomic Data
                        </h2>
                        <p
                            style={{
                                fontSize: "0.9375rem",
                                lineHeight: "1.6",
                                color: "var(--text-secondary)",
                                margin: "0",
                                maxWidth: "74ch",
                                textWrap: "pretty",
                            }}
                        >
                            Basic phenotype files use the{" "}
                            <strong style={{ color: "var(--text-primary)" }}>ADSP Subject ID (SUBJID)</strong>. Genomic
                            files use the{" "}
                            <strong style={{ color: "var(--text-primary)" }}>ADSP Sample ID (SampleID)</strong>. The{" "}
                            <strong style={{ color: "var(--text-primary)" }}>Sample Manifest</strong> provides the
                            mapping between them.
                        </p>
                        <Card {...cardStyle3}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div
                                    role="img"
                                    aria-label="Phenotype data SUBJID maps through the Sample Manifest to genomic data SampleID"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.75rem",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: "1 1 170px",
                                            maxWidth: "240px",
                                            boxSizing: "border-box",
                                            padding: "0.85rem 1rem",
                                            border: "1.5px solid var(--niagads-dark-blue)",
                                            borderRadius: "3px",
                                            background: "var(--surface)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "0.6875rem",
                                                fontWeight: "700",
                                                letterSpacing: "0.1em",
                                                color: "var(--text-muted)",
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            Phenotype data
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "1.0625rem",
                                                fontWeight: "700",
                                            }}
                                        >
                                            SUBJID
                                        </div>
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        style={{ color: "var(--gray-400)", fontSize: "1.25rem", fontWeight: "700" }}
                                    >
                                        ↔
                                    </span>
                                    <div
                                        style={{
                                            flex: "1 1 170px",
                                            maxWidth: "240px",
                                            boxSizing: "border-box",
                                            padding: "0.85rem 1rem",
                                            border: "2px solid var(--niagads-gold)",
                                            borderRadius: "3px",
                                            background: "var(--surface)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "0.6875rem",
                                                fontWeight: "700",
                                                letterSpacing: "0.1em",
                                                color: "var(--text-muted)",
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            Maps SUBJID ↔ SampleID
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "1.0625rem",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Sample Manifest
                                        </div>
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        style={{ color: "var(--gray-400)", fontSize: "1.25rem", fontWeight: "700" }}
                                    >
                                        ↔
                                    </span>
                                    <div
                                        style={{
                                            flex: "1 1 170px",
                                            maxWidth: "240px",
                                            boxSizing: "border-box",
                                            padding: "0.85rem 1rem",
                                            border: "1.5px solid var(--niagads-dark-blue)",
                                            borderRadius: "3px",
                                            background: "var(--surface)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "0.6875rem",
                                                fontWeight: "700",
                                                letterSpacing: "0.1em",
                                                color: "var(--text-muted)",
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            Genomic data
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "1.0625rem",
                                                fontWeight: "700",
                                            }}
                                        >
                                            SampleID
                                        </div>
                                    </div>
                                </div>
                                <p
                                    style={{
                                        fontSize: "1.0625rem",
                                        lineHeight: "1.5",
                                        fontWeight: "700",
                                        margin: "0",
                                        padding: "0.9rem 1.1rem",
                                        background: "var(--gray-50)",
                                        borderRadius: "var(--border-radius)",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Always use the Sample Manifest to map SUBJID to SampleID. Do not derive SUBJID from
                                    the SampleID.
                                </p>
                            </div>
                        </Card>
                    </section>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                            gap: "1.25rem",
                            alignItems: "stretch",
                        }}
                    >
                        <Card {...cardStyle6}>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                Phenotype Curation &amp; QC
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    lineHeight: "1.6",
                                    color: "var(--text-secondary)",
                                    margin: "0",
                                    textWrap: "pretty",
                                }}
                            >
                                Basic phenotype data are reviewed and validated before release. Automated and manual
                                checks identify unexpected or inconsistent values, which are reviewed with the
                                submitting cohort when possible. Potential issues that cannot be resolved are identified
                                for users through phenotype flags.
                            </p>
                        </Card>
                        <Card {...cardStyle4}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", height: "100%" }}>
                                <div
                                    style={{
                                        fontSize: "0.6875rem",
                                        fontWeight: "700",
                                        letterSpacing: "0.1em",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    GITHUB RESOURCE
                                </div>
                                <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                    ADSP Integrated Phenotypes
                                </h3>
                                <p style={{ fontSize: "0.9375rem", fontWeight: "700", margin: "0" }}>
                                    Starting an AD case/control analysis?
                                </p>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        flex: "1",
                                        textWrap: "pretty",
                                    }}
                                >
                                    The ADSP Integrated Phenotypes workflow combines basic ADSP phenotype and sample
                                    information to create an analysis-ready phenotype file and a genetically unique WGS
                                    sample set for AD case/control analysis.
                                </p>
                                <div>
                                    <Button
                                        color="primary"
                                        href="https://github.com/NIAGADS/ADSPIntegratedPhenotypes"
                                        target="_blank"
                                    >
                                        View ADSP Integrated Phenotypes on GitHub ↗
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
                <section
                    id="ph-phc"
                    style={{
                        scrollMarginTop: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        paddingTop: "2rem",
                        borderTop: "4px solid var(--niagads-gold)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "1.5rem 3rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ flex: "1 1 480px", minWidth: "0" }}>
                            <div
                                style={{
                                    fontSize: "0.6875rem",
                                    fontWeight: "700",
                                    letterSpacing: "0.1em",
                                    color: "var(--text-muted)",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                RESOURCE 2 · FILESET <span style={{ fontFamily: "var(--font-mono)" }}>fsa000027</span>
                            </div>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0 0 0.5rem" }}>
                                ADSP-PHC Harmonized Phenotypes
                            </h2>
                            <p
                                style={{
                                    fontSize: "1rem",
                                    lineHeight: "1.6",
                                    color: "var(--text-secondary)",
                                    margin: "0 0 1rem",
                                    maxWidth: "74ch",
                                    textWrap: "pretty",
                                }}
                            >
                                The ADSP Phenotype Harmonization Consortium is a separate ADSP initiative that procures,
                                curates, and harmonizes richer phenotype and endophenotype data across participating
                                cohorts for genomic analysis. Harmonized resources distributed through NIAGADS are
                                available in fileset <span style={{ fontFamily: "var(--font-mono)" }}>fsa000027</span>.
                            </p>
                            <Button color="primary" href={phcHref} disabled={phcDisabled} target="_blank">
                                {phcLabel}
                            </Button>
                        </div>
                        <A
                            href={phcHref}
                            target="_blank"
                            rel="noopener"
                            aria-label="ADSP Phenotype Harmonization Consortium website"
                            style={{ display: "block", flex: "none" }}
                        >
                            <img
                                src="/assets/adsp-phc-logo.png"
                                alt="ADSP Phenotype Harmonization Consortium"
                                style={{ display: "block", height: "96px", width: "auto", mixBlendMode: "multiply" }}
                            />
                        </A>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
                                gap: "1px",
                                background: "var(--border)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--border-radius)",
                                overflow: "hidden",
                            }}
                        >
                            {(phcStats ?? []).map((s: any, $index: number) => (
                                <Fragment key={$index}>
                                    <div
                                        style={{
                                            background: "var(--surface)",
                                            padding: "1rem 1.25rem",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.2rem",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "1.75rem",
                                                fontWeight: "700",
                                                lineHeight: "1.1",
                                                color: "var(--niagads-dark-blue)",
                                                fontVariantNumeric: "tabular-nums",
                                            }}
                                        >
                                            {s.value}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: "1.4",
                                            }}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0 0 0.4rem" }}>
                            Subjects by PHC Domain and Cohort
                        </h3>
                        <p
                            style={{
                                fontSize: "0.9375rem",
                                color: "var(--text-secondary)",
                                margin: "0 0 1rem",
                                maxWidth: "74ch",
                                textWrap: "pretty",
                            }}
                        >
                            Subjects with harmonized PHC phenotypes <strong>and</strong> ADSP sequencing. Bars show each
                            domain’s total; cell shading shows where the subjects come from.
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
                                <div style={{ flex: "1 1 240px", maxWidth: "360px" }}>
                                    <TextInput
                                        type="search"
                                        value={phcTable.q}
                                        onChange={phcTable.onQ}
                                        placeholder={phcTable.placeholder}
                                        aria-label={phcTable.placeholder}
                                    />
                                </div>
                                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                    {phcTable.countLabel}
                                </span>
                                <div
                                    style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}
                                >
                                    {phcTable.filtered ? (
                                        <>
                                            <button
                                                className="hv3"
                                                type="button"
                                                onClick={phcTable.onReset}
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
                                    <Button onClick={phcTable.onExport}>Export CSV</Button>
                                </div>
                            </div>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", minWidth: "1320px", fontSize: "0.875rem" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ background: "var(--gray-50)", minWidth: "220px" }} />
                                            {(phcHeadGroups ?? []).map((g: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <th
                                                        scope="colgroup"
                                                        colSpan={g.span}
                                                        style={{
                                                            textAlign: "left",
                                                            padding: "0.7rem 0.6rem 0.35rem",
                                                            fontSize: "0.6875rem",
                                                            fontWeight: "700",
                                                            letterSpacing: "0.1em",
                                                            color: "var(--text-muted)",
                                                            background: "var(--gray-50)",
                                                            borderLeft: "2px solid var(--surface)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                borderTop: "2px solid var(--niagads-gold)",
                                                                paddingTop: "0.35rem",
                                                            }}
                                                        >
                                                            {g.label}
                                                        </div>
                                                    </th>
                                                </Fragment>
                                            ))}
                                        </tr>
                                        <tr>
                                            <th
                                                scope="row"
                                                style={{
                                                    textAlign: "left",
                                                    verticalAlign: "bottom",
                                                    padding: "0.5rem 0.6rem",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "600",
                                                    color: "var(--text-muted)",
                                                    background: "var(--gray-50)",
                                                }}
                                            >
                                                Subjects per domain
                                            </th>
                                            {(phcBars ?? []).map((b: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <td
                                                        style={{
                                                            verticalAlign: "bottom",
                                                            padding: "0.5rem 0.6rem 0.4rem",
                                                            background: "var(--gray-50)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "flex-end",
                                                                gap: "0.25rem",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize: "0.8125rem",
                                                                    fontWeight: "700",
                                                                    fontVariantNumeric: "tabular-nums",
                                                                    color: "var(--text-primary)",
                                                                }}
                                                            >
                                                                {b.total}
                                                            </span>
                                                            <div
                                                                style={{
                                                                    width: "100%",
                                                                    height: "64px",
                                                                    display: "flex",
                                                                    alignItems: "flex-end",
                                                                }}
                                                            >
                                                                <div
                                                                    style={
                                                                        {
                                                                            width: "100%",
                                                                            height: `${b.h ?? ""}`,
                                                                            minHeight: "2px",
                                                                            background: "var(--primary-blue)",
                                                                            borderRadius: "2px 2px 0 0",
                                                                        } as CSSProperties
                                                                    }
                                                                />
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize: "0.6875rem",
                                                                    color: "var(--text-muted)",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {b.cohorts}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </Fragment>
                                            ))}
                                        </tr>
                                        <tr>
                                            {(phcTable.cols ?? []).map((c: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <th
                                                        scope="col"
                                                        aria-sort={c.ariaSort}
                                                        style={
                                                            {
                                                                textAlign: `${c.align ?? ""}`,
                                                                fontSize: "0.75rem",
                                                                letterSpacing: "0.04em",
                                                                textTransform: "uppercase",
                                                                color: `${c.color ?? ""}`,
                                                                fontWeight: "700",
                                                                padding: "0.75rem 0.6rem",
                                                                borderBottom: "1px solid var(--border)",
                                                                background: "var(--gray-50)",
                                                                verticalAlign: "bottom",
                                                                minWidth: "64px",
                                                            } as CSSProperties
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={c.onSort}
                                                            style={{
                                                                background: "none",
                                                                border: "none",
                                                                padding: "0",
                                                                margin: "0",
                                                                font: "inherit",
                                                                color: "inherit",
                                                                letterSpacing: "inherit",
                                                                textTransform: "inherit",
                                                                textAlign: "inherit",
                                                                lineHeight: "1.25",
                                                                cursor: "pointer",
                                                                display: "inline-flex",
                                                                alignItems: "flex-end",
                                                                gap: "0.3rem",
                                                            }}
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
                                        {(phcTable.rows ?? []).map((r: any, $index: number) => (
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
                                                                padding: "0.55rem 0.6rem",
                                                                fontWeight: `${r.weight ?? ""}`,
                                                                lineHeight: "1.35",
                                                                minWidth: "220px",
                                                            } as CSSProperties
                                                        }
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "0.5rem",
                                                            }}
                                                        >
                                                            {r.hasSwatch ? (
                                                                <>
                                                                    <span
                                                                        style={
                                                                            {
                                                                                width: "10px",
                                                                                height: "10px",
                                                                                borderRadius: "2px",
                                                                                flex: "none",
                                                                                background: `${r.swatch ?? ""}`,
                                                                            } as CSSProperties
                                                                        }
                                                                    />
                                                                </>
                                                            ) : null}
                                                            {r.hasHref ? (
                                                                <>
                                                                    <A
                                                                        className="hv3"
                                                                        href={r.href}
                                                                        target="_blank"
                                                                        rel="noopener"
                                                                        style={
                                                                            {
                                                                                color: `${r.color ?? ""}`,
                                                                                textDecoration: "none",
                                                                            } as CSSProperties
                                                                        }
                                                                    >
                                                                        {r.name}
                                                                    </A>
                                                                </>
                                                            ) : null}
                                                            {r.noHref ? (
                                                                <>
                                                                    <span
                                                                        style={
                                                                            {
                                                                                color: `${r.color ?? ""}`,
                                                                            } as CSSProperties
                                                                        }
                                                                    >
                                                                        {r.name}
                                                                    </span>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </th>
                                                    {(r.cells ?? []).map((c: any, $index: number) => (
                                                        <Fragment key={$index}>
                                                            <td
                                                                style={
                                                                    {
                                                                        textAlign: `${c.align ?? ""}`,
                                                                        padding: "0.55rem 0.6rem",
                                                                        color: `${c.color ?? ""}`,
                                                                        fontWeight: `${c.weight ?? ""}`,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                        background: `${c.bg ?? ""}`,
                                                                        borderLeft: "2px solid var(--surface)",
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
                                        {phcTable.empty ? (
                                            <>
                                                <tr>
                                                    <td
                                                        colSpan={phcTable.ncols}
                                                        style={{
                                                            padding: "2rem 1rem",
                                                            textAlign: "center",
                                                            color: "var(--text-secondary)",
                                                        }}
                                                    >
                                                        No rows match “{phcTable.q}”.
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
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem 1.25rem",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span>Subject counts · — no harmonized data</span>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                                        Fewer
                                        <span style={{ display: "inline-flex" }}>
                                            <span
                                                style={{
                                                    width: "18px",
                                                    height: "12px",
                                                    background: "color-mix(in oklch, var(--primary-blue) 10%, white)",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    width: "18px",
                                                    height: "12px",
                                                    background: "color-mix(in oklch, var(--primary-blue) 30%, white)",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    width: "18px",
                                                    height: "12px",
                                                    background: "color-mix(in oklch, var(--primary-blue) 55%, white)",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    width: "18px",
                                                    height: "12px",
                                                    background: "color-mix(in oklch, var(--primary-blue) 80%, white)",
                                                }}
                                            />
                                        </span>
                                        More subjects
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            </main>
        </>
    );
}
