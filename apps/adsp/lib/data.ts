/* ============================================================================
   ADSP Data site — CONTENT / DATA FILE  
   ----------------------------------------------------------------------------
   The ONLY file to edit to fill in real values. No layout or styling here.

   Conventions
     • All counts are SAMPLE counts — never participant counts; never
       deduplicated by subject ID.
     • "TBD" = not yet supplied. Rendered as an explicit unknown.
     • PLACEHOLDER blocks carry demo values and show a gold badge on the site.
     • GENERATED blocks were built from files the team supplied (named in the
       block header). Regenerate from the source; don't hand-edit.

   lib/sources.ts records where every block comes from.
   ========================================================================== */

import type { AdspData } from "./types";

export const ADSP_DATA: AdspData = {

  links: {
    ng00067:        "https://dss.niagads.org/datasets/ng00067/",
    adseq:          "https://adseq.org/",
    gen3:           "https://gen3.niagads.org/login",
    phcWebsite:     "https://vmacdata.org/adsp-phc",
    accessGuide:    "https://niagads.scrollhelp.site/support/application-instructions",
    niagads:        "https://www.niagads.org/",
    support:        "https://www.niagads.org/support",
    datasetInfoApi: "https://st1.niagads.org/portal/dataset_info/NG00067",
    darApi:         "https://st1.niagads.org/portal/v1/adars/NG00067",
    cohortsApi:     "https://dss.niagads.org/wp-json/custom/v2/adsp_cohorts", // cohort count = unique cohort_id
    productionApi:  "/api/adsp/production", // Next.js route handler: app/api/adsp/production/route.ts
    releaseNotes:   "https://st1.niagads.org/portal/download-public/NG00067.v{version}/rn",
    latestVersion:  "21", // fallback until datasetInfo.version is fetched
    latestReleaseDate: "June 11, 2026", // DSS "Last Release Date" — confirm which dataset_info field carries it
    dars:           "https://dss.niagads.org/datasets/ng00067/#data-access-requests",
  },

  /* AT A GLANCE — values fetched live from datasetInfo / darStatistics;
     these are the fallbacks shown until a fetch succeeds. */
  glance: {
    ng00067Version: { value: "TBD", note: "Current NIAGADS dataset",       source: "dataset_info/NG00067 → version" },
    approvedDars:   { value: "TBD", note: "Approved data access requests", source: "v1/adars/NG00067 → unique dar_ID with approval_date" },
    cohorts:        { value: "TBD", note: "Cohorts represented",           source: "dss.niagads.org/wp-json/custom/v2/adsp_cohorts → unique cohort_id" },
  },

  releases: [
    { id: "R1", assay: "WGS", familiarLabel: "5K WGS", status: "released", projectFileset: "fsa000003", samples: {qc: 4789},
      milestones: [
        {type: "initial",label: "Initial individual-level WGS release",date: "July 30, 2018",datasetVersion: "Dataset version 2018.07.30",summary: "Initial R1 WGS release containing CRAMs, GATK-called gVCFs, sequencing metrics, phenotypes, and pedigree information. Data were processed using VCPA1.0 against GRCh38."},
        {type: "qc",label: "QC'd project-level release",date: "October 30, 2018",datasetVersion: "Dataset version 2018.09.17",summary: "Released the ADSP quality-control-checked GATK joint-called VCF for 4,789 whole genomes together with QC companion files."},
      ] },
    { id: "R2", assay: "WES", familiarLabel: "20K WES", status: "released", projectFileset: "fsa000005", samples: {qc: 20504},
      milestones: [
        {type: "initial",label: "Initial individual-level WES release",date: "February 19, 2020",datasetVersion: "NG00067.v2",summary: "Released WES CRAMs, gVCFs, and phenotypes from nine contributing studies."},
        {type: "qc",label: "QC'd project-level release",date: "September 24, 2020",datasetVersion: "NG00067.v3",summary: "Released the quality-controlled jointly called project-level VCF for 20,504 samples. Also added 582 subjects not previously released because of consent issues."},
        {type: "expansion",label: "X-chromosome PAR data",date: "October 27, 2021",datasetVersion: "NG00067.v7",summary: "Added QC'd X-chromosome pseudoautosomal-region data for R2."},
        {type: "expansion",label: "chrY / chrM Preview",date: "October 3, 2024",datasetVersion: "NG00067.v13",summary: "Added R2 WES Preview pVCFs for chromosomes Y and M."},
        {type: "expansion",label: "Multiallelic Preview",date: "May 15, 2025",datasetVersion: "NG00067.v17",summary: "Added R2 multiallelic Preview pVCFs for 20,499 samples across chromosomes 1–22, X, Y, and M. As of March 2025 there were no plans to develop an ADSP QC protocol for the WES multiallelic data."},
      ] },
    { id: "R3", assay: "WGS", familiarLabel: "17K WGS", status: "released", projectFileset: "fsa000006", samples: {preview: 16906,qc: 16905},
      milestones: [
        {type: "preview",label: "Preview release",date: "February 25, 2021",datasetVersion: "NG00067.v5",summary: "Introduced R3 as a 16,906-sample WGS dataset, adding 12,118 newly sequenced samples to the 4,788 R1 genomes."},
        {type: "qc",label: "QC'd project-level release",date: "October 27, 2021",datasetVersion: "NG00067.v7",summary: "Released the QC'd autosomal biallelic SNV/indel pVCF for 16,905 samples, together with individual-level structural-variant calls."},
        {type: "expansion",label: "X chromosome + project-level SV resources",date: "March 24, 2022",datasetVersion: "NG00067.v8",summary: "Added QC'd X-chromosome and X-PAR data together with the R3 GraphTyper and BioGraph structural-variant callsets."},
        {type: "resource",label: "Principal components",date: "October 3, 2024",datasetVersion: "NG00067.v13",summary: "Added the CHARGE-generated principal components used in the primary R3 analysis."},
      ] },
    { id: "R4", assay: "WGS", familiarLabel: "36K WGS", status: "released", projectFileset: "fsa000026", samples: {preview: 36361,qc: 36361},
      milestones: [
        {type: "preview",label: "Preview release",date: "October 5, 2022",datasetVersion: "NG00067.v9",summary: "Introduced R4 as a 36,361-sample WGS dataset by jointly calling 19,456 newly sequenced samples with the previously released R3 genomes."},
        {type: "qc",label: "QC'd project-level release",date: "August 15, 2023",datasetVersion: "NG00067.v10",summary: "Released the QC'd autosomal biallelic pVCF for 36,361 samples, plus individual-level Manta/Smoove SV calls for newly introduced R4 samples and chromosome-merged compact/filtered Preview pVCFs."},
        {type: "resource",label: "Annotation resources",date: "December 11, 2023",datasetVersion: "NG00067.v11",summary: "Added R4 WGS annotation files."},
        {type: "expansion",label: "Expanded QC'd products",date: "October 3, 2024",datasetVersion: "NG00067.v13",summary: "Added R4 GDS, QC'd chrX and multiallelic pVCFs, GraphTyper jointly genotyped structural variants, and FAVOR annotations."},
        {type: "resource",label: "LD reference panel",date: "November 27, 2024",datasetVersion: "NG00067.v14",summary: "Added the R4 WGS LD reference panel."},
      ] },
    { id: "R5", assay: "WGS", familiarLabel: "58K WGS", status: "released", projectFileset: "fsa000116", filesetNote: "Some R5 derived resources are in separate filesets.", samples: {preview: 58507,qc: 58506},
      milestones: [
        {type: "preview",label: "Preview release",date: "November 27, 2024",datasetVersion: "NG00067.v14",summary: "Introduced R5 with 58,507 whole genomes: 22,158 newly added samples jointly called with 36,349 previously released R4 genomes. Also included individual-level SV calls for newly added samples and associated phenotype updates."},
        {type: "expansion",label: "Expanded Preview formats",date: "February 18, 2025",datasetVersion: "NG00067.v16",summary: "Added by-consent R5 Preview files and compact-format Preview pVCFs."},
        {type: "qc",label: "QC'd project-level release",date: "December 9, 2025",datasetVersion: "NG00067.v19",summary: "Released the R5 QC'd autosomal biallelic and multiallelic SNV/indel pVCFs for 58,506 samples, including compact representations."},
        {type: "expansion",label: "Expanded QC'd release and derived resources",date: "March 12, 2026",datasetVersion: "NG00067.v20",summary: "Added R5 QC'd chrX pVCFs, GDS representations, replicate-analysis files, jointly called structural variants, the R5 LD reference panel, and imputation panels."},
      ] },
    { id: "R6", assay: "WGS", familiarLabel: null, status: "in_production",
      activitySummary: "Joint calling underway",
      currentActivities: ["Joint calling"],
      productionStages: [{ label: "Individual-level processing", state: "complete", status: "Complete — all projects have gVCFs" }, { label: "Project-level processing", state: "in_progress", status: "Joint calling underway" }],
      individualNote: "All R6 projects and batches have completed individual-level processing. This table is the production history of the projects that contributed to R6.",
      summary: "All R6 projects and batches have completed individual-level processing and have gVCFs. Release-wide joint calling is underway." },
    { id: "R7", assay: "WGS", familiarLabel: null, status: "in_production",
      activitySummary: "Individual-level processing",
      currentActivities: ["Individual-level processing"],
      productionStages: [{ label: "Individual-level processing", state: "in_progress", status: "In progress" }, { label: "Project-level processing", state: "not_started", status: "Not started" }],
      individualNote: "Projects may arrive in several batches; each batch moves through individual-level processing independently.",
      summary: "Projects and batches are moving through individual-level processing independently." },
  ],

  /* GENERATED — samples from pVCFReleaseTable "Samples"; build confirmed by team. */
  releaseFacts: {
    R1: { samples: 4789, referenceBuild: "GRCh38", firstPublicRelease: "TBD" },
    R2: { samples: 20504, referenceBuild: "GRCh38", firstPublicRelease: "TBD" },
    R3: { samples: 16906, referenceBuild: "GRCh38", firstPublicRelease: "TBD" },
    R4: { samples: 36361, referenceBuild: "GRCh38", firstPublicRelease: "TBD" },
    R5: { samples: 58507, referenceBuild: "GRCh38", firstPublicRelease: "TBD" },
  },

  /* RELEASE SUMMARY — drives Round Overview, Core Data Products, homepage and About timeline.
     When a round is released: set its status to "released" in releases[], add releaseFacts,
     and add an entry here. [version, date]; null = product not released for that round. */
  releaseSummary: {
    R1: { first: ["v0", "Jul 30, 2018"],  qc: ["v1", "Oct 30, 2018"],
          products: { cram: ["v0", "Jul 30, 2018"],  preview: null,                   qcPvcf: ["v1", "Oct 30, 2018"],   svIndiv: null,                   svJoint: null } },
    R2: { first: ["v2", "Feb 19, 2020"],  qc: ["v3", "Sep 24, 2020"],
          products: { cram: ["v2", "Feb 19, 2020"],  preview: null,                   qcPvcf: ["v3", "Sep 24, 2020"],   svIndiv: null,                   svJoint: null } },
    R3: { first: ["v5", "Feb 25, 2021"],  qc: ["v7", "Oct 27, 2021"],
          products: { cram: ["v5", "Feb 25, 2021"],  preview: ["v5", "Feb 25, 2021"],  qcPvcf: ["v7", "Oct 27, 2021"],   svIndiv: ["v7", "Oct 27, 2021"],  svJoint: ["v8", "Mar 24, 2022"] } },
    R4: { first: ["v9", "Oct 5, 2022"],   qc: ["v10", "Aug 15, 2023"],
          products: { cram: ["v9", "Oct 5, 2022"],   preview: ["v9", "Oct 5, 2022"],   qcPvcf: ["v10", "Aug 15, 2023"], svIndiv: ["v10", "Aug 15, 2023"], svJoint: ["v13", "Oct 3, 2024"] } },
    R5: { first: ["v14", "Nov 27, 2024"], qc: ["v19", "Dec 9, 2025"],
          products: { cram: ["v14", "Nov 27, 2024"], preview: ["v14", "Nov 27, 2024"], qcPvcf: ["v19", "Dec 9, 2025"],  svIndiv: ["v14", "Nov 27, 2024"], svJoint: ["v20", "Mar 12, 2026"] } },
  },
  coreProductRows: [["cram", "CRAM / gVCF"], ["preview", "Preview pVCF"], ["qcPvcf", "QC'd pVCF"], ["svIndiv", "Individual SV calls"], ["svJoint", "Joint SV callset"]],

  /* --------------------------------------------------------------------------
     DSS LINKS — accessions → DSS pages. cohortUrls: GENERATED by matching
     sample_list_ex.xlsx Cohort names to dss.niagads.org/datasets/ng00067/#cohorts
     (the Google Sheet had 4 wrong/typo URLs — see ADSP_SOURCES.phcDomainTable).
     -------------------------------------------------------------------------- */
  dss: {
    studyUrl:     "https://dss.niagads.org/studies/{id}/",
    sampleSetUrl: "https://dss.niagads.org/sample-sets/{id}/",
    studies: {
      sa000001: "ADSP", sa000002: "ADNI", sa000003: "ADGC", sa000004: "FASe", sa000005: "Brkanac Families",
      sa000006: "HIHG Miami Families", sa000007: "WHICAP", sa000008: "Knight ADRC", sa000009: "CBD", sa000010: "PSP",
      sa000011: "AMP-AD", sa000012: "UPitt-Kamboh", sa000013: "APOE Extremes WGS", sa000014: "Cache County",
      sa000015: "NIH, CurePSP & Tau Consortium PSP WGS", sa000016: "CurePSP & Tau Consortium PSP WGS", sa000017: "UCLA PSP",
      sa000019: "LASI-DAD", sa000023: "EOAD", sa000036: "UAB ADRC", sa000056: "Genetic Studies of AD in Korea",
      sa000057: "Wellderly (HEAL)", sa000058: "Arizona APOE Cohort Study", sa000059: "Genetic Architecture of AD & Related Proteinopathies",
      sa000060: "ASPREE", sa000061: "HABS-HD", sa000062: "EFIGA", sa000063: "NIA AD-FBS",
    },
    sampleSets: {
      snd10000: "ADSP Discovery", snd10001: "ADSP Extension", snd10002: "ADNI-WGS-1", snd10003: "ADGC AA WES",
      snd10004: "FASe Families WES", snd10005: "Brkanac Families WES", snd10006: "Miami Families WES", snd10007: "WHICAP WES",
      snd10008: "Knight ADRC WES", snd10009: "CBD WES", snd10010: "PSP WES", snd10011: "AMP-AD WGS",
      snd10012: "UPitt-Kamboh1 WGS", snd10013: "NACC-Genentech WGS", snd10014: "Cache County WGS", snd10015: "PSP-NIH-CurePSP-Tau WGS",
      snd10016: "PSP-CurePSP-Tau WGS", snd10017: "PSP UCLA WGS", snd10018: "FASe Families WGS", snd10019: "Knight ADRC WGS",
      snd10020: "ADSP-FUS1 WGS", snd10030: "ADGC-TARCC WGS", snd10031: "ADSP-FUS2 WGS", snd10032: "EOAD1 WGS",
      snd10033: "LASI-DAD WGS", snd10091: "Pitt-Kamboh-2 WGS", snd10092: "GARD1 WGS", snd10093: "ASPREE1 WGS",
      snd10094: "ADSP-FUS3 WGS", snd10095: "EOAD2 WGS", snd10096: "Wellderly WGS", snd10097: "AZAPOE WGS",
      snd10098: "Amyloid-WU WGS", snd10099: "UAB-ADRC WGS", snd10100: "Amyloid-Pitt WGS", snd10101: "FASe-Families2 WGS",
      snd10102: "HABS-HD1 WGS", snd10103: "APOEExtremes1 WGS", snd10104: "EFIGA1 WGS", snd10105: "NIA-AD-FBS1 WGS", snd10106: "WHICAP1 WGS",
    },
    cohortUrls: {
      "Religious Orders Study/Memory and Aging Project (ROSMAP)": "https://dss.niagads.org/cohorts/religious-orders-study-memory-and-aging-project-rosmap/",
      "Indianapolis-Ibadan (IIAA/IIBD)": "https://dss.niagads.org/cohorts/indianapolis-ibadan-iiaa/",
      "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)": "https://dss.niagads.org/cohorts/estudio-familiar-de-influencia-genetica-en-alzheimer-efiga/",
      "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)": "https://dss.niagads.org/cohorts/national-institute-on-aging-late-onset-of-alzheimers-disease-family-nia-load/",
      "University of Miami": "https://dss.niagads.org/cohorts/university-of-miami-mia/",
      "National Cell Repository for Alzheimer's Disease (NCRAD)": "https://dss.niagads.org/cohorts/national-centralized-repository-for-alzheimers-disease-and-related-dementias-family-ncrad-family/",
      "University of Washington Families": "https://dss.niagads.org/cohorts/university-of-washington-families-ras/",
      "Vanderbilt University": "https://dss.niagads.org/cohorts/vanderbilt-university-van/",
      "Erasmus Rucphen Family (ERF)": "https://dss.niagads.org/cohorts/erasmus-rucphen-family-erf/",
      "National Institute of Mental Health (NIMH)": "https://dss.niagads.org/cohorts/national-institute-of-mental-health-nimh/",
      "Wisconsin Registry for Alzheimer's Prevention (WRAP)": "https://dss.niagads.org/cohorts/wisconsin-registry-for-alzheimers-prevention-wrap/",
      "Resource for Early-onset Alzheimer's Disease Research (READR)": "https://dss.niagads.org/cohorts/resource-for-early-onset-alzheimers-disease-research-readr/",
      "Mexico-Southern California Autosomal Dominant Alzheimer's Disease Consortium": "https://dss.niagads.org/cohorts/mexico-southern-california-autosomal-dominant-alzheimers-disease-consortium/",
      "Adult Changes in Thought (ACT)": "https://dss.niagads.org/cohorts/adult-changes-in-thought-act/",
      "NIA Alzheimer Disease Centers (ADC)": "https://dss.niagads.org/cohorts/nia-alzheimers-disease-research-centers-adrc/",
      "Amish Protective Variant Study (AMISH_PV)": "https://dss.niagads.org/cohorts/amish-protective-variant-study/",
      "Chicago Health and Aging Project (CHAP)": "https://dss.niagads.org/cohorts/chicago-health-and-aging-project-chap/",
      "Case Western Reserve University (CWRU) Autopsy Cohort": "https://dss.niagads.org/cohorts/case-western-reserve-university-cwru-autopsy/",
      "GenerAAtions - Genetic and Environmental Risk Factors for Alzheimer's Disease Among African Americans": "https://dss.niagads.org/cohorts/genetic-and-environmental-risk-factors-for-alzheimers-disease-among-african-americans-generaations/",
      "Genetic Differences": "https://dss.niagads.org/cohorts/genetic-differences-gendiff/",
      "Hillblom'Aging Network (HAN)": "https://dss.niagads.org/cohorts/hillblom-aging-network/",
      "Longevity Genes Project (LGP)": "https://dss.niagads.org/cohorts/longevity-genes-project-lgp/",
      "LonGenity": "https://dss.niagads.org/cohorts/longenity/",
      "Minority Aging Research Study (MARS)": "https://dss.niagads.org/cohorts/minority-aging-research-study-mars/",
      "Mayo Clinic": "https://dss.niagads.org/cohorts/mayo/",
      "Mexican Health and Aging Study (MHAS)": "https://dss.niagads.org/cohorts/mexican-health-and-aging-study-mhas/",
      "University of Miami Brain Bank (MBB)": "https://dss.niagads.org/cohorts/university-of-miami-brain-bank-mbb/",
      "Research in African-American Alzheimer's Disease Initiative (REAAADI)": "https://dss.niagads.org/cohorts/research-in-african-american-alzheimers-disease-initiative-reaaadi/",
      "Puerto Rican Alzheimer's Disease Initiative (PRADI)": "https://dss.niagads.org/cohorts/puerto-rican-alzheimers-disease-initiative-pradi/",
      "Cuban American Alzheimer's Disease Initiative (CuAADI)": "https://dss.niagads.org/cohorts/cuban-american-alzheimers-disease-initiative-cuaadi/",
      "Peru Alzheimer's Disease Initiative (PeADI)": "https://dss.niagads.org/cohorts/peru-alzheimers-disease-initiative-peadi/",
      "Case Western Reserve University (CWRU) Rapid Decline Cohort": "https://dss.niagads.org/cohorts/case-western-reserve-university-cwru-rapid-decline/",
      "Multi-Institutional Research in Alzheimer's Genetic Epidemiology (MIRAGE)": "https://dss.niagads.org/cohorts/multi-institutional-research-in-alzheimers-genetic-epidemiology-mirage/",
      "Northern Manhattan Study (NOMAS)": "https://dss.niagads.org/cohorts/northern-manhattan-study-nomas/",
      "University of Pittsburgh ADRC- Kamboh": "https://dss.niagads.org/cohorts/university-of-pittsburgh-pitt/",
      "Puerto Rican 10/66 Study (PR1066)": "https://dss.niagads.org/cohorts/puerto-rican-10-66-study-pr1066/",
      "Stanford Extreme Phenotypes in AD (StEP-AD)": "https://dss.niagads.org/cohorts/stanford-extreme-phenotypes-in-ad-step-ad/",
      "Texas Alzheimer's Research and Care Consortium (TARCC)": "https://dss.niagads.org/cohorts/texas-alzheimers-research-and-care-consortium-tarcc/",
      "University of Toronto": "https://dss.niagads.org/cohorts/university-of-toronto/",
      "Washington Heights-Inwood Columbia Aging Project (WHICAP)": "https://dss.niagads.org/cohorts/washington-heights-and-inwood-community-aging-project-whicap/",
      "Atherosclerosis Risk in Communities (ARIC)": "https://dss.niagads.org/cohorts/atherosclerosis-risk-in-communities-aric/",
      "Cardiovascular Health Study (CHS)": "https://dss.niagads.org/cohorts/cardiovascular-health-study-chs/",
      "Framingham Heart Study (FHS)": "https://dss.niagads.org/cohorts/framingham-heart-study-fhs/",
      "Rotterdam Study (RS)": "https://dss.niagads.org/cohorts/rotterdam-study-rs/",
      "Cache County Study": "https://dss.niagads.org/cohorts/cache-county-study-ccs/",
      "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)": "https://dss.niagads.org/cohorts/knight-alzheimers-disease-research-center-kgad/",
      "Harmonized Diagnostic Assessment of Dementia for the Longitudinal Aging Study of India (LASI-DAD)": "https://dss.niagads.org/cohorts/harmonized-diagnostic-assessment-of-dementia-for-the-longitudinal-aging-study-of-india-lasi-dad/",
      "Mount Sinai Brain Bank": "https://dss.niagads.org/cohorts/mount-sinai-brain-bank-msbb/",
      "Gwangju Alzheimer's and Related Dementia (GARD)": "https://dss.niagads.org/cohorts/gwangju-alzheimers-and-related-dementia-gard/",
      "ASPrin in Reducing Events in the Elderly (ASPREE)": "https://dss.niagads.org/cohorts/asprin-in-reducing-events-in-the-elderly-aspree/",
      "Cardiff EOAD": "https://dss.niagads.org/cohorts/cardiff-eoad-2/",
      "A4 Study (A4)": "https://dss.niagads.org/cohorts/a4-study-a4/",
      "Center for Cognitive Neuroscience and Aging (CNSA)": "https://dss.niagads.org/cohorts/center-for-cognitive-neuroscience-and-aging-cnsa/",
      "Healthy Elderly Active Longevity (HEAL) Cohort \"Wellderly\"": "https://dss.niagads.org/cohorts/healthy-elderly-active-longevity-heal-cohort-wellderly/",
      "Korean Brain Aging Study for the Early Diagnosis and Prediction of AD (KBASE)": "https://dss.niagads.org/cohorts/korean-brain-aging-study-for-the-early-diagnosis-and-prediction-of-ad-kbase/",
      "Arizona APOE Cohort Study": "https://dss.niagads.org/cohorts/banner-health-apoe-longitudinal/",
      "The University of Alabama Birmingham Alzheimer's Disease Research Center (UAB_ADRC)": "https://dss.niagads.org/cohorts/the-university-of-alabama-birmingham-alzheimers-disease-research-center-uab_adrc/",
      "Brain Amyloid Cognitive Normal Elders Study (BACNE)": "https://dss.niagads.org/cohorts/brain-amyloid-cognitive-normal-elders-study/",
      "The Ginkgo Evaluation of Memory Study (GEMS)": "https://dss.niagads.org/cohorts/the-ginkgo-evaluation-of-memory-study/",
      "Human Connectome Project (HCP)": "https://dss.niagads.org/cohorts/human-connectome-project/",
      "Heart SCORE (HS)": "https://dss.niagads.org/cohorts/heart-score/",
      "The Monongahela-Youghiogheny Healthy Aging Team study (MYHAT)": "https://dss.niagads.org/cohorts/the-monongahela-youghiogheny-healthy-aging-team-myhat/",
      "Health and Aging Brain Study - Health Disparities (HABS-HD)": "https://dss.niagads.org/cohorts/health-and-aging-brain-study-health-disparities-habs-hd/",
      "Alzheimer's Disease Neuroimaging Initiative (ADNI)": "https://dss.niagads.org/cohorts/alzheimers-disease-neuroimaging-initiative-adni/",
      "Corticobasal Degeneration Study (CBD)": "https://dss.niagads.org/cohorts/corticobasal-degeneration-cbd/",
      "Progressive Supranuclear Palsy Study (PSP)": "https://dss.niagads.org/cohorts/progressive-supranuclear-palsy-psp/",
      "Progressive Supranuclear Palsy Study - UCLA (PSP-UCLA)": "https://dss.niagads.org/cohorts/progressive-supranuclear-palsy-at-the-university-of-california-los-angeles-psp-ucla/",
    },
  },

  /* --------------------------------------------------------------------------
     SAMPLE SETS — GENERATED from sample_list_ex.xlsx (79,006 samples).
     One row per Cohort × Study_DSS × Sample_Set. counts = SAMPLES IN EACH RELEASE:
       • WGS rounds are cumulative: a sample first seen in R1 is counted in
         R1, R3, R4 and R5 (derived from "First Round").
       • R2 = every WES sample (SAMPLE_USE = WES), incl. those labelled First Round R1.
     Totals: R1 4,786 · R2 20,499 · R3 16,903 · R4 36,349 · R5 58,507
     (match the "Sequence Data Availability by Cohort" sheet).
     -------------------------------------------------------------------------- */
  sampleSets: [
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000001", sampleSet: "snd10001", counts: {R1:780,R3:780,R4:780,R5:780} },
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000001", sampleSet: "snd10000", counts: {R1:355,R3:355,R4:355,R5:355,R2:330} },
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000062", sampleSet: "snd10104", counts: {R5:1373} },
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000019", sampleSet: "snd10033", counts: {R4:3,R5:3} },
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000001", sampleSet: "snd10031", counts: {R4:1093,R5:1093} },
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000056", sampleSet: "snd10092", counts: {R5:4} },
    { cohort: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", study: "sa000001", sampleSet: "snd10094", counts: {R5:1692} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000001", sampleSet: "snd10000", counts: {R1:77,R3:77,R4:77,R5:77,R2:473} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000004", sampleSet: "snd10018", counts: {R3:66,R4:66,R5:66} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000001", sampleSet: "snd10001", counts: {R1:67,R3:67,R4:67,R5:67} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000004", sampleSet: "snd10004", counts: {R2:882} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000063", sampleSet: "snd10105", counts: {R5:960} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000005", sampleSet: "snd10005", counts: {R2:39} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000001", sampleSet: "snd10031", counts: {R4:3,R5:3} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000004", sampleSet: "snd10101", counts: {R5:109} },
    { cohort: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", study: "sa000013", sampleSet: "snd10103", counts: {R5:10} },
    { cohort: "University of Miami", study: "sa000006", sampleSet: "snd10006", counts: {R2:108} },
    { cohort: "University of Miami", study: "sa000001", sampleSet: "snd10001", counts: {R1:29,R3:29,R4:29,R5:29} },
    { cohort: "University of Miami", study: "sa000001", sampleSet: "snd10000", counts: {R1:58,R3:58,R4:58,R5:58,R2:190} },
    { cohort: "University of Miami", study: "sa000001", sampleSet: "snd10020", counts: {R3:917,R4:917,R5:917} },
    { cohort: "University of Miami", study: "sa000003", sampleSet: "snd10003", counts: {R2:940} },
    { cohort: "University of Miami", study: "sa000023", sampleSet: "snd10095", counts: {R5:218} },
    { cohort: "University of Miami", study: "sa000001", sampleSet: "snd10031", counts: {R4:24,R5:24} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000001", sampleSet: "snd10000", counts: {R1:16,R3:16,R4:16,R5:16,R2:160} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000001", sampleSet: "snd10001", counts: {R1:15,R3:15,R4:15,R5:15} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000005", sampleSet: "snd10005", counts: {R2:18} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000004", sampleSet: "snd10004", counts: {R2:182} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000004", sampleSet: "snd10101", counts: {R5:448} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000019", sampleSet: "snd10033", counts: {R4:1,R5:1} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000001", sampleSet: "snd10031", counts: {R4:3,R5:3} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000056", sampleSet: "snd10092", counts: {R5:1} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000023", sampleSet: "snd10095", counts: {R5:16} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000004", sampleSet: "snd10018", counts: {R3:20,R4:20,R5:20} },
    { cohort: "National Cell Repository for Alzheimer's Disease (NCRAD)", study: "sa000013", sampleSet: "snd10103", counts: {R5:1} },
    { cohort: "University of Washington Families", study: "sa000001", sampleSet: "snd10000", counts: {R1:40,R3:40,R4:40,R5:40,R2:46} },
    { cohort: "University of Washington Families", study: "sa000001", sampleSet: "snd10001", counts: {R1:7,R3:7,R4:7,R5:7} },
    { cohort: "University of Washington Families", study: "sa000063", sampleSet: "snd10105", counts: {R5:37} },
    { cohort: "University of Washington Families", study: "sa000004", sampleSet: "snd10004", counts: {R2:36} },
    { cohort: "University of Washington Families", study: "sa000004", sampleSet: "snd10018", counts: {R3:5,R4:5,R5:5} },
    { cohort: "University of Washington Families", study: "sa000005", sampleSet: "snd10005", counts: {R2:1} },
    { cohort: "Vanderbilt University", study: "sa000001", sampleSet: "snd10000", counts: {R1:3,R3:3,R4:3,R5:3,R2:231} },
    { cohort: "Vanderbilt University", study: "sa000003", sampleSet: "snd10003", counts: {R2:102} },
    { cohort: "Vanderbilt University", study: "sa000001", sampleSet: "snd10020", counts: {R3:72,R4:72,R5:72} },
    { cohort: "Erasmus Rucphen Family (ERF)", study: "sa000001", sampleSet: "snd10000", counts: {R1:30,R3:30,R4:30,R5:30,R2:45} },
    { cohort: "Erasmus Rucphen Family (ERF)", study: "sa000001", sampleSet: "snd10001", counts: {R1:92,R3:92,R4:92,R5:92} },
    { cohort: "National Institute of Mental Health (NIMH)", study: "sa000005", sampleSet: "snd10005", counts: {R2:17} },
    { cohort: "Wisconsin Registry for Alzheimer's Prevention (WRAP)", study: "sa000001", sampleSet: "snd10031", counts: {R4:1020,R5:1020} },
    { cohort: "Resource for Early-onset Alzheimer's Disease Research (READR)", study: "sa000023", sampleSet: "snd10095", counts: {R5:39} },
    { cohort: "Mexico-Southern California Autosomal Dominant Alzheimer's Disease Consortium", study: "sa000001", sampleSet: "snd10094", counts: {R5:62} },
    { cohort: "Adult Changes in Thought (ACT)", study: "sa000001", sampleSet: "snd10000", counts: {R2:1275} },
    { cohort: "Adult Changes in Thought (ACT)", study: "sa000001", sampleSet: "snd10001", counts: {R1:272,R3:272,R4:272,R5:272} },
    { cohort: "Adult Changes in Thought (ACT)", study: "sa000023", sampleSet: "snd10032", counts: {R4:6,R5:6} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000003", sampleSet: "snd10003", counts: {R2:1331} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000001", sampleSet: "snd10001", counts: {R1:1153,R3:1153,R4:1153,R5:1153} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000001", sampleSet: "snd10020", counts: {R3:4703,R4:4703,R5:4703} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000001", sampleSet: "snd10031", counts: {R4:2651,R5:2651} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000023", sampleSet: "snd10032", counts: {R4:2545,R5:2545} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000023", sampleSet: "snd10095", counts: {R5:505} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000001", sampleSet: "snd10000", counts: {R2:3259} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000013", sampleSet: "snd10013", counts: {R3:137,R4:137,R5:137} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000001", sampleSet: "snd10094", counts: {R5:878} },
    { cohort: "NIA Alzheimer Disease Centers (ADC)", study: "sa000015", sampleSet: "snd10015", counts: {R3:2,R4:2,R5:2} },
    { cohort: "Amish Protective Variant Study (AMISH_PV)", study: "sa000001", sampleSet: "snd10031", counts: {R4:1038,R5:1038} },
    { cohort: "Amish Protective Variant Study (AMISH_PV)", study: "sa000001", sampleSet: "snd10094", counts: {R5:94} },
    { cohort: "Chicago Health and Aging Project (CHAP)", study: "sa000001", sampleSet: "snd10000", counts: {R2:231} },
    { cohort: "Case Western Reserve University (CWRU) Autopsy Cohort", study: "sa000001", sampleSet: "snd10031", counts: {R4:96,R5:96} },
    { cohort: "Case Western Reserve University (CWRU) Autopsy Cohort", study: "sa000001", sampleSet: "snd10094", counts: {R5:40} },
    { cohort: "GenerAAtions - Genetic and Environmental Risk Factors for Alzheimer's Disease Among African Americans", study: "sa000003", sampleSet: "snd10003", counts: {R2:455} },
    { cohort: "Genetic Differences", study: "sa000001", sampleSet: "snd10000", counts: {R2:207} },
    { cohort: "Hillblom'Aging Network (HAN)", study: "sa000001", sampleSet: "snd10031", counts: {R4:15,R5:15} },
    { cohort: "Indianapolis-Ibadan (IIAA/IIBD)", study: "sa000001", sampleSet: "snd10001", counts: {R1:395,R3:395,R4:395,R5:395} },
    { cohort: "Indianapolis-Ibadan (IIAA/IIBD)", study: "sa000001", sampleSet: "snd10031", counts: {R4:964,R5:964} },
    { cohort: "Longevity Genes Project (LGP)", study: "sa000001", sampleSet: "snd10031", counts: {R4:5,R5:5} },
    { cohort: "LonGenity", study: "sa000001", sampleSet: "snd10031", counts: {R4:27,R5:27} },
    { cohort: "Religious Orders Study/Memory and Aging Project (ROSMAP)", study: "sa000001", sampleSet: "snd10000", counts: {R2:762} },
    { cohort: "Religious Orders Study/Memory and Aging Project (ROSMAP)", study: "sa000011", sampleSet: "snd10011", counts: {R3:730,R4:730,R5:730} },
    { cohort: "Religious Orders Study/Memory and Aging Project (ROSMAP)", study: "sa000003", sampleSet: "snd10003", counts: {R2:44} },
    { cohort: "Minority Aging Research Study (MARS)", study: "sa000003", sampleSet: "snd10003", counts: {R2:62} },
    { cohort: "Mayo Clinic", study: "sa000001", sampleSet: "snd10000", counts: {R2:346} },
    { cohort: "Mayo Clinic", study: "sa000011", sampleSet: "snd10011", counts: {R3:169,R4:169,R5:169} },
    { cohort: "Mexican Health and Aging Study (MHAS)", study: "sa000001", sampleSet: "snd10031", counts: {R4:2617,R5:2617} },
    { cohort: "University of Miami Brain Bank (MBB)", study: "sa000001", sampleSet: "snd10031", counts: {R4:312,R5:312} },
    { cohort: "Research in African-American Alzheimer's Disease Initiative (REAAADI)", study: "sa000001", sampleSet: "snd10031", counts: {R4:712,R5:712} },
    { cohort: "Research in African-American Alzheimer's Disease Initiative (REAAADI)", study: "sa000023", sampleSet: "snd10095", counts: {R5:3} },
    { cohort: "Puerto Rican Alzheimer's Disease Initiative (PRADI)", study: "sa000001", sampleSet: "snd10031", counts: {R4:738,R5:738} },
    { cohort: "Cuban American Alzheimer's Disease Initiative (CuAADI)", study: "sa000001", sampleSet: "snd10031", counts: {R4:97,R5:97} },
    { cohort: "Cuban American Alzheimer's Disease Initiative (CuAADI)", study: "sa000001", sampleSet: "snd10094", counts: {R5:24} },
    { cohort: "Peru Alzheimer's Disease Initiative (PeADI)", study: "sa000001", sampleSet: "snd10031", counts: {R4:247,R5:247} },
    { cohort: "Peru Alzheimer's Disease Initiative (PeADI)", study: "sa000001", sampleSet: "snd10094", counts: {R5:246} },
    { cohort: "Case Western Reserve University (CWRU) Rapid Decline Cohort", study: "sa000001", sampleSet: "snd10031", counts: {R4:171,R5:171} },
    { cohort: "Case Western Reserve University (CWRU) Rapid Decline Cohort", study: "sa000001", sampleSet: "snd10094", counts: {R5:65} },
    { cohort: "Multi-Institutional Research in Alzheimer's Genetic Epidemiology (MIRAGE)", study: "sa000001", sampleSet: "snd10000", counts: {R2:330} },
    { cohort: "Multi-Institutional Research in Alzheimer's Genetic Epidemiology (MIRAGE)", study: "sa000003", sampleSet: "snd10003", counts: {R2:223} },
    { cohort: "Northern Manhattan Study (NOMAS)", study: "sa000001", sampleSet: "snd10031", counts: {R4:777,R5:777} },
    { cohort: "Northern Manhattan Study (NOMAS)", study: "sa000001", sampleSet: "snd10094", counts: {R5:30} },
    { cohort: "University of Pittsburgh ADRC- Kamboh", study: "sa000012", sampleSet: "snd10012", counts: {R3:209,R4:209,R5:209} },
    { cohort: "University of Pittsburgh ADRC- Kamboh", study: "sa000012", sampleSet: "snd10091", counts: {R5:207} },
    { cohort: "University of Pittsburgh ADRC- Kamboh", study: "sa000059", sampleSet: "snd10100", counts: {R5:125} },
    { cohort: "Puerto Rican 10/66 Study (PR1066)", study: "sa000001", sampleSet: "snd10020", counts: {R3:1517,R4:1517,R5:1517} },
    { cohort: "Stanford Extreme Phenotypes in AD (StEP-AD)", study: "sa000001", sampleSet: "snd10020", counts: {R3:193,R4:193,R5:193} },
    { cohort: "Stanford Extreme Phenotypes in AD (StEP-AD)", study: "sa000001", sampleSet: "snd10031", counts: {R4:2,R5:2} },
    { cohort: "Texas Alzheimer's Research and Care Consortium (TARCC)", study: "sa000001", sampleSet: "snd10000", counts: {R2:144} },
    { cohort: "Texas Alzheimer's Research and Care Consortium (TARCC)", study: "sa000003", sampleSet: "snd10030", counts: {R4:1017,R5:1017} },
    { cohort: "University of Toronto", study: "sa000001", sampleSet: "snd10000", counts: {R2:9} },
    { cohort: "Washington Heights-Inwood Columbia Aging Project (WHICAP)", study: "sa000007", sampleSet: "snd10007", counts: {R2:3858} },
    { cohort: "Washington Heights-Inwood Columbia Aging Project (WHICAP)", study: "sa000001", sampleSet: "snd10000", counts: {R2:130} },
    { cohort: "Washington Heights-Inwood Columbia Aging Project (WHICAP)", study: "sa000007", sampleSet: "snd10106", counts: {R5:232} },
    { cohort: "Washington Heights-Inwood Columbia Aging Project (WHICAP)", study: "sa000001", sampleSet: "snd10001", counts: {R1:589,R3:589,R4:589,R5:589} },
    { cohort: "Atherosclerosis Risk in Communities (ARIC)", study: "sa000001", sampleSet: "snd10000", counts: {R2:57} },
    { cohort: "Cardiovascular Health Study (CHS)", study: "sa000001", sampleSet: "snd10000", counts: {R2:766} },
    { cohort: "Framingham Heart Study (FHS)", study: "sa000001", sampleSet: "snd10000", counts: {R2:577} },
    { cohort: "Rotterdam Study (RS)", study: "sa000001", sampleSet: "snd10000", counts: {R2:1087} },
    { cohort: "Cache County Study", study: "sa000014", sampleSet: "snd10014", counts: {R3:207,R4:207,R5:207} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000008", sampleSet: "snd10019", counts: {R3:77,R4:77,R5:77} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000008", sampleSet: "snd10008", counts: {R2:650} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000023", sampleSet: "snd10032", counts: {R4:580,R5:580} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000059", sampleSet: "snd10098", counts: {R5:1070} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000004", sampleSet: "snd10101", counts: {R5:89} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000013", sampleSet: "snd10103", counts: {R5:10} },
    { cohort: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", study: "sa000023", sampleSet: "snd10095", counts: {R5:7} },
    { cohort: "Harmonized Diagnostic Assessment of Dementia for the Longitudinal Aging Study of India (LASI-DAD)", study: "sa000019", sampleSet: "snd10033", counts: {R4:2682,R5:2682} },
    { cohort: "Mount Sinai Brain Bank", study: "sa000011", sampleSet: "snd10011", counts: {R3:344,R4:344,R5:344} },
    { cohort: "Gwangju Alzheimer's and Related Dementia (GARD)", study: "sa000056", sampleSet: "snd10092", counts: {R5:1995} },
    { cohort: "ASPrin in Reducing Events in the Elderly (ASPREE)", study: "sa000060", sampleSet: "snd10093", counts: {R5:2735} },
    { cohort: "ASPrin in Reducing Events in the Elderly (ASPREE)", study: "sa000001", sampleSet: "snd10094", counts: {R5:332} },
    { cohort: "Cardiff EOAD", study: "sa000023", sampleSet: "snd10095", counts: {R5:395} },
    { cohort: "A4 Study (A4)", study: "sa000001", sampleSet: "snd10094", counts: {R5:3345} },
    { cohort: "Center for Cognitive Neuroscience and Aging (CNSA)", study: "sa000001", sampleSet: "snd10094", counts: {R5:271} },
    { cohort: "Healthy Elderly Active Longevity (HEAL) Cohort \"Wellderly\"", study: "sa000057", sampleSet: "snd10096", counts: {R5:1147} },
    { cohort: "Korean Brain Aging Study for the Early Diagnosis and Prediction of AD (KBASE)", study: "sa000001", sampleSet: "snd10094", counts: {R5:603} },
    { cohort: "Arizona APOE Cohort Study", study: "sa000058", sampleSet: "snd10097", counts: {R5:88} },
    { cohort: "The University of Alabama Birmingham Alzheimer's Disease Research Center (UAB_ADRC)", study: "sa000036", sampleSet: "snd10099", counts: {R5:17} },
    { cohort: "Brain Amyloid Cognitive Normal Elders Study (BACNE)", study: "sa000059", sampleSet: "snd10100", counts: {R5:129} },
    { cohort: "The Ginkgo Evaluation of Memory Study (GEMS)", study: "sa000059", sampleSet: "snd10100", counts: {R5:161} },
    { cohort: "Human Connectome Project (HCP)", study: "sa000059", sampleSet: "snd10100", counts: {R5:189} },
    { cohort: "Heart SCORE (HS)", study: "sa000059", sampleSet: "snd10100", counts: {R5:133} },
    { cohort: "The Monongahela-Youghiogheny Healthy Aging Team study (MYHAT)", study: "sa000059", sampleSet: "snd10100", counts: {R5:61} },
    { cohort: "Health and Aging Brain Study - Health Disparities (HABS-HD)", study: "sa000061", sampleSet: "snd10102", counts: {R5:1359} },
    { cohort: "Alzheimer's Disease Neuroimaging Initiative (ADNI)", study: "sa000002", sampleSet: "snd10002", counts: {R1:808,R3:808,R4:808,R5:808} },
    { cohort: "Alzheimer's Disease Neuroimaging Initiative (ADNI)", study: "sa000001", sampleSet: "snd10020", counts: {R3:757,R4:757,R5:757} },
    { cohort: "Alzheimer's Disease Neuroimaging Initiative (ADNI)", study: "sa000001", sampleSet: "snd10094", counts: {R5:603} },
    { cohort: "Corticobasal Degeneration Study (CBD)", study: "sa000009", sampleSet: "snd10009", counts: {R2:346} },
    { cohort: "Corticobasal Degeneration Study (CBD)", study: "sa000010", sampleSet: "snd10010", counts: {R2:1} },
    { cohort: "Progressive Supranuclear Palsy Study (PSP)", study: "sa000016", sampleSet: "snd10016", counts: {R3:886,R4:886,R5:886} },
    { cohort: "Progressive Supranuclear Palsy Study (PSP)", study: "sa000015", sampleSet: "snd10015", counts: {R3:615,R4:615,R5:615} },
    { cohort: "Progressive Supranuclear Palsy Study (PSP)", study: "sa000010", sampleSet: "snd10010", counts: {R2:549} },
    { cohort: "Progressive Supranuclear Palsy Study (PSP)", study: "sa000011", sampleSet: "snd10011", counts: {R3:83,R4:83,R5:83} },
    { cohort: "Progressive Supranuclear Palsy Study - UCLA (PSP-UCLA)", study: "sa000017", sampleSet: "snd10017", counts: {R3:408,R4:408,R5:408} },
  ],

  /* --------------------------------------------------------------------------
     COMPOSITION — GENERATED from sample_list_ex.xlsx, same release membership
     as sampleSets. Codebook supplied by team:
       Sex 0=Male 1=Female · Race 1–6, 9=NA · Ethnicity 0/1, NA · APOE_reported.
     "#N/A", "NA" and 9 are grouped as Not Applicable / Not Available.
     Diagnosis_harmonized case variants merged (AD_case → AD case, etc.).
     -------------------------------------------------------------------------- */
  /* Cross-tab counts for "Compare with". Key "<dimA>|<dimB>" (either order works).
     Shape: { R1: { "<A category>": { "<B category>": count, ... }, ... }, R2: ... }
     Pre-aggregate from the ALL phenotype file (subject-level data never ships to the browser).
     Pairs not listed show a "not yet generated" notice with a Gen3 link.
     GENERATED from sample_list_ex.xlsx, same membership as composition (marginals verified).
     Exact counts (no small-cell suppression, per team). */
  compositionCross: {"sex|race":{"R1":{"Male":{"Black or African American":307,"Other":421,"White":1080,"Not Applicable / Not Available":1,"Asian":7,"American Indian / Alaska Native":2},"Female":{"Other":921,"White":1271,"Black or African American":766,"American Indian / Alaska Native":2,"Not Applicable / Not Available":3,"Native Hawaiian or Other Pacific Islander":2,"Asian":3}},"R2":{"Female":{"Other":1473,"White":8052,"Black or African American":3074,"American Indian / Alaska Native":4,"Asian":1},"Male":{"White":6001,"Other":642,"American Indian / Alaska Native":2,"Black or African American":1249,"Asian":1}},"R3":{"Male":{"Black or African American":830,"Other":928,"White":4881,"Not Applicable / Not Available":10,"American Indian / Alaska Native":5,"Asian":29},"Female":{"Other":1981,"White":5913,"Black or African American":2268,"American Indian / Alaska Native":13,"Not Applicable / Not Available":21,"Asian":21,"Native Hawaiian or Other Pacific Islander":3}},"R4":{"Male":{"Black or African American":1574,"Other":1634,"White":8478,"Not Applicable / Not Available":1067,"American Indian / Alaska Native":60,"Asian":1346},"Female":{"Other":3388,"White":11438,"Black or African American":4159,"American Indian / Alaska Native":95,"Not Applicable / Not Available":1594,"Asian":1511,"Native Hawaiian or Other Pacific Islander":5}},"R5":{"Male":{"Black or African American":2131,"Other":2704,"White":14521,"Not Applicable / Not Available":1110,"American Indian / Alaska Native":70,"Native Hawaiian or Other Pacific Islander":3,"Asian":2580},"Female":{"Other":5212,"White":19825,"Black or African American":5536,"American Indian / Alaska Native":112,"Not Applicable / Not Available":1674,"Native Hawaiian or Other Pacific Islander":12,"Asian":3017}}},"sex|ethnicity":{"R1":{"Male":{"Hispanic or Latino":525,"Not Applicable / Not Available":20,"Not Hispanic or Latino":1273},"Female":{"Hispanic or Latino":1085,"Not Hispanic or Latino":1849,"Not Applicable / Not Available":34}},"R2":{"Female":{"Hispanic or Latino":1556,"Not Hispanic or Latino":10432,"Not Applicable / Not Available":616},"Male":{"Hispanic or Latino":673,"Not Hispanic or Latino":6540,"Not Applicable / Not Available":682}},"R3":{"Male":{"Hispanic or Latino":1064,"Not Applicable / Not Available":1142,"Not Hispanic or Latino":4477},"Female":{"Hispanic or Latino":2223,"Not Hispanic or Latino":7022,"Not Applicable / Not Available":975}},"R4":{"Male":{"Hispanic or Latino":3914,"Not Applicable / Not Available":1413,"Not Hispanic or Latino":8832},"Female":{"Hispanic or Latino":7438,"Not Hispanic or Latino":13450,"Not Applicable / Not Available":1302}},"R5":{"Male":{"Hispanic or Latino":5493,"Not Applicable / Not Available":1990,"Not Hispanic or Latino":15636},"Female":{"Hispanic or Latino":10293,"Not Hispanic or Latino":22915,"Not Applicable / Not Available":2180}}},"sex|apoe":{"R1":{"Male":{"ε4/ε4":115,"ε3/ε4":557,"ε2/ε4":36,"ε3/ε3":939,"ε2/ε3":165,"ε2/ε2":6},"Female":{"ε3/ε4":887,"ε3/ε3":1551,"ε2/ε3":301,"ε4/ε4":131,"ε2/ε4":80,"ε2/ε2":13,"Not Applicable / Not Available":5}},"R2":{"Female":{"ε2/ε3":1380,"ε3/ε3":6504,"ε3/ε4":3445,"ε4/ε4":436,"ε2/ε4":328,"ε2/ε2":75,"Not Applicable / Not Available":436},"Male":{"ε3/ε3":3845,"ε3/ε4":2196,"ε4/ε4":284,"ε2/ε4":180,"ε2/ε3":830,"ε2/ε2":49,"Not Applicable / Not Available":511}},"R3":{"Male":{"ε4/ε4":351,"ε3/ε4":1909,"ε2/ε4":85,"ε3/ε3":2735,"ε2/ε3":321,"ε2/ε2":15,"Not Applicable / Not Available":1267},"Female":{"ε3/ε4":3111,"ε3/ε3":4530,"ε2/ε3":666,"ε4/ε4":456,"ε2/ε4":212,"ε2/ε2":35,"Not Applicable / Not Available":1210}},"R4":{"Male":{"ε4/ε4":766,"ε3/ε4":3446,"ε2/ε4":205,"ε3/ε3":5477,"ε2/ε3":717,"ε2/ε2":28,"Not Applicable / Not Available":3520},"Female":{"ε3/ε4":5766,"ε3/ε3":9309,"ε2/ε3":1395,"ε4/ε4":1048,"ε2/ε4":384,"ε2/ε2":69,"Not Applicable / Not Available":4219}},"R5":{"Male":{"ε4/ε4":1318,"ε3/ε4":6040,"ε2/ε4":400,"ε3/ε3":9634,"ε2/ε3":1570,"Not Applicable / Not Available":4081,"ε2/ε2":76},"Female":{"ε3/ε4":9539,"ε3/ε3":15571,"ε2/ε3":2481,"ε4/ε4":1880,"ε2/ε4":711,"ε2/ε2":128,"Not Applicable / Not Available":5078}}},"sex|diagnosis":{"R1":{"Male":{"Not Applicable / Not Available":410,"AD case":774,"AD control":634},"Female":{"Not Applicable / Not Available":425,"AD case":1257,"AD control":1286}},"R2":{"Female":{"AD control":5949,"AD case":4772,"Not Applicable / Not Available":1478,"CBD case":156,"PSP case":249},"Male":{"AD control":3416,"AD case":2759,"Not Applicable / Not Available":1229,"CBD case":191,"PSP case":300}},"R3":{"Male":{"Not Applicable / Not Available":1268,"AD case":2238,"AD control":2074,"PSP case":1044,"PSP control":59},"Female":{"Not Applicable / Not Available":1601,"AD case":3521,"AD control":4209,"PSP case":820,"PSP control":69}},"R4":{"Male":{"Not Applicable / Not Available":2692,"AD case":4220,"AD control":6144,"PSP case":1044,"PSP control":59},"Female":{"Not Applicable / Not Available":3812,"AD case":6597,"AD control":10892,"PSP case":820,"PSP control":69}},"R5":{"Male":{"Not Applicable / Not Available":4764,"AD case":6025,"AD control":11227,"PSP case":1044,"PSP control":59},"Female":{"Not Applicable / Not Available":6945,"AD case":9234,"AD control":18320,"PSP case":820,"PSP control":69}}},"race|ethnicity":{"R1":{"Black or African American":{"Hispanic or Latino":37,"Not Hispanic or Latino":1036},"Other":{"Hispanic or Latino":1335,"Not Hispanic or Latino":7},"White":{"Hispanic or Latino":238,"Not Hispanic or Latino":2063,"Not Applicable / Not Available":50},"Not Applicable / Not Available":{"Not Applicable / Not Available":4},"American Indian / Alaska Native":{"Not Hispanic or Latino":4},"Native Hawaiian or Other Pacific Islander":{"Not Hispanic or Latino":2},"Asian":{"Not Hispanic or Latino":10}},"R2":{"Other":{"Hispanic or Latino":2057,"Not Hispanic or Latino":57,"Not Applicable / Not Available":1},"White":{"Hispanic or Latino":149,"Not Hispanic or Latino":12662,"Not Applicable / Not Available":1242},"Black or African American":{"Not Hispanic or Latino":4246,"Hispanic or Latino":22,"Not Applicable / Not Available":55},"American Indian / Alaska Native":{"Not Hispanic or Latino":5,"Hispanic or Latino":1},"Asian":{"Not Hispanic or Latino":2}},"R3":{"Black or African American":{"Hispanic or Latino":76,"Not Hispanic or Latino":2981,"Not Applicable / Not Available":41},"Other":{"Hispanic or Latino":2892,"Not Hispanic or Latino":12,"Not Applicable / Not Available":5},"White":{"Hispanic or Latino":315,"Not Hispanic or Latino":8431,"Not Applicable / Not Available":2048},"Not Applicable / Not Available":{"Not Applicable / Not Available":22,"Not Hispanic or Latino":8,"Hispanic or Latino":1},"American Indian / Alaska Native":{"Not Hispanic or Latino":15,"Hispanic or Latino":3},"Asian":{"Not Hispanic or Latino":49,"Not Applicable / Not Available":1},"Native Hawaiian or Other Pacific Islander":{"Not Hispanic or Latino":3}},"R4":{"Black or African American":{"Hispanic or Latino":310,"Not Hispanic or Latino":5297,"Not Applicable / Not Available":126},"Other":{"Hispanic or Latino":4965,"Not Hispanic or Latino":29,"Not Applicable / Not Available":28},"White":{"Hispanic or Latino":3343,"Not Hispanic or Latino":14048,"Not Applicable / Not Available":2525},"Not Applicable / Not Available":{"Not Applicable / Not Available":24,"Not Hispanic or Latino":13,"Hispanic or Latino":2624},"American Indian / Alaska Native":{"Not Hispanic or Latino":95,"Not Applicable / Not Available":7,"Hispanic or Latino":53},"Asian":{"Not Hispanic or Latino":2797,"Not Applicable / Not Available":5,"Hispanic or Latino":55},"Native Hawaiian or Other Pacific Islander":{"Hispanic or Latino":2,"Not Hispanic or Latino":3}},"R5":{"Black or African American":{"Hispanic or Latino":535,"Not Hispanic or Latino":6981,"Not Applicable / Not Available":151},"Other":{"Hispanic or Latino":7807,"Not Applicable / Not Available":49,"Not Hispanic or Latino":60},"White":{"Hispanic or Latino":4629,"Not Hispanic or Latino":25831,"Not Applicable / Not Available":3886},"Not Applicable / Not Available":{"Not Applicable / Not Available":57,"Hispanic or Latino":2688,"Not Hispanic or Latino":39},"American Indian / Alaska Native":{"Not Hispanic or Latino":113,"Not Applicable / Not Available":8,"Hispanic or Latino":61},"Native Hawaiian or Other Pacific Islander":{"Hispanic or Latino":9,"Not Hispanic or Latino":6},"Asian":{"Not Hispanic or Latino":5521,"Not Applicable / Not Available":19,"Hispanic or Latino":57}}},"race|apoe":{"R1":{"Black or African American":{"ε4/ε4":65,"ε3/ε4":351,"ε3/ε3":450,"ε2/ε3":150,"ε2/ε4":46,"ε2/ε2":11},"Other":{"ε3/ε4":321,"ε3/ε3":812,"ε2/ε4":20,"ε2/ε3":143,"ε4/ε4":43,"ε2/ε2":3},"White":{"ε3/ε4":763,"ε2/ε3":173,"ε3/ε3":1218,"ε4/ε4":137,"ε2/ε4":50,"ε2/ε2":5,"Not Applicable / Not Available":5},"Not Applicable / Not Available":{"ε3/ε3":2,"ε3/ε4":2},"American Indian / Alaska Native":{"ε3/ε3":3,"ε3/ε4":1},"Native Hawaiian or Other Pacific Islander":{"ε3/ε4":1,"ε4/ε4":1},"Asian":{"ε3/ε4":5,"ε3/ε3":5}},"R2":{"Other":{"ε2/ε3":244,"ε3/ε3":1310,"ε3/ε4":481,"ε2/ε4":45,"ε2/ε2":12,"ε4/ε4":23},"White":{"ε3/ε3":7279,"ε2/ε3":1419,"ε3/ε4":3705,"ε4/ε4":399,"ε2/ε4":243,"ε2/ε2":76,"Not Applicable / Not Available":932},"Black or African American":{"ε3/ε4":1451,"ε3/ε3":1758,"ε2/ε3":547,"ε4/ε4":297,"ε2/ε4":220,"ε2/ε2":36,"Not Applicable / Not Available":14},"American Indian / Alaska Native":{"ε3/ε3":2,"ε3/ε4":3,"Not Applicable / Not Available":1},"Asian":{"ε4/ε4":1,"ε3/ε4":1}},"R3":{"Black or African American":{"ε4/ε4":225,"ε3/ε4":1050,"ε3/ε3":1234,"ε2/ε3":388,"ε2/ε4":137,"ε2/ε2":32,"Not Applicable / Not Available":32},"Other":{"ε3/ε4":619,"ε3/ε3":1801,"ε2/ε4":43,"ε2/ε3":242,"ε4/ε4":69,"ε2/ε2":7,"Not Applicable / Not Available":128},"White":{"ε3/ε4":3325,"ε2/ε3":354,"ε3/ε3":4182,"ε4/ε4":508,"ε2/ε4":117,"ε2/ε2":11,"Not Applicable / Not Available":2297},"Not Applicable / Not Available":{"ε3/ε3":9,"ε3/ε4":4,"Not Applicable / Not Available":18},"American Indian / Alaska Native":{"ε3/ε3":11,"ε3/ε4":6,"ε4/ε4":1},"Asian":{"ε3/ε3":28,"ε3/ε4":14,"Not Applicable / Not Available":2,"ε2/ε3":3,"ε4/ε4":3},"Native Hawaiian or Other Pacific Islander":{"ε3/ε4":2,"ε4/ε4":1}},"R4":{"Black or African American":{"ε4/ε4":332,"ε3/ε4":1588,"ε3/ε3":1958,"ε2/ε3":593,"ε2/ε4":202,"ε2/ε2":49,"Not Applicable / Not Available":1011},"Other":{"ε3/ε4":1212,"ε3/ε3":2995,"ε2/ε4":88,"ε2/ε3":402,"ε4/ε4":177,"ε2/ε2":12,"Not Applicable / Not Available":136},"White":{"ε3/ε4":6086,"ε2/ε3":1039,"ε3/ε3":8723,"ε4/ε4":1259,"ε2/ε4":288,"ε2/ε2":34,"Not Applicable / Not Available":2487},"Not Applicable / Not Available":{"ε3/ε3":935,"ε3/ε4":231,"ε2/ε4":5,"Not Applicable / Not Available":1419,"ε2/ε3":58,"ε4/ε4":11,"ε2/ε2":2},"American Indian / Alaska Native":{"ε3/ε3":77,"ε3/ε4":46,"ε2/ε3":8,"ε4/ε4":20,"ε2/ε4":2,"Not Applicable / Not Available":2},"Asian":{"ε3/ε3":97,"ε3/ε4":47,"ε4/ε4":14,"ε2/ε4":4,"ε2/ε3":11,"Not Applicable / Not Available":2684},"Native Hawaiian or Other Pacific Islander":{"ε3/ε3":1,"ε2/ε3":1,"ε3/ε4":2,"ε4/ε4":1}},"R5":{"Black or African American":{"ε4/ε4":454,"ε3/ε4":2222,"ε3/ε3":2758,"ε2/ε3":858,"Not Applicable / Not Available":1031,"ε2/ε4":276,"ε2/ε2":68},"Other":{"ε3/ε4":2114,"ε3/ε3":4376,"ε2/ε4":172,"ε2/ε3":630,"ε4/ε4":380,"ε2/ε2":33,"Not Applicable / Not Available":211},"White":{"ε3/ε4":10005,"ε2/ε3":2269,"ε3/ε3":15423,"ε4/ε4":2182,"ε2/ε4":597,"ε2/ε2":94,"Not Applicable / Not Available":3776},"Not Applicable / Not Available":{"ε3/ε3":997,"ε3/ε4":256,"Not Applicable / Not Available":1441,"ε2/ε4":7,"ε2/ε3":65,"ε4/ε4":15,"ε2/ε2":3},"American Indian / Alaska Native":{"ε3/ε3":89,"ε3/ε4":59,"ε2/ε3":9,"ε4/ε4":21,"ε2/ε4":2,"Not Applicable / Not Available":2},"Native Hawaiian or Other Pacific Islander":{"ε4/ε4":3,"ε3/ε4":5,"ε2/ε3":4,"ε3/ε3":3},"Asian":{"ε3/ε4":918,"ε2/ε4":57,"ε2/ε3":216,"ε4/ε4":143,"ε3/ε3":1559,"Not Applicable / Not Available":2698,"ε2/ε2":6}}},"race|diagnosis":{"R1":{"Black or African American":{"Not Applicable / Not Available":132,"AD case":441,"AD control":500},"Other":{"AD case":646,"Not Applicable / Not Available":58,"AD control":638},"White":{"AD control":774,"AD case":939,"Not Applicable / Not Available":638},"Not Applicable / Not Available":{"AD control":4},"American Indian / Alaska Native":{"AD control":2,"AD case":1,"Not Applicable / Not Available":1},"Native Hawaiian or Other Pacific Islander":{"Not Applicable / Not Available":2},"Asian":{"AD case":4,"AD control":2,"Not Applicable / Not Available":4}},"R2":{"Other":{"AD control":1417,"AD case":633,"Not Applicable / Not Available":65},"White":{"AD control":5508,"AD case":5468,"Not Applicable / Not Available":2181,"CBD case":347,"PSP case":549},"Black or African American":{"AD case":1426,"Not Applicable / Not Available":460,"AD control":2437},"American Indian / Alaska Native":{"AD case":3,"AD control":2,"Not Applicable / Not Available":1},"Asian":{"AD case":1,"AD control":1}},"R3":{"Black or African American":{"Not Applicable / Not Available":360,"AD case":1130,"AD control":1608},"Other":{"AD case":812,"Not Applicable / Not Available":238,"AD control":1854,"PSP case":5},"White":{"AD control":2793,"AD case":3781,"Not Applicable / Not Available":2251,"PSP case":1841,"PSP control":128},"Not Applicable / Not Available":{"AD control":11,"AD case":2,"Not Applicable / Not Available":1,"PSP case":17},"American Indian / Alaska Native":{"AD control":6,"AD case":9,"Not Applicable / Not Available":3},"Asian":{"Not Applicable / Not Available":13,"AD case":25,"AD control":11,"PSP case":1},"Native Hawaiian or Other Pacific Islander":{"Not Applicable / Not Available":3}},"R4":{"Black or African American":{"Not Applicable / Not Available":975,"AD case":1528,"AD control":3230},"Other":{"AD case":1739,"Not Applicable / Not Available":666,"AD control":2612,"PSP case":5},"White":{"AD control":6231,"AD case":7121,"Not Applicable / Not Available":4595,"PSP case":1841,"PSP control":128},"Not Applicable / Not Available":{"AD control":2366,"AD case":276,"Not Applicable / Not Available":2,"PSP case":17},"American Indian / Alaska Native":{"AD control":51,"AD case":69,"Not Applicable / Not Available":35},"Asian":{"Not Applicable / Not Available":228,"AD case":84,"AD control":2544,"PSP case":1},"Native Hawaiian or Other Pacific Islander":{"AD control":2,"Not Applicable / Not Available":3}},"R5":{"Black or African American":{"Not Applicable / Not Available":1781,"AD case":1747,"AD control":4139},"Other":{"AD case":2502,"Not Applicable / Not Available":1128,"AD control":4281,"PSP case":5},"White":{"AD control":14655,"AD case":9612,"Not Applicable / Not Available":8110,"PSP case":1841,"PSP control":128},"Not Applicable / Not Available":{"AD control":2416,"AD case":285,"Not Applicable / Not Available":66,"PSP case":17},"American Indian / Alaska Native":{"AD control":63,"AD case":75,"Not Applicable / Not Available":44},"Native Hawaiian or Other Pacific Islander":{"AD case":2,"AD control":10,"Not Applicable / Not Available":3},"Asian":{"AD case":1036,"AD control":3983,"Not Applicable / Not Available":577,"PSP case":1}}},"ethnicity|apoe":{"R1":{"Hispanic or Latino":{"ε4/ε4":49,"ε3/ε4":392,"ε3/ε3":983,"ε2/ε4":20,"ε2/ε3":163,"ε2/ε2":3},"Not Applicable / Not Available":{"ε3/ε3":23,"ε3/ε4":30,"ε2/ε3":1},"Not Hispanic or Latino":{"ε3/ε3":1484,"ε2/ε3":302,"ε3/ε4":1022,"ε2/ε4":96,"ε4/ε4":197,"ε2/ε2":16,"Not Applicable / Not Available":5}},"R2":{"Hispanic or Latino":{"ε2/ε3":245,"ε3/ε3":1368,"ε3/ε4":527,"ε2/ε4":47,"ε4/ε4":27,"ε2/ε2":14,"Not Applicable / Not Available":1},"Not Hispanic or Latino":{"ε3/ε3":8799,"ε2/ε3":1936,"ε3/ε4":4986,"ε4/ε4":666,"ε2/ε4":453,"ε2/ε2":108,"Not Applicable / Not Available":24},"Not Applicable / Not Available":{"ε3/ε3":182,"ε3/ε4":128,"ε2/ε3":29,"ε4/ε4":27,"Not Applicable / Not Available":922,"ε2/ε4":8,"ε2/ε2":2}},"R3":{"Hispanic or Latino":{"ε4/ε4":81,"ε3/ε4":733,"ε3/ε3":2033,"ε2/ε4":43,"ε2/ε3":267,"ε2/ε2":7,"Not Applicable / Not Available":123},"Not Applicable / Not Available":{"ε3/ε3":38,"ε3/ε4":71,"ε2/ε3":5,"ε2/ε4":2,"ε4/ε4":7,"ε2/ε2":1,"Not Applicable / Not Available":1993},"Not Hispanic or Latino":{"ε3/ε3":5194,"ε2/ε3":715,"ε3/ε4":4216,"ε2/ε4":252,"ε4/ε4":719,"ε2/ε2":42,"Not Applicable / Not Available":361}},"R4":{"Hispanic or Latino":{"ε4/ε4":305,"ε3/ε4":2354,"ε3/ε3":6300,"ε2/ε4":126,"ε2/ε3":712,"ε2/ε2":17,"Not Applicable / Not Available":1538},"Not Applicable / Not Available":{"ε3/ε3":299,"ε3/ε4":279,"ε2/ε3":48,"ε4/ε4":66,"ε2/ε4":19,"Not Applicable / Not Available":2001,"ε2/ε2":3},"Not Hispanic or Latino":{"ε3/ε3":8187,"ε2/ε3":1352,"ε3/ε4":6579,"ε2/ε4":444,"ε4/ε4":1443,"ε2/ε2":77,"Not Applicable / Not Available":4200}},"R5":{"Hispanic or Latino":{"ε4/ε4":600,"ε3/ε4":3614,"ε3/ε3":8611,"ε2/ε4":228,"ε2/ε3":1054,"Not Applicable / Not Available":1633,"ε2/ε2":46},"Not Applicable / Not Available":{"ε3/ε3":428,"ε3/ε4":391,"ε2/ε3":73,"ε4/ε4":94,"Not Applicable / Not Available":3152,"ε2/ε4":27,"ε2/ε2":5},"Not Hispanic or Latino":{"ε3/ε3":16166,"ε2/ε3":2924,"ε3/ε4":11574,"ε2/ε4":856,"ε4/ε4":2504,"ε2/ε2":153,"Not Applicable / Not Available":4374}}},"ethnicity|diagnosis":{"R1":{"Hispanic or Latino":{"Not Applicable / Not Available":83,"AD case":807,"AD control":720},"Not Applicable / Not Available":{"AD control":12,"AD case":41,"Not Applicable / Not Available":1},"Not Hispanic or Latino":{"AD case":1183,"AD control":1188,"Not Applicable / Not Available":751}},"R2":{"Hispanic or Latino":{"AD control":1397,"AD case":761,"Not Applicable / Not Available":71},"Not Hispanic or Latino":{"AD case":6498,"AD control":7886,"Not Applicable / Not Available":2588},"Not Applicable / Not Available":{"AD case":272,"AD control":82,"Not Applicable / Not Available":48,"CBD case":347,"PSP case":549}},"R3":{"Hispanic or Latino":{"Not Applicable / Not Available":293,"AD case":1021,"AD control":1973},"Not Applicable / Not Available":{"AD control":22,"AD case":93,"Not Applicable / Not Available":10,"PSP case":1864,"PSP control":128},"Not Hispanic or Latino":{"AD case":4645,"AD control":4288,"Not Applicable / Not Available":2566}},"R4":{"Hispanic or Latino":{"Not Applicable / Not Available":1705,"AD case":3128,"AD control":6519},"Not Applicable / Not Available":{"AD control":168,"AD case":486,"Not Applicable / Not Available":69,"PSP case":1864,"PSP control":128},"Not Hispanic or Latino":{"AD case":7203,"AD control":10349,"Not Applicable / Not Available":4730}},"R5":{"Hispanic or Latino":{"Not Applicable / Not Available":2961,"AD case":4089,"AD control":8736},"Not Applicable / Not Available":{"AD control":256,"AD case":661,"Not Applicable / Not Available":1261,"PSP case":1864,"PSP control":128},"Not Hispanic or Latino":{"AD case":10509,"AD control":20555,"Not Applicable / Not Available":7487}}},"apoe|diagnosis":{"R1":{"ε4/ε4":{"Not Applicable / Not Available":57,"AD case":168,"AD control":21},"ε3/ε4":{"AD case":757,"Not Applicable / Not Available":268,"AD control":419},"ε3/ε3":{"AD case":908,"AD control":1162,"Not Applicable / Not Available":420},"ε2/ε4":{"AD case":47,"AD control":44,"Not Applicable / Not Available":25},"ε2/ε3":{"AD case":144,"AD control":261,"Not Applicable / Not Available":61},"ε2/ε2":{"AD control":9,"AD case":7,"Not Applicable / Not Available":3},"Not Applicable / Not Available":{"Not Applicable / Not Available":1,"AD control":4}},"R2":{"ε2/ε3":{"AD control":1476,"AD case":510,"Not Applicable / Not Available":224},"ε3/ε3":{"AD control":5647,"AD case":3504,"Not Applicable / Not Available":1198},"ε3/ε4":{"AD control":1814,"Not Applicable / Not Available":1021,"AD case":2806},"ε4/ε4":{"AD case":470,"Not Applicable / Not Available":136,"AD control":114},"ε2/ε4":{"AD case":201,"AD control":226,"Not Applicable / Not Available":81},"ε2/ε2":{"AD case":29,"Not Applicable / Not Available":15,"AD control":80},"Not Applicable / Not Available":{"Not Applicable / Not Available":32,"AD case":11,"AD control":8,"CBD case":347,"PSP case":549}},"R3":{"ε4/ε4":{"Not Applicable / Not Available":177,"AD case":475,"AD control":155},"ε3/ε4":{"AD case":2203,"Not Applicable / Not Available":1141,"AD control":1676},"ε3/ε3":{"AD case":2437,"AD control":3517,"Not Applicable / Not Available":1311},"ε2/ε4":{"AD case":108,"AD control":121,"Not Applicable / Not Available":68},"ε2/ε3":{"AD case":263,"AD control":600,"Not Applicable / Not Available":124},"ε2/ε2":{"AD control":34,"AD case":12,"Not Applicable / Not Available":4},"Not Applicable / Not Available":{"Not Applicable / Not Available":44,"AD control":180,"AD case":261,"PSP case":1864,"PSP control":128}},"R4":{"ε4/ε4":{"Not Applicable / Not Available":382,"AD case":1133,"AD control":299},"ε3/ε4":{"AD case":4091,"Not Applicable / Not Available":2093,"AD control":3028},"ε3/ε3":{"AD case":4270,"AD control":7510,"Not Applicable / Not Available":3006},"ε2/ε4":{"AD case":204,"AD control":236,"Not Applicable / Not Available":149},"ε2/ε3":{"AD case":486,"AD control":1255,"Not Applicable / Not Available":371},"ε2/ε2":{"AD control":64,"AD case":21,"Not Applicable / Not Available":12},"Not Applicable / Not Available":{"Not Applicable / Not Available":491,"AD control":4644,"AD case":612,"PSP case":1864,"PSP control":128}},"R5":{"ε4/ε4":{"Not Applicable / Not Available":649,"AD case":1803,"AD control":746},"ε3/ε4":{"AD case":5874,"Not Applicable / Not Available":3341,"AD control":6364},"ε3/ε3":{"AD case":5849,"AD control":14341,"Not Applicable / Not Available":5015},"ε2/ε4":{"AD case":299,"AD control":558,"Not Applicable / Not Available":254},"ε2/ε3":{"AD case":691,"AD control":2629,"Not Applicable / Not Available":731},"ε2/ε2":{"AD control":145,"AD case":27,"Not Applicable / Not Available":32},"Not Applicable / Not Available":{"AD control":4764,"Not Applicable / Not Available":1687,"AD case":716,"PSP case":1864,"PSP control":128}}}},

  composition: {
    sex: {
      label: "Sex", sourceField: "Sex",
      categories: ["Male","Female","Not Applicable / Not Available"],
      counts: {
        R1: [1818,2968,0],
        R2: [7895,12604,0],
        R3: [6683,10220,0],
        R4: [14159,22190,0],
        R5: [23119,35388,0],
      },
    },
    race: {
      label: "Reported Race", sourceField: "Race",
      categories: ["American Indian / Alaska Native","Asian","Native Hawaiian or Other Pacific Islander","Black or African American","White","Other","Not Applicable / Not Available"],
      counts: {
        R1: [4,10,2,1073,2351,1342,4],
        R2: [6,2,0,4323,14053,2115,0],
        R3: [18,50,3,3098,10794,2909,31],
        R4: [155,2857,5,5733,19916,5022,2661],
        R5: [182,5597,15,7667,34346,7916,2784],
      },
    },
    ethnicity: {
      label: "Reported Ethnicity", sourceField: "Ethnicity",
      categories: ["Not Hispanic or Latino","Hispanic or Latino","Not Applicable / Not Available"],
      counts: {
        R1: [3122,1610,54],
        R2: [16972,2229,1298],
        R3: [11499,3287,2117],
        R4: [22282,11352,2715],
        R5: [38551,15786,4170],
      },
    },
    apoe: {
      label: "APOE Genotype", sourceField: "APOE_reported",
      categories: ["ε2/ε2","ε2/ε3","ε2/ε4","ε3/ε3","ε3/ε4","ε4/ε4","Not Applicable / Not Available"],
      counts: {
        R1: [19,466,116,2490,1444,246,5],
        R2: [124,2210,508,10349,5641,720,947],
        R3: [50,987,297,7265,5020,807,2477],
        R4: [97,2112,589,14786,9212,1814,7739],
        R5: [204,4051,1111,25205,15579,3198,9159],
      },
    },
    diagnosis: {
      label: "Diagnosis", sourceField: "Diagnosis_harmonized",
      categories: ["AD case","AD control","CBD case","PSP case","PSP control","Not Applicable / Not Available"],
      counts: {
        R1: [2031,1920,0,0,0,835],
        R2: [7531,9365,347,549,0,2707],
        R3: [5759,6283,0,1864,128,2869],
        R4: [10817,17036,0,1864,128,6504],
        R5: [15259,29547,0,1864,128,11709],
      },
    },
  },

  /* --------------------------------------------------------------------------
     VARIANT PRODUCTS — GENERATED from pVCFReleaseTable.xlsx, one entry per row.
     productType is a grouping added for the All Releases matrix.
     -------------------------------------------------------------------------- */
  /* FILE TYPES — definitions supplied by team. QC status: Pre = gcad.preview…, Post = gcad.qc… */
  fileTypes: [
    { type: "Full",             qc: "Pre",  variantInfo: "Y", qcFlags: "N", genotype: "Complete info, raw output from caller", naming: "gcad.preview…" },
    { type: "Full",             qc: "Post", variantInfo: "Y", qcFlags: "Y", genotype: "Complete info, raw output from caller", naming: "gcad.qc…" },
    { type: "Compact",          qc: "Pre",  variantInfo: "Y", qcFlags: "N", genotype: "GT only, other info all removed", naming: "gcad.preview.compact…" },
    { type: "Compact",          qc: "Post", variantInfo: "Y", qcFlags: "Y", genotype: "GT only, other info all removed", naming: "gcad.qc.compact…" },
    { type: "Compact Filtered", qc: "Pre",  variantInfo: "Y", qcFlags: "N", genotype: "GT; genotype calls with DP<10 or GQ<20 set to missing (./.)", naming: "gcad.preview.compact_filtered…" },
    { type: "Compact Filtered", qc: "Post", variantInfo: "Y", qcFlags: "Y", genotype: "GT; genotype calls with DP<10 or GQ<20 set to missing (./.)", naming: "gcad.qc.compact_filtered…" },
  ],
  /* DATA PRODUCTS matrix (All Releases). Variant-level rows are DERIVED from
     variantProducts; these rows are hand-maintained. avail: true = available
     (evidence in release milestones), false = not available, missing = TBD.
     Replace with an authoritative per-round product list when supplied. */
  dataProductGroups: [
    { key: "individual", label: "Individual-level genomic data" },
    { key: "variant",    label: "Project-level variant data" },
    { key: "phenotype",  label: "Phenotypes" },
    { key: "resource",   label: "Analysis resources" },
  ],
  dataProducts: [
    { group: "individual", label: "CRAMs",               desc: "Aligned reads per sample",            avail: { R1: true, R2: true, R3: true, R4: true, R5: true } },
    { group: "individual", label: "gVCFs",               desc: "Per-sample genomic VCFs",             avail: { R1: true, R2: true, R3: true, R4: true, R5: true } },
    { group: "individual", label: "SV calls",            desc: "Per-sample structural variant VCFs",  avail: { R3: true, R4: true, R5: true } },
    { group: "phenotype",  label: "Basic phenotypes",    desc: "Phenotypes and pedigree",             avail: { R1: true, R2: true, R3: true, R4: true, R5: true } },
    { group: "phenotype",  label: "ADSP-PHC phenotypes", desc: "Not released with each round; available for specific cohorts with participants in each round", avail: { R1: "cohort", R2: "cohort", R3: "cohort", R4: "cohort", R5: "cohort" } },
    { group: "resource",   label: "IBD results",         desc: "Identity-by-descent",                 avail: { R1: true, R2: true, R3: true, R4: true, R5: true } },
    { group: "resource",   label: "LD reference panel",  desc: "",                                    avail: { R4: true, R5: true } },
    { group: "resource",   label: "Imputation panels",   desc: "",                                    avail: { R5: true } },
    { group: "resource",   label: "Annotation",          desc: "Variant annotation incl. FAVOR",      avail: { R4: true } },
  ],
  productTypes: ["Preview SNV/indel pVCF", "QC'd SNV/indel pVCF", "Structural variant callset", "GDS representation"],
  variantProducts: [
    {release: "R5", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GLnexus", chromosomes: "1–22, X, Y, M", variants:  "Biallelic and multiallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r5.wgs.58507.GLnexus.2024.11.03.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000116"},
    {release: "R5", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GLnexus", chromosomes: "1–22, X, Y, M", variants:  "Biallelic and multiallelic", filterType:  "Compact", filenamePattern:  "gcad.preview.compact.r5.wgs.58507.GLnexus.2024.11.03.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000116"},
    {release: "R5", productType:  "Structural variant callset", qcType:  "SV", caller:  "GraphTyper", chromosomes: "1–22", variants:  "Structural Variants", filterType:  "Full", filenamePattern:  "gcad.r5.wgs.58506.GraphTyper.2026.01.26.SV.<CHR>.<CONSENT>.vcf.gz", fileset:  "fsa000116"},
    {release: "R5", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GLnexus", chromosomes: "1–22, X", variants:  "Biallelic and multiallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r5.wgs.58506.GLnexus.2025.07.31.genotypes.<CHR>.<CONSENT>.vcf.bgz", fileset:  "fsa000116"},
    {release: "R5", productType:  "GDS representation", qcType:  "QC'ed", caller:  "GLnexus", chromosomes: "1–22, X", variants:  "Biallelic and multiallelic", filterType:  "Full (GDS Format)", filenamePattern:  "gcad.qc.r5.wgs.58506.GLnexus.2025.07.31.genotypes.<CHR>.<CONSENT>.gds", fileset:  "fsa000116"},
    {release: "R5", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GLnexus", chromosomes: "1–22, X", variants:  "Biallelic and multiallelic", filterType:  "Compact", filenamePattern:  "gcad.qc.compact.r5.wgs.58506.GLnexus.2025.07.31.genotypes.<CHR>.<CONSENT>.vcf.bgz", fileset:  "fsa000116"},
    {release: "R4", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r4.wgs.36361.GATK.2022.08.15.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Biallelic", filterType:  "Compact", filenamePattern:  "gcad.preview.compact.r4.wgs.36361.GATK.2022.08.15.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Biallelic", filterType:  "Compact Filtered", filenamePattern:  "gcad.preview.compact_filtered.r4.wgs.36361.GATK.2022.08.15.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Multiallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r4.wgs.36361.GATK.2022.08.15.multiallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Multiallelic", filterType:  "Compact", filenamePattern:  "gcad.preview.compact.r4.wgs.36361.GATK.2022.08.15.multiallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Multiallelic", filterType:  "Compact Filtered", filenamePattern:  "gcad.preview.compact_filtered.r4.wgs.36361.GATK.2022.08.15.multiallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "Structural variant callset", qcType:  "SV", caller:  "GraphTyper", chromosomes: "1–22", variants:  "Structural Variants", filterType:  "Full", filenamePattern:  "gcad.r4.wgs.36361.GraphTyper.2024.06.28.SV.<CHR><CONSENT>.vcf.gz", fileset:  "fsa000023"},
    {release: "R4", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r4.wgs.36361.GATK.2023.06.06.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "GDS representation", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22", variants:  "Biallelic", filterType:  "Full (GDS Format)", filenamePattern:  "gcad.qc.r4.wgs.36361.GATK.2022.08.15.biallelic.genotypes.<CHR><CONSENT>.gds", fileset:  "fsa000026"},
    {release: "R4", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22", variants:  "Biallelic", filterType:  "Compact Filtered", filenamePattern:  "gcad.qc.compact_filtered.r4.wgs.36361.GATK.2023.06.06.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "X", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r4.wgs.36361.GATK.2024.06.28.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "X", variants:  "Biallelic", filterType:  "Compact Filtered", filenamePattern:  "gcad.qc.compact_filtered.r4.wgs.36361.GATK.2024.06.28.biallelic.genotypes.<CHR><CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22, X", variants:  "Multiallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r4.wgs.36361.GATK.2024.06.28.multiallelic.genotypes.<CHR>.<CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R4", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22, X", variants:  "Multiallelic", filterType:  "Compact Filtered", filenamePattern:  "gcad.qc.compact_filtered.r4.wgs.36361.GATK.2024.06.28.multiallelic.genotypes.<CHR>.<CONSENT>.vcf.bgz", fileset:  "fsa000026"},
    {release: "R3", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r3.wgs.16906.GATK.2020.05.26.biallelic.genotypes.<CHR>.<CONSENT>.vcf.gz", fileset:  "fsa000006"},
    {release: "R3", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Biallelic", filterType:  "Compact", filenamePattern:  "gcad.preview.compact.r3.wgs.16906.GATK.2020.05.26.biallelic.genotypes.<CHR>.<CONSENT>.vcf.gz", fileset:  "fsa000006"},
    {release: "R3", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Biallelic", filterType:  "Compact Filtered", filenamePattern:  "gcad.preview.compact_filtered.r3.wgs.16906.GATK.2020.05.26.biallelic.genotypes.<CHR>.<CONSENT>.vcf.gz", fileset:  "fsa000006"},
    {release: "R3", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, M, Y", variants:  "Multiallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r3.wgs.16906.GATK.2020.05.26.multiallelic.genotypes.<CHR>.<CONSENT>.vcf.gz", fileset:  "fsa000006"},
    {release: "R3", productType:  "Structural variant callset", qcType:  "SV", caller:  "GraphTyper", chromosomes: "1–22", variants:  "Structural Variants", filterType:  "Full", filenamePattern:  "gcad.r3.wgs.16905.GraphTyper.2022.03.22.SV.<CONSENT>.vcf.tar.gz", fileset:  "fsa000023"},
    {release: "R3", productType:  "Structural variant callset", qcType:  "SV", caller:  "BioGraph", chromosomes: "1–22", variants:  "Structural Variants", filterType:  "Full", filenamePattern:  "adsp.r3.wgs.16841.BioGraph.v1.2021.11.17.SV.<CONSENT>.vcf.tar.gz", fileset:  "fsa000022"},
    {release: "R3", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r3.wgs.16905.GATK.2021.08.24.biallelic.genotypes.<CHR>.<CONSENT>.vcf.gz", fileset:  "fsa000006"},
    {release: "R3", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "X, XPAR", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r3.wgs.<CHR>.16905.GATK.2021.12.03.biallelic.genotypes.<CONSENT>.vcf.gz", fileset:  "fsa000006"},
    {release: "R2", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "Y, M", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r2.wes.<CHR>.20503.GATK.2024.06.28.biallelic.genotypes.<CONSENT>.vcf.gz", fileset:  "fsa000005"},
    {release: "R2", productType:  "Preview SNV/indel pVCF", qcType:  "Preview", caller:  "GATK", chromosomes: "1–22, X, Y, M", variants:  "Multiallelic", filterType:  "Full", filenamePattern:  "gcad.preview.r2.wes.<CHR>.20499.GATK.2025.02.18.multiallelic.genotypes.<CONSENT>.vcf.gz", fileset:  "fsa000005"},
    {release: "R2", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r2.wes.<CHR>.20504.GATK.2020.06.26.v2.biallelic.genotypes.<CONSENT>.vcf.gz", fileset:  "fsa000005"},
    {release: "R2", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "X, XPAR", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.r2.wes.<CHR>.20504.GATK.2021.02.12.biallelic.genotypes.<CONSENT>.vcf.gz", fileset:  "fsa000005"},
    {release: "R1", productType:  "QC'd SNV/indel pVCF", qcType:  "QC'ed", caller:  "GATK", chromosomes: "1–22", variants:  "Biallelic", filterType:  "Full", filenamePattern:  "gcad.qc.wgs.<CHR>.4789.GATK.2018.09.17.v2.biallelic.genotypes.<CONSENT>.vcf.gz", fileset:  "fsa000003"},
  ],

  /* PROCESSING — joint caller from pVCFReleaseTable; the rest TBD. */
  processing: {
    R1: [{ label: "Joint caller", value: "GATK" }, { label: "SV callers", value: "—" }, { label: "Changed from prior release", value: "—" }],
    R2: [{ label: "Joint caller", value: "GATK" }, { label: "SV callers", value: "—" }, { label: "Changed from prior release", value: "TBD" }],
    R3: [{ label: "Joint caller", value: "GATK" }, { label: "SV callers", value: "GraphTyper, BioGraph" }, { label: "Changed from prior release", value: "TBD" }],
    R4: [{ label: "Joint caller", value: "GATK" }, { label: "SV callers", value: "GraphTyper" }, { label: "Changed from prior release", value: "TBD" }],
    R5: [{ label: "Joint caller", value: "GLnexus" }, { label: "SV callers", value: "GraphTyper" }, { label: "Changed from prior release", value: "Project-level joint-calling approach changed (GATK → GLnexus)" }],
  },

  /* Release milestones live on releases[].milestones (single source). Curated —
     full chronology stays in the NG00067 release notes (links.releaseNotes).
     Include: first availability, QC'd callset, major scope (chrX), representation
     (GDS), analysis resource (LD/imputation), variant class (SV). */

  /* PROTOTYPE ONLY — shape of the normalized /api/adsp/production response,
     shown only when the "productionSource" tweak = "sample". Never used in production. */
  productionSample: [
    { projectId: "P-001", projectName: "Sample project A", release: "R7", totalSamples: 1200, batch: "Batch 1", batchSamples: 700, fileReceived: "2026-03-02", adspIdsGenerated: "2026-03-20", pipelineCompleted: "2026-06-11" },
    { projectId: "P-001", projectName: "Sample project A", release: "R7", totalSamples: 1200, batch: "Batch 2", batchSamples: 500, fileReceived: "2026-05-14", adspIdsGenerated: "2026-06-02", pipelineCompleted: null },
    { projectId: "P-002", projectName: "Sample project B", release: "R7", totalSamples: 850, batch: "Batch 1", batchSamples: 850, fileReceived: "2026-07-08", adspIdsGenerated: null, pipelineCompleted: null },
    { projectId: "P-010", projectName: "Sample project C", release: "R6", totalSamples: 3100, batch: "Batch 1", batchSamples: 1600, fileReceived: "2025-04-10", adspIdsGenerated: "2025-05-01", pipelineCompleted: "2025-09-15" },
    { projectId: "P-010", projectName: "Sample project C", release: "R6", totalSamples: 3100, batch: "Batch 2", batchSamples: 1500, fileReceived: "2025-06-22", adspIdsGenerated: "2025-07-09", pipelineCompleted: "2025-11-30" },
  ],

/* PUBLICATIONS — GENERATED from "ADSP Publications (infrastructure, data
     releases, key resources)" (last update Aug 2026). Links built as
     https://pubmed.ncbi.nlm.nih.gov/{pmid}/. group order = display order. */
  publicationGroups: [
    { key: "pipeline", label: "GCAD pipeline, QC & annotation" },
    { key: "release",  label: "ADSP data release papers" },
    { key: "preprint", label: "Under review / preprint" },
    { key: "resource", label: "NIAGADS/ADSP resource & tool papers" },
  ],
  publications: [
    { group: "pipeline", pmid: "30351394", description: "VCPA", releases: [],
      citation: "Leung YY, Valladares O, Chou Y-F, et al. VCPA: genomic variant calling pipeline and data management tool for Alzheimer's Disease Sequencing Project. Bioinformatics. 2019;35(10):1768-1770." },
    { group: "pipeline", pmid: "29857119", description: "ADSP/GCAD QC", releases: [],
      citation: "Naj A, Lin H, Vardarajan BN, et al. Quality control and integration of genotypes from two calling pipelines for whole genome sequence data in the Alzheimer's disease sequencing project. Genomics. 2019;111(4):808-818." },
    { group: "pipeline", pmid: "29590295", description: "ADSP annotation", releases: [],
      citation: "Butkiewicz M, Blue EE, Leung YY, et al. Functional annotation of genomic variants in studies of late-onset Alzheimer's disease. Bioinformatics. 2018;34(16):2724-2731." },
    { group: "release", pmid: "29184913", description: "R1 and R2 (study design and sample selection)", releases: ["R1", "R2"],
      citation: "Beecham GW, Bis JC, Martin ER, et al. The Alzheimer's Disease Sequencing Project: Study design and sample selection. Neurol Genet. 2017;3(5):e194." },
    { group: "release", pmid: "29688227", description: "R1 (Caribbean Hispanic family WGS)", releases: ["R1"],
      citation: "Vardarajan BN, Barral S, Jaworski J, et al. Whole genome sequencing of Caribbean Hispanic families with late-onset Alzheimer's disease. Ann Clin Transl Neurol. 2018;5(4):406-417." },
    { group: "release", pmid: "29862559", description: "R1 (admixture in Caribbean Hispanic pedigrees)", releases: ["R1"],
      citation: "Analysis of pedigree data in populations with multiple ancestries: Strategies for dealing with admixture in Caribbean Hispanic families from the ADSP. 2018." },
    { group: "release", pmid: "38511601", description: "R1 (variant analyses)", releases: ["R1"],
      citation: "Wang Y, Sarnowski C, Lin H, et al. Key variants via the Alzheimer's Disease Sequencing Project whole genome sequence data. Alzheimers Dement. 2024;20(5):3290-3304." },
    { group: "release", pmid: "38263370", description: "R2 (pipeline and data descriptor)", releases: ["R2"],
      citation: "Leung YY, Naj A, Chou Y-F, et al. Human whole-exome genotype data for Alzheimer's disease. Nat Commun. 2024;15(1):684." },
    { group: "release", pmid: "40528303", description: "R3 (SV analyses)", releases: ["R3"],
      citation: "Wang H, Dombroski BA, Cheng P-L, et al. Structural variation detection and association analysis of whole-genome-sequence data from 16,543 Alzheimer's disease sequencing project subjects. Alzheimer's Dement. 2025;21(6):e70277." },
    { group: "release", pmid: "39428839", description: "R3 (common and rare variant association)", releases: ["R3"],
      citation: "Lee WP, Choi SH, Shea MG, et al. Association of common and rare variants with Alzheimer's disease in more than 13,000 diverse individuals with whole-genome sequencing from the Alzheimer's Disease Sequencing Project. Alzheimers Dement. 2024;20(12):8470-8483." },
    { group: "release", pmid: "40407102", description: "R4 (data descriptor)", releases: ["R4"],
      citation: "Leung YY, Lee WP, Kuzma AB, et al. Alzheimer's Disease Sequencing Project release 4 whole genome sequencing dataset. Alzheimer's Dement. 2025;21(5):e70237." },
    { group: "preprint", pmid: "41960309", description: "R5 (variant analyses)", releases: ["R5"],
      citation: "Lee WP, Wang H, Leung YY, et al. Rare coding variants from ADSP R5 whole-genome sequencing implicate novel genes in Alzheimer's disease. Research Square preprint. 2026:rs.3.rs-9013646." },
  ],

  /* --------------------------------------------------------------------------
     ADSP-PHC — GENERATED from the "ADSP - Sequence Data Availability by Cohort"
     Google Sheet (cols G–R). Values = subjects with harmonized data AND ADSP
     sequencing. Only cohorts with ≥1 domain shown. Read the sheet live in prod.
     -------------------------------------------------------------------------- */
  phc: {
    domains: ["CSF biomarkers", "Plasma biomarkers", "Cognition", "Demographics & diagnosis", "DTI", "FLAIR", "Neuropathology", "PET amyloid", "PET tau", "MRI T1 (FreeSurfer)", "MRI MUSE", "Vascular risk factors"],
    cohorts: [
      { name: "A4 Study (A4)",           counts: [0, 3114, 3345, 3345, 0, 1418, 0, 3340, 338, 1400, 804, 0] },
      { name: "Adult Changes in Thought (ACT)", counts: [0, 0, 1337, 1337, 0, 0, 502, 0, 0, 0, 0, 0] },
      { name: "Case Western Reserve University (CWRU) Autopsy Cohort", counts: [0, 0, 0, 106, 0, 0, 106, 0, 0, 0, 0, 0] },
      { name: "Estudio Familiar de la Influencia Genetica en Alzheimer (EFIGA)", counts: [0, 0, 4563, 4730, 0, 0, 0, 0, 0, 0, 0, 4296] },
      { name: "Health and Aging Brain Study - Health Disparities (HABS-HD)", counts: [0, 650, 1325, 1325, 1231, 1312, 0, 923, 630, 1275, 1314, 1325] },
      { name: "Korean Brain Aging Study for the Early Diagnosis and Prediction of AD (KBASE)", counts: [0, 0, 603, 603, 0, 602, 0, 602, 180, 508, 601, 0] },
      { name: "KnightADRC - Charles F. and Joanne Knight Alzheimer's Disease Research Center (KGAD)", counts: [558, 0, 870, 903, 190, 297, 0, 458, 159, 433, 428, 0] },
      { name: "Minority Aging Research Study (MARS)", counts: [0, 0, 48, 48, 17, 20, 13, 0, 0, 19, 20, 48] },
      { name: "National Institute of Aging Alzheimer's Disease Family Based Study (NIA AD-FBS)", counts: [0, 0, 1650, 2819, 0, 0, 381, 0, 0, 0, 0, 0] },
      { name: "NIA Alzheimer Disease Research Centers (ADRC/ADC)", url: "https://dss.niagads.org/cohorts/nia-alzheimers-disease-research-centers-adrc/", counts: [836, 350, 11955, 14319, 354, 1809, 5211, 587, 263, 1190, 1836, 12216] },
      { name: "Religious Orders Study and Memory and Aging Project (ROSMAP)", url: "https://dss.niagads.org/cohorts/religious-orders-study-memory-and-aging-project-rosmap/", counts: [0, 0, 1222, 1222, 56, 144, 1095, 0, 0, 90, 144, 1222] },
      { name: "Texas Alzheimer's Research and Care Consortium (TARCC)", counts: [0, 0, 1161, 1161, 0, 0, 0, 0, 0, 0, 0, 1161] },
      { name: "University of Miami", counts: [0, 0, 0, 85, 0, 0, 85, 0, 0, 0, 0, 0] },
      { name: "University of Miami Brain Bank (MBB)", counts: [0, 0, 0, 306, 0, 0, 306, 0, 0, 0, 0, 0] },
      { name: "Washington Heights-Inwood Columbia Aging Project (WHICAP)", counts: [0, 0, 3795, 3798, 0, 1306, 0, 0, 0, 659, 767, 3142] },
      { name: "Wisconsin Registry for Alzheimer's Prevention (WRAP)", counts: [271, 0, 1000, 1000, 121, 585, 0, 485, 465, 579, 608, 989] },
    ],
    total: [1665, 4114, 32874, 37107, 1969, 7493, 7699, 6395, 2035, 6153, 6522, 24399],
    /* Final wording from authoritative NIAGADS phenotype documentation. */
    notes: [
      { title: "Identifiers",        body: "Phenotype data use SUBJID; genotype data use SampleID. The Sample Manifest connects them." },
      { title: "Where PHC data live", body: "ADSP-PHC harmonized phenotype data are part of NG00067." },
      { title: "Methods & consortium", body: "Harmonization methods, publications and consortium information are on the ADSP-PHC website." },
    ],
  },

  /* --------------------------------------------------------------------------
     ACCESS — site-level answers only. Final wording pending policy review
     (§16.9). Add further questions to `faq` as the team supplies them.
     -------------------------------------------------------------------------- */
  access: {
    includes: [
      "ADSP sequencing releases",
      "Individual-level genomic data",
      "Project-level variant data",
      "Associated phenotype data",
      "ADSP-PHC harmonized phenotype data",
      "Other ADSP products released through NG00067",
    ],
    separateRequest: "TBD — approved NIAGADS policy wording on the umbrella-dataset model. Some contributing resources may carry third-party requirements; detailed policy stays in NIAGADS documentation.",
    steps: [
      "Review NG00067",
      "Submit a NIAGADS Data Access Request",
      "NIAGADS / NADAC review",
      "Approved users access data permitted under their authorization",
    ],
    faq: [],
  },
};
