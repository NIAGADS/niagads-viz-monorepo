"use client";
import { Fragment, useState } from "react";
import type { CSSProperties } from "react";
import { Select } from "@/components/ds";
import { Button, Card } from "@niagads/ui";
import Link from "next/link";

export function AccessPage() {
    const [visibleSection, setVisibleSection] = useState("overview");
    const sideItems = [
        {
            display: "Overview",
            id: "overview",
        },
        {
            display: "How to Apply",
            id: "howTo",
        },
        {
            display: "DSS & Gen3",
            id: "gen3",
        },
    ];

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
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        marginBottom: "0.5rem",
                    }}
                >
                    <h1 style={{ fontSize: "2.25rem", fontWeight: "700", margin: "0", letterSpacing: "-0.02em" }}>
                        Access ADSP Data
                    </h1>
                </div>
                <p
                    style={{
                        fontSize: "1.0625rem",
                        color: "var(--text-secondary)",
                        margin: "0 0 2rem",
                        maxWidth: "74ch",
                    }}
                >
                    ADSP controlled-access data are distributed through the{" "}
                    <strong>ADSP Umbrella dataset, NG00067</strong>. Full application guidance is in the NIAGADS
                    documentation.
                </p>
                <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    <nav aria-label="Access sections" style={{ flex: "0 0 230px", position: "sticky", top: "1.5rem" }}>
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
                            {(sideItems ?? []).map((s: any, $index: number) => (
                                <li key={$index}>
                                    <span
                                        className="hv5"
                                        aria-current={s.current}
                                        style={
                                            {
                                                display: "block",
                                                marginLeft: "-1px",
                                                padding: "0.6rem 1rem",
                                                borderLeft: `3px solid ${s.bl ?? ""}`,
                                                background: `${s.bg ?? ""}`,
                                                color: `${s.fg ?? ""}`,
                                                fontWeight: `${s.fw ?? ""}`,
                                                fontSize: "0.9375rem",
                                                textDecoration: "none",
                                            } as CSSProperties
                                        }
                                        onClick={() => setVisibleSection(s.id)}
                                    >
                                        {s.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div
                        style={{
                            flex: "1 1 520px",
                            minWidth: "0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                        }}
                    >
                        {visibleSection === "overview" ? (
                            <>
                                <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <Card>
                                        {" "}
                                        {/*style3*/}
                                        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0 0 0.75rem" }}>
                                            What do I apply for?
                                        </h2>
                                        <p
                                            style={{
                                                fontSize: "1rem",
                                                lineHeight: "1.65",
                                                margin: "0",
                                                maxWidth: "72ch",
                                                textWrap: "pretty",
                                            }}
                                        >
                                            Researchers apply for <strong>NG00067</strong>, the ADSP Umbrella dataset. A
                                            separate application is not required for each sequencing round. Access to
                                            individual data is governed by the investigator’s approved
                                            authorization/data-use terms.
                                        </p>
                                    </Card>
                                    <Card>
                                        {" "}
                                        {/*style3*/}
                                        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0 0 0.9rem" }}>
                                            What does NG00067 include?
                                        </h2>
                                        <ul
                                            style={{
                                                margin: "0",
                                                paddingLeft: "1.25rem",
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                                gap: "0.5rem 2rem",
                                                fontSize: "0.9375rem",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {(access.includes ?? []).map((i: any, $index: number) => (
                                                <Fragment key={$index}>
                                                    <li>{i}</li>
                                                </Fragment>
                                            ))}
                                        </ul>
                                        <p
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "var(--text-secondary)",
                                                margin: "1rem 0 0",
                                            }}
                                        >
                                            See what each round contains in{" "}
                                            <Link href="/releases">Sequencing Rounds</Link>.
                                        </p>
                                    </Card>
                                </section>
                            </>
                        ) : visibleSection === "howTo" ? (
                            <>
                                <Card>
                                    {" "}
                                    {/*style3*/}
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0 0 1.25rem" }}>
                                        How do I apply?
                                    </h2>
                                    <ol
                                        style={{
                                            listStyle: "none",
                                            margin: "0 0 1.5rem",
                                            padding: "0",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.9rem",
                                        }}
                                    >
                                        {(accessSteps ?? []).map((s: any, $index: number) => (
                                            <Fragment key={$index}>
                                                <li style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
                                                    <span
                                                        style={{
                                                            flex: "0 0 2rem",
                                                            height: "2rem",
                                                            borderRadius: "50%",
                                                            background: "var(--primary-blue)",
                                                            color: "#fff",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "700",
                                                            fontSize: "0.875rem",
                                                        }}
                                                    >
                                                        {s.n}
                                                    </span>{" "}
                                                    <span style={{ fontSize: "0.9375rem", fontWeight: "500" }}>
                                                        {s.label}
                                                    </span>
                                                </li>
                                            </Fragment>
                                        ))}
                                    </ol>
                                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                        <Button color="primary" href={links.ng00067} target="_blank">
                                            Review NG00067 ↗
                                        </Button>
                                        <Button href={guideHref} disabled={guideDisabled} target="_blank">
                                            {guideLabel}
                                        </Button>
                                    </div>
                                </Card>
                            </>
                        ) : visibleSection === "gen3" ? (
                            <>
                                <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <h2 style={{ fontSize: "1.375rem", fontWeight: "700", margin: "0" }}>
                                        DSS &amp; Gen3
                                    </h2>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                                            gap: "1.25rem",
                                        }}
                                    >
                                        <Card>
                                            {" "}
                                            {/*cardStyle6*/}
                                            <div
                                                style={{
                                                    fontSize: "0.6875rem",
                                                    letterSpacing: "0.08em",
                                                    fontWeight: "700",
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                RECORD · REQUEST · DOWNLOAD
                                            </div>
                                            <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                                NIAGADS DSS / NG00067
                                            </h3>
                                            <ul
                                                style={{
                                                    margin: "0",
                                                    paddingLeft: "1.2rem",
                                                    fontSize: "0.9375rem",
                                                    lineHeight: "1.7",
                                                    flex: "1",
                                                }}
                                            >
                                                <li>Dataset record</li>
                                                <li>Access request</li>
                                                <li>Release / fileset information</li>
                                                <li>Files and data distribution</li>
                                                <li>Supporting documentation and metadata</li>
                                            </ul>
                                            <div>
                                                <Button color="primary" href={links.ng00067} target="_blank">
                                                    Open NG00067 ↗
                                                </Button>
                                            </div>
                                        </Card>
                                        <Card>
                                            {" "}
                                            {/*cardStyle6*/}
                                            <div
                                                style={{
                                                    fontSize: "0.6875rem",
                                                    letterSpacing: "0.08em",
                                                    fontWeight: "700",
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                INTERACTIVE DISCOVERY
                                            </div>
                                            <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0" }}>
                                                NIAGADS Gen3 Discovery Portal
                                            </h3>
                                            <ul
                                                style={{
                                                    margin: "0",
                                                    paddingLeft: "1.2rem",
                                                    fontSize: "0.9375rem",
                                                    lineHeight: "1.7",
                                                    flex: "1",
                                                }}
                                            >
                                                <li>Subjects</li>
                                                <li>Phenotypes</li>
                                                <li>Cohorts</li>
                                                <li>Available files and data</li>
                                            </ul>
                                            <div>
                                                <Link href={gen3Href} target="_blank">
                                                    <Button disabled={gen3Disabled}>{gen3Label}</Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        {" "}
                                        {/*cardStyle2*/}
                                        <div
                                            style={{
                                                padding: "1.25rem 1.5rem",
                                                borderBottom: "1px solid var(--border)",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize: "1.125rem",
                                                    fontWeight: "700",
                                                    margin: "0 0 0.25rem",
                                                }}
                                            >
                                                What you see in Gen3 depends on your authorization
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: "0.875rem",
                                                    color: "var(--text-secondary)",
                                                    margin: "0",
                                                }}
                                            >
                                                All users sign in through NIH RAS.
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "1.25rem 1.5rem",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "0.6rem",
                                                }}
                                            >
                                                <span style={{ fontSize: "0.9375rem", fontWeight: "700" }}>
                                                    Without approved ADSP access
                                                </span>
                                                <ul
                                                    style={{
                                                        margin: "0",
                                                        padding: "0",
                                                        listStyle: "none",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "0.45rem",
                                                        fontSize: "0.9375rem",
                                                    }}
                                                >
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--success-green)", fontWeight: "700" }}
                                                        >
                                                            ✓
                                                        </span>
                                                        Explore privacy-protected summary information
                                                    </li>
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--text-muted)", fontWeight: "700" }}
                                                        >
                                                            ✕
                                                        </span>
                                                        Filter down to small protected cell sizes
                                                    </li>
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--text-muted)", fontWeight: "700" }}
                                                        >
                                                            ✕
                                                        </span>
                                                        See subject- or sample-level records
                                                    </li>
                                                </ul>
                                            </div>
                                            <div
                                                style={{
                                                    padding: "1.25rem 1.5rem",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "0.6rem",
                                                    background: "var(--gray-50)",
                                                    borderLeft: "1px solid var(--border)",
                                                }}
                                            >
                                                <span style={{ fontSize: "0.9375rem", fontWeight: "700" }}>
                                                    Approved for ADSP / NG00067
                                                </span>
                                                <ul
                                                    style={{
                                                        margin: "0",
                                                        padding: "0",
                                                        listStyle: "none",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "0.45rem",
                                                        fontSize: "0.9375rem",
                                                    }}
                                                >
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--success-green)", fontWeight: "700" }}
                                                        >
                                                            ✓
                                                        </span>
                                                        Explore detailed information under your authorization
                                                    </li>
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--success-green)", fontWeight: "700" }}
                                                        >
                                                            ✓
                                                        </span>
                                                        See subject- and sample-level information
                                                    </li>
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--success-green)", fontWeight: "700" }}
                                                        >
                                                            ✓
                                                        </span>
                                                        Explore and filter available files
                                                    </li>
                                                    <li style={{ display: "flex", gap: "0.5rem" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{ color: "var(--success-green)", fontWeight: "700" }}
                                                        >
                                                            ✓
                                                        </span>
                                                        Use applicable phenotype / manifest functionality
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                </section>
                            </>
                        ) : null}
                    </div>
                </div>
            </main>
        </>
    );
}
