export type Assay = "WGS" | "WES";
export type ReleaseStatus = "released" | "in_production";
export type StageState = "complete" | "in_progress" | "not_started";
export type VersionDate = [version: string, date: string];

export interface Milestone {
    type: string;
    label: string;
    date: string;
    datasetVersion: string;
    summary: string;
}

export interface Release {
    id: string;
    assay: Assay;
    familiarLabel: string | null;
    status: ReleaseStatus;
    projectFileset?: string;
    filesetNote?: string;
    samples?: { preview?: number; qc?: number };
    milestones?: Milestone[];
    activitySummary?: string;
    currentActivities?: string[];
    productionStages?: { label: string; state: StageState; status: string }[];
    individualNote?: string;
    summary?: string;
}

export interface ReleaseSummary {
    first: VersionDate;
    qc: VersionDate | null;
    products: Record<string, VersionDate | null>;
}

export interface SampleSet {
    cohort: string;
    study: string;
    sampleSet: string;
    counts: Partial<Record<string, number>>;
}

export interface CompositionDim {
    label: string;
    sourceField: string;
    categories: string[];
    counts: Record<string, number[]>;
}

/** "<dimA>|<dimB>" → round → A category → B category → count (null = suppressed). */
export type CompositionCross = Record<string, Record<string, Record<string, Record<string, number | null>>>>;

export interface GlanceItem {
    value: string;
    note: string;
    source: string;
}

export interface VariantProduct {
    release: string;
    productType: string;
    qcType: string;
    caller: string;
    chromosomes: string;
    variants: string;
    filterType: string;
    filenamePattern: string;
    fileset: string;
}

export interface ProductionRecord {
    projectId: string;
    projectName: string;
    release: string;
    totalSamples: number;
    batch: string | null;
    batchSamples: number;
    fileReceived: string | null;
    adspIdsGenerated: string | null;
    pipelineCompleted: string | null;
}

export interface Publication {
    group: string;
    pmid: string;
    description: string;
    releases: string[];
    citation: string;
}

export interface AdspData {
    links: Record<string, string>;
    glance: { ng00067Version: GlanceItem; approvedDars: GlanceItem; cohorts: GlanceItem };
    releases: Release[];
    releaseFacts: Record<string, { samples: number; referenceBuild: string; firstPublicRelease: string }>;
    releaseSummary: Record<string, ReleaseSummary>;
    coreProductRows: [key: string, label: string][];
    dss: {
        studyUrl: string;
        sampleSetUrl: string;
        studies: Record<string, string>;
        sampleSets: Record<string, string>;
        cohortUrls: Record<string, string>;
    };
    sampleSets: SampleSet[];
    compositionCross: CompositionCross;
    composition: Record<string, CompositionDim>;
    fileTypes: { type: string; qc: string; variantInfo: string; qcFlags: string; genotype: string; naming: string }[];
    dataProductGroups: { key: string; label: string }[];
    dataProducts: { group: string; label: string; desc: string; avail: Partial<Record<string, boolean | "cohort">> }[];
    productTypes: string[];
    variantProducts: VariantProduct[];
    processing: Record<string, { label: string; value: string }[]>;
    productionSample: ProductionRecord[];
    publicationGroups: { key: string; label: string }[];
    publications: Publication[];
    phc: {
        domains: string[];
        cohorts: { name: string; url?: string; counts: number[] }[];
        total: number[];
        notes: { title: string; body: string }[];
    };
    access: { includes: string[]; separateRequest: string; steps: string[]; faq: { q: string; a: string }[] };
}

export interface LiveStats {
    version?: string;
    releaseDate?: string;
    cohorts?: number;
    dars?: number;
}
