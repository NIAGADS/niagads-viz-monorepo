"use client";

import Link from "next/link";
import { CSSProperties, useState } from "react";
import { Production } from "./Production";
import { useSiteVals } from "@/lib/useSiteVals";
import { Released } from "./Released";

export const SequencingRoundsPage = () => {
    const [activeView, setActiveView] = useState<(typeof viewTabs)[number]["id"]>("released");
    const viewTabs = [
        {
            id: "released",
            label: "Released Rounds",
        },
        {
            id: "production",
            label: "In Production",
        },
    ] as const;

    const { glanceCohorts } = useSiteVals({ page: "releases" });

    const cohortsDssHref = "https://dss.niagads.org/adsp-cohort-information/";

    return (
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
            <h1 style={{ fontSize: "2.25rem", fontWeight: "700", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
                ADSP Sequencing Rounds
            </h1>
            <p
                style={{
                    fontSize: "1.0625rem",
                    color: "var(--text-secondary)",
                    margin: "0 0 1.5rem",
                    maxWidth: "74ch",
                }}
            >
                Explore released ADSP sequencing data and follow rounds currently in production.
            </p>
            <p
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.5rem 1rem",
                    flexWrap: "wrap",
                    fontSize: "0.9375rem",
                    margin: "-0.75rem 0 1.5rem",
                }}
            >
                <span>
                    <strong style={{ fontSize: "1.125rem", fontVariantNumeric: "tabular-nums" }}>
                        {glanceCohorts.value}
                    </strong>{" "}
                    <span style={{ color: "var(--text-secondary)" }}>cohorts contribute participants to ADSP</span>
                </span>
                <Link href={cohortsDssHref} target="_blank" rel="noopener" style={{ fontWeight: "700" }}>
                    Browse ADSP cohorts on DSS ↗
                </Link>
            </p>
            <nav
                aria-label="Sequencing rounds view"
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "2rem",
                }}
            >
                {(viewTabs ?? []).map((t, $index: number) => (
                    <div
                        key={$index}
                        className="hv4"
                        onClick={() => setActiveView(t.id)}
                        style={
                            {
                                textDecoration: "none",
                                flex: "0 0 auto",
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "0.55rem 1.1rem",
                                borderRadius: "999px",
                                fontSize: "0.9375rem",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                background: `${activeView === t.id ? "var(--primary-blue)" : "var(--surface)"}`,
                                border: `1px solid ${activeView === t.id ? "var(--primary-blue)" : "var(--border)"}`,
                                color: `${activeView === t.id ? "#ffffff" : "var(--text-primary)"}`,
                                cursor: "pointer",
                            } as CSSProperties
                        }
                    >
                        {t.label}
                    </div>
                ))}
            </nav>
            {activeView === "released" ? <Released /> : activeView === "production" ? <Production /> : <div></div>}
        </main>
    );
};
