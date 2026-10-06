"use client";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { A } from "@/components/A";
import { Card } from "@/components/ds";
import { useSiteVals } from "@/lib/useSiteVals";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function MethodsPage() {
  const { cardStyle1, cardStyle2, cardStyle3, dgNav, isWide } = useSiteVals({ page: "datagen" });
  return (
    <>
      <main style={{ flex: "1", maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem 4rem", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "700", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>ADSP Sequencing Pipelines &amp; Methods</h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", margin: "0", maxWidth: "74ch" }}>
            Learn how ADSP sequencing data are processed, quality assessed, jointly called, and prepared for release, and how the pipelines and methods have evolved across sequencing rounds.
          </p>
        </div>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>
          {isWide ? (
            <>
              <nav aria-label="On this page" style={{ flex: "0 0 210px", position: "sticky", top: "1.5rem" }}>
                <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border)" }}>
                  {(dgNav ?? []).map((n: any, $index: number) => (
                    <Fragment key={$index}>
                      <li>
                        <A className="hv5" href="/methods" onClick={n.onClick} style={{ display: "block", marginLeft: "-1px", padding: "0.6rem 1rem", borderLeft: `3px solid ${n.bl ?? ""}`, color: `${n.fg ?? ""}`, fontWeight: `${n.fw ?? ""}`, fontSize: "0.9375rem", textDecoration: "none" } as CSSProperties}>{n.label}</A>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </nav>
            </>
          ) : null}
          <div style={{ flex: "1 1 520px", minWidth: "0", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <section id="dg-core" style={{ scrollMarginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: "700", margin: "0" }}>Core Workflow</h2>
                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><span style={{ width: "28px", height: "14px", borderRadius: "999px", background: "var(--primary-blue)" }} />Action / process</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><span style={{ width: "28px", height: "14px", borderRadius: "3px", border: "1.5px solid var(--niagads-dark-blue)", boxSizing: "border-box" }} />Data product</span>
                </div>
              </div>
              <p style={{ fontSize: "0.9375rem", lineHeight: "1.6", color: "var(--text-secondary)", margin: "0", maxWidth: "74ch", textWrap: "pretty" }}>Every sample is aligned and processed into a CRAM. From there, SNVs/indels and structural variants follow separate calling paths.&nbsp;</p>
              <Card {...cardStyle1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "820px", margin: "0 auto" }}>
                  <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "var(--border-radius)", background: "var(--gray-100)", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "600", textAlign: "center" }}>Sequencing data</div>
                  <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                  <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", alignItems: "stretch", justifyContent: "center" }}>
                    <div style={{ flex: "1 1 280px", maxWidth: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "999px", background: "var(--primary-blue)", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: "600" }}>Alignment &amp; processing</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "500" }}>VCPA1.1</span>
                      </div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", border: "1.5px solid var(--niagads-dark-blue)", borderRadius: "3px", background: "var(--surface)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: "700", color: "var(--niagads-dark-blue)" }}>CRAM</div>
                    </div>
                    <div style={{ flex: "1 1 260px", maxWidth: "360px", display: "flex", alignItems: "stretch", gap: "0.75rem" }}>
                      <div aria-hidden="true" style={{ width: "10px", border: "1.5px solid var(--niagads-gold)", borderRight: "none", borderRadius: "6px 0 0 6px" }} />
                      <div style={{ flex: "1", padding: "0.9rem 1rem", background: "var(--gray-50)", borderRadius: "var(--border-radius)", alignSelf: "center" }}>
                        <div style={{ fontSize: "0.6875rem", fontWeight: "700", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>SAMPLE-LEVEL QA</div>
                        <ul style={{ margin: "0 0 0.6rem", paddingLeft: "1.1rem", fontSize: "0.875rem", lineHeight: "1.7" }}>
                          <li>Sequencing quality</li>
                          <li>Sex check</li>
                          <li>Array concordance</li>
                          <li>Contamination</li>
                          <li>Unexpected duplicates / relatedness</li>
                        </ul>
                        <p style={{ fontSize: "0.8125rem", lineHeight: "1.5", color: "var(--text-muted)", margin: "0" }}>Runs during individual-level processing and joint genotype calling.</p>
                      </div>
                    </div>
                  </div>
                  <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                  <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", alignItems: "stretch", justifyContent: "center" }}>
                    <div style={{ flex: "1 1 200px", minWidth: "0", maxWidth: "360px", display: "flex", flexDirection: "column", alignItems: "center", padding: "0.75rem", border: "1px dashed var(--border-hover)", borderRadius: "var(--border-radius)", background: "var(--gray-50)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center", minHeight: "24px" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: "700", letterSpacing: "0.1em", color: "var(--text-muted)", whiteSpace: "nowrap", lineHeight: "1.4" }}>SNV / INDEL</span>
                      </div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "999px", background: "var(--primary-blue)", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: "600" }}>Individual variant calling</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "500" }}>GATK HaplotypeCaller</span>
                      </div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", border: "1.5px solid var(--niagads-dark-blue)", borderRadius: "3px", background: "var(--surface)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: "700", color: "var(--niagads-dark-blue)" }}>gVCF</div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "999px", background: "var(--primary-blue)", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: "600" }}>Joint calling</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "500" }}>GATK · GLnexus from R5</span>
                      </div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", border: "1.5px solid var(--niagads-dark-blue)", borderRadius: "3px", background: "var(--surface)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: "700", color: "var(--niagads-dark-blue)" }}>pVCF</div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "999px", background: "var(--primary-blue)", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: "600" }}>ADSP QC</span>
                      </div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", border: "1.5px solid var(--niagads-dark-blue)", borderRadius: "3px", background: "var(--surface)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: "700", color: "var(--niagads-dark-blue)" }}>QC'd pVCF</div>
                    </div>
                    <div style={{ flex: "1 1 200px", minWidth: "0", maxWidth: "360px", display: "flex", flexDirection: "column", alignItems: "center", padding: "0.75rem", border: "1px dashed var(--border-hover)", borderRadius: "var(--border-radius)", background: "var(--gray-50)", width: "255px", height: "391px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center", minHeight: "24px" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: "700", letterSpacing: "0.1em", color: "var(--text-muted)", whiteSpace: "nowrap", lineHeight: "1.4" }}>STRUCTURAL VARIANTS</span>
                      </div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "999px", background: "var(--primary-blue)", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: "600" }}>Individual SV calling</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "500" }}>Manta + Smoove</span>
                      </div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", border: "1.5px solid var(--niagads-dark-blue)", borderRadius: "3px", background: "var(--surface)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: "700", color: "var(--niagads-dark-blue)" }}>Individual SV VCFs</div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "999px", background: "var(--primary-blue)", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.9375rem", fontWeight: "600" }}>Joint SV genotyping</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "500" }}>GraphTyper</span>
                      </div>
                      <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                      <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", border: "1.5px solid var(--niagads-dark-blue)", borderRadius: "3px", background: "var(--surface)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: "700", color: "var(--niagads-dark-blue)" }}>Project-level SV callset</div>
                    </div>
                  </div>
                  <div aria-hidden="true" style={{ color: "var(--gray-400)", lineHeight: "1", padding: "0.3rem 0" }}>↓</div>
                  <div style={{ boxSizing: "border-box", width: "100%", maxWidth: "300px", padding: "0.55rem 1rem", borderRadius: "var(--border-radius)", background: "var(--gray-100)", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "600", textAlign: "center" }}>Release</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "2rem 0 0", paddingTop: "1.25rem", borderTop: "1px solid var(--gray-100)" }}>
                  <p style={{ fontSize: "0.8125rem", lineHeight: "1.5", color: "var(--text-muted)", margin: "0", maxWidth: "74ch", textWrap: "pretty" }}>R3 also has a separate BioGraph SV callset (BioGraph 6.0, processed with Truvari v2.1.1), distinct from the standard SV workflow above.</p>
                </div>
              </Card>
            </section>
            <section id="dg-evolution" style={{ scrollMarginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: "700", margin: "0" }}>How Methods Have Evolved</h2>
              <p style={{ fontSize: "0.9375rem", lineHeight: "1.6", color: "var(--text-secondary)", margin: "0", maxWidth: "74ch", textWrap: "pretty" }}>
                The major methodological changes across released rounds are summarized below. Relevant methods and data-release publications provide additional technical detail.
              </p>
              <Card {...cardStyle2}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: "720px", fontSize: "0.875rem" }}>
                    <thead>
                      <tr>
                        <th scope="col" style={{ textAlign: "left", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--gray-50)" }}>Round</th>
                        <th scope="col" style={{ textAlign: "left", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--gray-50)" }}>Assay</th>
                        <th scope="col" style={{ textAlign: "left", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--gray-50)" }}>Individual processing</th>
                        <th scope="col" style={{ textAlign: "left", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--gray-50)" }}>Joint calling</th>
                        <th scope="col" style={{ textAlign: "left", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--gray-50)" }}>Key change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <th scope="row" style={{ textAlign: "left", padding: "0.7rem 1rem", verticalAlign: "top", fontWeight: "700", whiteSpace: "nowrap" }}>R1 · 5K</th>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>WGS</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>VCPA 1.0 · GATK HC 3.7</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>GATK</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top", color: "var(--text-secondary)" }}>Initial GRCh38 workflow</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <th scope="row" style={{ textAlign: "left", padding: "0.7rem 1rem", verticalAlign: "top", fontWeight: "700", whiteSpace: "nowrap" }}>R2 · 20K</th>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>WES</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>VCPA 1.1 · GATK HC 4.1.1</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>GATK</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top", color: "var(--text-secondary)" }}>WES-specific QC</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <th scope="row" style={{ textAlign: "left", padding: "0.7rem 1rem", verticalAlign: "top", fontWeight: "700", whiteSpace: "nowrap" }}>R3 · 17K</th>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>WGS</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>VCPA 1.1 · GATK HC 4.1.1</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>GATK GenotypeGVCFs 4.1.1</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top", color: "var(--text-secondary)" }}>SV products introduced</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <th scope="row" style={{ textAlign: "left", padding: "0.7rem 1rem", verticalAlign: "top", fontWeight: "700", whiteSpace: "nowrap" }}>R4 · 36K</th>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>WGS</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>VCPA 1.1 · GATK HC 4.1.1</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>GATK GenotypeGVCFs 4.1.1</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top", color: "var(--text-secondary)" }}>Expanded WGS / derived resources</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <th scope="row" style={{ textAlign: "left", padding: "0.7rem 1rem", verticalAlign: "top", fontWeight: "700", whiteSpace: "nowrap" }}>R5 · 58K</th>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>WGS</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>VCPA 1.1 · GATK HC 4.1.1</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top" }}>GLnexus 1.4.5</td>
                        <td style={{ padding: "0.7rem 1rem", verticalAlign: "top", color: "var(--text-secondary)" }}>Updated ADSP QC</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
            <section id="dg-derived" style={{ scrollMarginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: "700", margin: "0" }}>Downstream &amp; Derived Resources</h2>
              <p style={{ fontSize: "0.9375rem", lineHeight: "1.6", color: "var(--text-secondary)", margin: "0", maxWidth: "74ch", textWrap: "pretty" }}>Additional resources have been generated from selected ADSP sequencing rounds to support downstream analysis.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: "0.75rem" }}>
                <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: "var(--border-radius)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--primary-blue)" }}>Functional Annotation</span>
                  <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)", textWrap: "pretty" }}>
                    Variant consequence and functional annotation resources generated for selected sequencing rounds. See{" "}
                    <A href="/releases">Sequencing Rounds</A>
                    {" "}for availability.
                  </span>
                </div>
                <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: "var(--border-radius)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--primary-blue)" }}>GDS</span>
                  <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)", textWrap: "pretty" }}>Alternate representation of selected project-level variant and annotation data.</span>
                </div>
                <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: "var(--border-radius)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--primary-blue)" }}>LD Reference Panels</span>
                  <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)", textWrap: "pretty" }}>Release-specific linkage disequilibrium resources.</span>
                </div>
                <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: "var(--border-radius)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--primary-blue)" }}>Imputation Panels</span>
                  <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)", textWrap: "pretty" }}>Reference panels for genotype imputation.</span>
                </div>
                <div style={{ padding: "1rem 1.1rem", border: "1px solid var(--border)", borderRadius: "var(--border-radius)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--primary-blue)" }}>Principal Components</span>
                  <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)", textWrap: "pretty" }}>Analysis resources generated for selected rounds.</span>
                </div>
              </div>
            </section>
            <section id="dg-code" style={{ scrollMarginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: "700", margin: "0" }}>Code, Methods &amp; Publications</h2>
              <p style={{ fontSize: "0.9375rem", lineHeight: "1.6", color: "var(--text-secondary)", margin: "0", maxWidth: "74ch" }}>
                Code and methods publications for the workflows above. Data-release papers are listed under{" "}
                <A href="/releases">Sequencing Rounds → Related Publications</A>
                .
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "1.25rem", alignItems: "start" }}>
                <Card {...cardStyle3}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: "700", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>ADSP / GCAD WORKFLOWS &amp; CODE</div>
                  <ul style={{ listStyle: "none", margin: "0 0 -0.85rem", padding: "0" }}>
                    <li style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.85rem 0", borderTop: "1px solid var(--gray-100)" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: "700" }}>VCPA</span>
                      {" "}
                      <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)" }}>
                        ADSP/GCAD pipeline used for individual-level processing. Leung et al.,{" "}
                        <em>VCPA: genomic variant calling pipeline and data management tool for Alzheimer's Disease Sequencing Project</em>
                        , Bioinformatics.
                      </span>
                      {" "}
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8125rem" }}>
                        <A href="http://www.niagads.org/VCPA" target="_blank" rel="noopener" style={{ fontWeight: "600", textDecoration: "none" }}>niagads.org/VCPA ↗</A>
                        <A href="https://pubmed.ncbi.nlm.nih.gov/30351394/" target="_blank" rel="noopener" style={{ fontWeight: "600", textDecoration: "none" }}>PMID 30351394 ↗</A>
                      </div>
                    </li>
                    <li style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.85rem 0", borderTop: "1px solid var(--gray-100)" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: "700" }}>ADSP Variant QC</span>
                      {" "}
                      <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)" }}>
                        Naj AC, Lin H, Vardarajan BN, et al.{" "}
                        <em>Quality control and integration of genotypes from two calling pipelines for whole genome sequence data in the Alzheimer's disease sequencing project.</em>
                        {" "}Genomics. 2019;111(4):808–818.
                      </span>
                      {" "}
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8125rem" }}>
                        <A href="https://bitbucket.org/Taha_Iqbal_UPenn/gcad-vcf-qc_public/src/master/" target="_blank" rel="noopener" style={{ fontWeight: "600", textDecoration: "none" }}>gcad-vcf-qc_public (R5) ↗</A>
                        <A href="https://pubmed.ncbi.nlm.nih.gov/29857119/" target="_blank" rel="noopener" style={{ fontWeight: "600", textDecoration: "none" }}>PMID 29857119 ↗</A>
                      </div>
                    </li>
                    <li style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.85rem 0", borderTop: "1px solid var(--gray-100)" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: "700" }}>Compact VCF processing</span>
                      {" "}
                      <span style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "var(--text-secondary)" }}>Compact VCF processing code used for R3 and R4.</span>
                      {" "}
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8125rem" }}>
                        <A href="https://bitbucket.org/NIAGADS/compact_vcf/src/master/" target="_blank" rel="noopener" style={{ fontWeight: "600", textDecoration: "none" }}>compact_vcf ↗</A>
                      </div>
                    </li>
                  </ul>
                </Card>
                <Card {...cardStyle3}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: "700", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>ANNOTATION METHODS · R4</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", fontSize: "0.875rem", lineHeight: "1.6" }}>
                    <div>
                      <strong>Base Functional Annotation</strong>
                      <br />
                      Ensembl VEP 103
                      <br />
                      CADD 1.6
                      <br />
                      SnpEff 5.1d
                    </div>
                    <div>
                      <strong>FAVOR Annotation</strong>
                      <br />
                      FAVOR annotations
                      <br />
                      Spark dataframe processing
                      <br />
                      SeqArray conversion to GDS
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "1rem 0 0" }}>
                    Annotation products are not generated for every sequencing round. See{" "}
                    <A href="/releases">Sequencing Rounds</A>
                    {" "}for available resources.
                  </p>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
