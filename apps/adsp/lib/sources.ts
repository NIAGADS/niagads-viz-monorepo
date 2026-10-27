/* Data-source manifest for developers — documents where each block of lib/data.ts comes from. Not rendered. */

export interface SourceEntry {
    handoff: string;
    feeds: string[];
    kind: "api" | "table" | "export" | "content";
    location: string;
    status: "needed" | "partial" | "confirmed";
    owner: string;
    [key: string]: unknown;
}

export const ADSP_SOURCES: Record<string, SourceEntry> = {
    datasetInfo: {
        handoff: "§3.2, §17B.1–2",
        feeds: ["glance.ng00067Version", "glance.cohorts", "links.releaseNotes"],
        kind: "api",
        location: "https://st1.niagads.org/portal/dataset_info/NG00067", // staging host — confirm production
        response: "{ data: [ { study_ID, study_name, version, coh_key, coh_name, … } ] }",
        fields: { version: "version", cohortId: "coh_key", cohortName: "coh_name" },
        rules: [
            "Cohort count = number of UNIQUE coh_key values, not rows (a cohort can appear under several studies).",
            "Version drives the release-notes URL: /portal/download-public/NG00067.v{version}/rn",
            "No total sample/participant metric on the homepage.",
        ],
        prototype:
            "The site tries this endpoint live on load and falls back to TBD (likely CORS-blocked in preview). Fetch server-side in Next.js.",
        owner: "TBD",
        status: "confirmed",
    },

    darStatistics: {
        handoff: "§3.2, §16.4",
        feeds: ["glance.approvedDars"],
        kind: "api",
        location: "https://st1.niagads.org/portal/v1/adars/NG00067", // staging host — confirm production
        response: "{ data: [ { dar_ID, approval_date, expiration_date, … } ] }",
        fields: { id: "dar_ID", approvedAt: "approval_date", expiresAt: "expiration_date" },
        rules: [
            "Prototype counts unique dar_ID with a non-empty approval_date.",
            "CONFIRM the definition: all-time approved vs currently active (not yet expired).",
        ],
        owner: "TBD",
        status: "partial",
    },

    productionStatus: {
        handoff: "§6, §16.3",
        feeds: ["releases[R6].currentActivities", "releases[R7].currentActivities", "r6", "r7"],
        kind: "api",
        location: "TBD — proposed: a Coda (Superhuman) doc table read via the Coda REST API",
        proposal: {
            how: "Server-side fetch of GET https://coda.io/apis/v1/docs/{docId}/tables/{tableId}/rows?useColumnNames=true with a read-only API token (env var, never sent to the browser); cache/revalidate every N minutes.",
            tables: {
                releaseActivities: ["release", "activity", "state", "note", "updated"],
                r7Batches: [
                    "project",
                    "batch",
                    "received",
                    "processed",
                    "qaChecks",
                    "phenotypesReceived",
                    "snpArrayReceived",
                    "updated",
                ],
            },
            stateValues: ["complete", "in_progress", "not_started"],
        },
        fields: {
            r7Stages: [
                "Received",
                "Processed (CRAMs, gVCFs, and SV VCF)",
                "QA Checks",
                "Phenotypes Received",
                "SNP Array Received",
            ],
        },
        rules: [
            "R6 joint calling and QC are CONCURRENT — never render as a sequence.",
            "R7 QA checks run as gVCFs are generated, not as one gate at the end.",
            "Status changes are made once here and flow to homepage + Releases.",
        ],
        owner: "TBD",
        status: "partial",
    },

    variantReleaseTable: {
        handoff: "§5.3, §16.2",
        feeds: ["variantProducts", "productTypes", "releaseFacts.*.samples", "processing", "methodsChanges"],
        kind: "table",
        location: "uploads/pVCFReleaseTable-1fc091a2.xlsx (pVCFReleaseTable.xlsx) — move to a maintained location",
        fields: {
            release: "Round",
            samples: "Samples",
            qcType: "QC Type",
            caller: "Joint Caller",
            chromosomes: "Chromosomes",
            variants: "Genomic Variants",
            filterType: "Filter Type*",
            filenamePattern: "File Name Example",
            fileset: "DSS Fileset Accession",
        },
        rules: [
            "Blank cells are read as merged-cell continuation of the row above (within a round). SV rows are neither Preview nor QC'd — shown as SV.",
            "Chromosome code 'A' = autosomes, shown as 1–22.",
            "Filter Type definitions supplied (ADSP_DATA.fileTypes).",
            "All Releases matrix is derived from this table.",
        ],
        owner: "TBD",
        status: "confirmed",
    },

    sampleTable: {
        handoff: "§5.1, §5.2, §16.1",
        feeds: ["sampleSets", "composition"],
        kind: "export",
        location: "uploads/sample_table-1790120353764-nyy5.xlsx (sample_list_ex.xlsx) — 79,006 rows",
        fields: {
            subjectIndex: "Index (subj)",
            cohort: "Cohort",
            study: "Study_DSS",
            sampleSet: "Sample_Set",
            assay: "SAMPLE_USE",
            roundFirstSeen: "First Round",
            sex: "Sex",
            race: "Race",
            ethnicity: "Ethnicity",
            diagnosis: "Diagnosis_harmonized",
            other: [
                "Age_harmonized",
                "other_diagnosis_flag",
                "AD",
                "Age",
                "Age_baseline",
                "APOE_reported",
                "APOE_WGS",
                "Consent",
            ],
        },
        gaps: [
            "No SampleID column — only a subject index. Needed to link to the Sample Manifest.",
            "Only FIRST round per sample. Release membership is DERIVED: WGS cumulative from First Round; R2 = all WES. Confirm no samples were dropped between rounds.",
            "Diagnosis_harmonized has case variants (AD_case/AD_Case, AD_control/AD_Control) — merged in the prototype, flagged for source fix.",
            "10,655 WES samples carry First Round = R1 while R1 is a WGS release — confirm meaning.",
            "Study/sample-set names come from the NG00067 DSS page (ADSP_DATA.dss). A lookup table or API would be better.",
        ],
        rules: [
            "Sample counts; never deduplicate by subject.",
            "Composition denominator = samples in the grouping shown (currently: first seen in round).",
        ],
        owner: "TBD",
        status: "partial",
    },

    phcDomainTable: {
        handoff: "§8, §16.5",
        feeds: ["phc.cohorts", "phc.domains"],
        kind: "table",
        location: "https://docs.google.com/spreadsheets/d/1s3A0oy5X05hQlJ28-waVlITXp5ZcBcmDdRSfD7jxttc/edit?gid=0",
        access: "Publicly viewable. Read via .../export?format=csv&gid=0 (server-side) or the Sheets API.",
        fields: {
            cohort: "Cohort (A)",
            cohortUrl: "URL (B)",
            wesR2: "WES R2* (C)",
            wgsR3: "WGS R3* (D)",
            wgsR4: "WGS R4* (E)",
            wgsR5: "WGS R5* (F)",
            domains: "G–R (12 PHC domains, subject counts)",
        },
        gaps: [
            "URL errors in column B: PSP-UCLA and GEMS point at other cohorts; University of Pittsburgh is misspelled (pittsburg); NCRAD and ADRC slugs differ from DSS. Prototype uses the DSS page URLs.",
            "ADNI shows 0 in every PHC domain (ADNI PHC is via LONI) — confirm.",
            "Columns C–F give per-cohort release counts and could replace the sample-level export for the Samples table.",
        ],
        rules: ["Render from the sheet — do not keep a second copy."],
        owner: "TBD",
        status: "confirmed",
    },

    releaseMetadata: {
        handoff: "§4, §13",
        feeds: ["releaseFacts.*.referenceBuild", "releaseFacts.*.firstPublicRelease", "releases[R6|R7].assay"],
        kind: "content",
        location: "Team-supplied",
        fields: {
            referenceBuild: "GRCh38 (all rounds — confirmed by team)",
            firstPublicRelease: "TBD",
            r6r7Assay: "WGS (all new rounds)",
        },
        owner: "TBD",
        status: "partial",
    },

    releaseNotes: {
        handoff: "§4.2",
        feeds: ["releases.*.milestones", "links.releaseNotes"],
        kind: "table",
        location: "https://st1.niagads.org/portal/download-public/NG00067.v{version}/rn",
        rules: ["Build the URL from datasetInfo.version each release (latest supplied: v21)."],
        owner: "TBD",
        status: "partial",
    },

    publications: {
        handoff: "§7, §16.7",
        feeds: ["publications"],
        kind: "content",
        location:
            "uploads/ADSP Publications (infrastructure, data releases, key resources) (1).docx — last update Aug 2026",
        fields: {
            group: "section heading",
            citation: "Citation",
            pmid: "PMID",
            description: "Description / Resource",
            release: "parsed from Description (R1–R5)",
        },
        rules: [
            "Preprints are labelled as such.",
            "VCPA (PMID 30351394) is the pipeline paper. The source doc also listed PMID 38263370 as 'VCPA WES' — removed; that paper is the R2 data descriptor only.",
        ],
        owner: "TBD",
        status: "confirmed",
    },

    externalUrls: {
        handoff: "§16.5–6",
        feeds: ["links.*"],
        kind: "content",
        location: "Team-supplied",
        owner: "TBD",
        status: "confirmed",
    },

    accessPolicy: {
        handoff: "§9, §16.9",
        feeds: ["access.separateRequest", "access.faq"],
        kind: "content",
        location: "TBD",
        owner: "TBD",
        status: "needed",
    },

    submitContent: {
        handoff: "§10, §16.8",
        feeds: ["(Submit page)"],
        kind: "content",
        location: "TBD",
        owner: "TBD",
        status: "needed",
    },
};
