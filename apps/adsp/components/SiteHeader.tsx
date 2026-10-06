"use client";
import { usePathname } from "next/navigation";
import { ADSP_DATA } from "@/lib/data";
import { A } from "./A";
import { Navigation } from "./ds";

const NAV = [
    ["/", "Home"],
    ["/releases", "Sequencing Rounds"],
    ["/methods", "Pipelines & Methods"],
    ["/phenotypes", "Phenotypes"],
    ["/access", "Access"],
    ["/submit", "Submit Data"],
    ["/about", "About"],
] as const;

const topLink = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0 1rem",
    color: "#ffffff",
    fontSize: "0.8125rem",
    fontWeight: 600,
    textDecoration: "none",
    whiteSpace: "nowrap",
    borderLeft: "1px solid rgba(255,255,255,0.15)",
} as const;
const topTag = {
    fontSize: "0.625rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--niagads-gold)",
} as const;

export function SiteHeader() {
    const path = usePathname() || "/";
    const L = ADSP_DATA.links;
    const isCurrent = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

    const brand = {
        href: "/",
        logo: (
            <span style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <img src="/assets/NIAGADS-one_color_blue.svg" alt="NIAGADS" style={{ height: 26, display: "block" }} />
                <span aria-hidden="true" style={{ width: 1, height: 28, background: "var(--border-hover)" }} />
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span
                        style={{
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            color: "var(--niagads-dark-blue)",
                            letterSpacing: "-0.01em",
                            whiteSpace: "nowrap",
                        }}
                    >
                        ADSP Data
                    </span>
                    <span
                        style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        NG00067 resource guide
                    </span>
                </span>
            </span>
        ),
    };

    return (
        <>
            <div style={{ background: "var(--niagads-dark-blue)" }}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "0 2rem",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem 1.5rem",
                        flexWrap: "wrap",
                        minHeight: 38,
                    }}
                >
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-300)", letterSpacing: "0.02em" }}>
                        Access ADSP data through NIAGADS
                    </span>
                    <div style={{ display: "flex", alignItems: "stretch", alignSelf: "stretch" }}>
                        <a
                            className="hv1"
                            href={L.ng00067}
                            target="_blank"
                            rel="noopener"
                            title="NG00067 on NIAGADS DSS"
                            style={topLink}
                        >
                            <span style={topTag}>DSS</span>Request &amp; download NG00067 ↗
                        </a>
                        <a
                            className="hv1"
                            href={L.gen3}
                            target="_blank"
                            rel="noopener"
                            title="NIAGADS Gen3 Discovery Portal"
                            style={{ ...topLink, borderRight: "1px solid rgba(255,255,255,0.15)" }}
                        >
                            <span style={topTag}>GEN3</span>Explore &amp; query data ↗
                        </a>
                    </div>
                </div>
            </div>
            <Navigation brand={brand}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "nowrap",
                        justifyContent: "flex-end",
                        minWidth: 0,
                    }}
                >
                    <nav
                        aria-label="Primary"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem 1rem",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                            minWidth: 0,
                        }}
                    >
                        {NAV.map(([href, label]) => {
                            const on = isCurrent(href);
                            return (
                                <A
                                    key={href}
                                    href={href}
                                    aria-current={on ? "page" : undefined}
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: 500,
                                        textDecoration: "none",
                                        padding: "0.35rem 0",
                                        borderBottom: `2px solid ${on ? "var(--niagads-gold)" : "transparent"}`,
                                        color: on ? "var(--primary-blue)" : "var(--text-secondary)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label}
                                </A>
                            );
                        })}
                    </nav>
                </div>
            </Navigation>
        </>
    );
}
