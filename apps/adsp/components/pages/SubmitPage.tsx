"use client";
import { A } from "@/components/A";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function SubmitPage() {
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
                <h1 style={{ fontSize: "2.25rem", fontWeight: "700", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
                    Submit Sequencing Data to ADSP
                </h1>
                <p
                    style={{
                        fontSize: "1.0625rem",
                        lineHeight: "1.6",
                        color: "var(--text-secondary)",
                        margin: "0 0 1.25rem",
                        maxWidth: "74ch",
                        textWrap: "pretty",
                    }}
                >
                    Information for studies contributing sequencing data for integration with the ADSP data resource.
                    NIAGADS works with submitting investigators to coordinate data registration, identifier assignment,
                    supporting metadata, and secure data transfer.
                </p>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "0.5rem 0 0.25rem" }}>What to Provide</h2>
                <ul style={{ listStyle: "none", margin: "0", padding: "0", borderBottom: "1px solid var(--border)" }}>
                    <li style={{ padding: "1.5rem 0", borderTop: "1px solid var(--border)" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "1rem 2.5rem",
                                alignItems: "start",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <h3 style={{ fontSize: "1.1875rem", fontWeight: "700", margin: "0" }}>
                                    Register the Dataset
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    The following documents are required to deposit and share your data through NIAGADS:
                                </p>
                                <ul
                                    style={{
                                        margin: "0",
                                        paddingLeft: "1.2rem",
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.7",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <li>
                                        <A
                                            href="https://niagads.scrollhelp.site/support/documents#Institutional-Certification"
                                            target="_blank"
                                            rel="noopener"
                                            style={{ fontWeight: "600" }}
                                        >
                                            Institutional Certification for ADRD Studies
                                        </A>{" "}
                                        covering all subjects in your study. Multiple certifications may be required.
                                    </li>
                                    <li>
                                        Signed copy of the{" "}
                                        <A
                                            href="https://www.nia.nih.gov/sites/default/files/2017-06/revised-ADSP-sharing-plan-6-13-17.docx"
                                            target="_blank"
                                            rel="noopener"
                                            style={{ fontWeight: "600" }}
                                        >
                                            NIA AD Genomics Sharing Plan
                                        </A>
                                        .
                                    </li>
                                    <li>Completed Dataset Registration Template.</li>
                                </ul>
                            </div>
                            <ul
                                style={{
                                    listStyle: "none",
                                    margin: "0",
                                    padding: "0",
                                    borderBottom: "1px solid var(--gray-100)",
                                }}
                            >
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://niagads.scrollhelp.site/support/documents#Institutional-Certification"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        Institutional Certification documents ↗
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        Institutional Certification
                                    </span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://www.nia.nih.gov/sites/default/files/2017-06/revised-ADSP-sharing-plan-6-13-17.docx"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        revised-ADSP-sharing-plan-6-13-17.docx ↓
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        NIA AD Genomics Sharing Plan
                                    </span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://www.adgenomics.org/wp-content/uploads/2023/01/01_DSS_Dataset_Registration_Template.docx"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        01_DSS_Dataset_Registration_Template.docx ↓
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        Dataset Registration Template
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li style={{ padding: "1.5rem 0", borderTop: "1px solid var(--border)" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "1rem 2.5rem",
                                alignItems: "start",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <h3 style={{ fontSize: "1.1875rem", fontWeight: "700", margin: "0" }}>
                                    Obtain ADSP Identifiers
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    All sequenced subjects, and any non-sequenced connecting family members submitted
                                    for harmonization with ADSP data, are renamed to fit the ADSP UID schema. NIAGADS
                                    remaps all submitted data to the ADSP UID.
                                </p>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Follow the assignment instructions and enter sample information in the template.
                                </p>
                            </div>
                            <ul
                                style={{
                                    listStyle: "none",
                                    margin: "0",
                                    padding: "0",
                                    borderBottom: "1px solid var(--gray-100)",
                                }}
                            >
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://www.adgenomics.org/wp-content/uploads/2023/01/02_ADSPID_Assignment_Instructions.docx"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        02_ADSPID_Assignment_Instructions.docx ↓
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        Instructions
                                    </span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://www.adgenomics.org/wp-content/uploads/2023/01/02_SampleID_forADSPassign.xlsx"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        02_SampleID_forADSPassign_DS.xlsx ↓
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        Sample information template
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li style={{ padding: "1.5rem 0", borderTop: "1px solid var(--border)" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "1rem 2.5rem",
                                alignItems: "start",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <h3 style={{ fontSize: "1.1875rem", fontWeight: "700", margin: "0" }}>
                                    Submit Phenotype Information
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Provide phenotypes in the ADSP format. Use the data dictionary as a reference to
                                    reformat all phenotypes, and the template to submit them.
                                </p>
                            </div>
                            <ul
                                style={{
                                    listStyle: "none",
                                    margin: "0",
                                    padding: "0",
                                    borderBottom: "1px solid var(--gray-100)",
                                }}
                            >
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://www.adgenomics.org/wp-content/uploads/2023/01/03_ADSP_Phenotypes_Augmentation_DD.docx"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        03_ADSP_Phenotypes_Augmentation_DD.docx ↓
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        Data dictionary
                                    </span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.1rem",
                                        padding: "0.55rem 0",
                                        borderTop: "1px solid var(--gray-100)",
                                    }}
                                >
                                    <A
                                        href="https://www.adgenomics.org/wp-content/uploads/2023/01/03_ADSP_Phenotypes_Augmentation_DS.xlsx"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.8125rem",
                                            fontWeight: "600",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        03_ADSP_Phenotypes_Augmentation_DS.xlsx ↓
                                    </A>
                                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                        Phenotype template
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li style={{ padding: "1.5rem 0", borderTop: "1px solid var(--border)" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "1rem 2.5rem",
                                alignItems: "start",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <h3 style={{ fontSize: "1.1875rem", fontWeight: "700", margin: "0" }}>
                                    Array / Genotyping Data
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    If available, provide GWAS, exome-chip, or related array genotype data for all
                                    sequenced participants and relevant connecting family members. These data are used
                                    for sample-level quality assurance, including concordance and identity checks
                                    against the sequencing data.
                                </p>
                                <ul
                                    style={{
                                        margin: "0",
                                        paddingLeft: "1.2rem",
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.7",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <li>PLINK binary format</li>
                                    <li>Preferably on build hg38</li>
                                    <li>Formatted to the forward strand</li>
                                </ul>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Make sure the IDs in the array data can be mapped to the IDs used in the sequencing
                                    data.
                                </p>
                            </div>
                            <div />
                        </div>
                    </li>
                    <li style={{ padding: "1.5rem 0", borderTop: "1px solid var(--border)" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "1rem 2.5rem",
                                alignItems: "start",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <h3 style={{ fontSize: "1.1875rem", fontWeight: "700", margin: "0" }}>
                                    Transfer Sequencing Data
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Sequencing read data can be submitted in any of these formats:
                                </p>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <span
                                        style={{
                                            padding: "0.4rem 0.9rem",
                                            border: "1.5px solid var(--primary-blue)",
                                            borderRadius: "3px",
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.9375rem",
                                            fontWeight: "700",
                                            color: "var(--primary-blue)",
                                        }}
                                    >
                                        FASTQ
                                    </span>
                                    <span
                                        style={{
                                            padding: "0.4rem 0.9rem",
                                            border: "1.5px solid var(--primary-blue)",
                                            borderRadius: "3px",
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.9375rem",
                                            fontWeight: "700",
                                            color: "var(--primary-blue)",
                                        }}
                                    >
                                        BAM
                                    </span>
                                    <span
                                        style={{
                                            padding: "0.4rem 0.9rem",
                                            border: "1.5px solid var(--primary-blue)",
                                            borderRadius: "3px",
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.9375rem",
                                            fontWeight: "700",
                                            color: "var(--primary-blue)",
                                        }}
                                    >
                                        CRAM
                                    </span>
                                    <span
                                        style={{
                                            padding: "0.4rem 0.9rem",
                                            border: "1.5px solid var(--primary-blue)",
                                            borderRadius: "3px",
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.9375rem",
                                            fontWeight: "700",
                                            color: "var(--primary-blue)",
                                        }}
                                    >
                                        ORA
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    For every format, save{" "}
                                    <strong style={{ color: "var(--text-primary)" }}>all reads</strong>, including those
                                    that could not be mapped to the reference genome.
                                </p>
                            </div>
                            <div />
                        </div>
                    </li>
                    <li style={{ padding: "1.5rem 0", borderTop: "1px solid var(--border)" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "1rem 2.5rem",
                                alignItems: "start",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <h3 style={{ fontSize: "1.1875rem", fontWeight: "700", margin: "0" }}>
                                    Provide Sequencing Metadata &amp; QC Information
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Whatever your input format, include information about how the sequencing was
                                    performed:
                                </p>
                                <ul
                                    style={{
                                        margin: "0",
                                        paddingLeft: "1.2rem",
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.7",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <li>Sequencing Center</li>
                                    <li>Sequencer Machine</li>
                                    <li>Read Length</li>
                                    <li>PCR Free or PCR Amplified?</li>
                                    <li>Kit Name/Version</li>
                                    <li>Copy of the WES target regions, if applicable</li>
                                    <li>Sequencing Quality Control Metrics</li>
                                </ul>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.6",
                                        color: "var(--text-secondary)",
                                        margin: "0",
                                        maxWidth: "64ch",
                                        textWrap: "pretty",
                                    }}
                                >
                                    Also send the list of samples that will be transferred (
                                    <strong style={{ color: "var(--text-primary)" }}>sample manifest</strong>
                                    ).
                                </p>
                            </div>
                            <div />
                        </div>
                    </li>
                </ul>
                <section style={{ marginTop: "3rem", maxWidth: "560px" }}>
                    <div
                        style={{
                            padding: "1.5rem",
                            background: "var(--gray-50)",
                            borderTop: "4px solid var(--primary-blue)",
                            borderRadius: "var(--border-radius)",
                            alignSelf: "start",
                        }}
                    >
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0 0 0.5rem" }}>Questions?</h3>
                        <p
                            style={{
                                fontSize: "0.9375rem",
                                lineHeight: "1.6",
                                color: "var(--text-secondary)",
                                margin: "0 0 0.75rem",
                            }}
                        >
                            Questions about preparing or transferring an ADSP sequencing submission, the template forms,
                            or uploading issues?
                        </p>
                        <A href="mailto:NIAGADS@pennmedicine.upenn.edu" style={{ fontSize: "1rem", fontWeight: "700" }}>
                            NIAGADS@pennmedicine.upenn.edu
                        </A>
                    </div>
                </section>
            </main>
        </>
    );
}
