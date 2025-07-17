// lib/types.ts - project type definitions

import { TableProps } from "@niagads/table";

// API Response

export interface APIResult {}

export interface Request {
    request_id: string;
    endpoint: string;
    parameters: RequestParameters;
}

export interface RequestParameters {
    id: string;
}

export interface Pagination {
    page: number;
    total_num_pages: number;
    paged_num_records: number;
    total_num_records: number;
}

export interface APIResponse {
    data: APIResult[];
    request: Request;
    pagination: Pagination;
    message: string;
}

export interface APITableResponse {
    request: Request;
    pagination: Pagination;
    table: TableProps;
}

export interface APIErrorResponse {
    status: number;
    detail: string;
    message?: string;
    stack_trace?: string;
    request?: string;
}

// Page Request Parameters

export interface PageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

// Supporting literals

export type AssociationTraitCategory = "biomarker" | "ad" | "adrd" | "other" | "all_ad" | "all";
export type AssociationTraitSource = "gwas" | "curated" | "all";

export type PageSectionIcons =
    | "home"
    | "gantt"
    | "barchart"
    | "link"
    | "network"
    | "database"
    | "info"
    | "activity"
    | "file"
    | "frequency";

export type RecordType = "gene" | "variant" | "span" | "track";

// Records and supporting data types

export interface OntologyTerm {
    term_id: string;
    term: string;
}

export interface AttributeCount {
    [key: string]: number;
}

export interface GeneticAssocationSummary {
    trait_category: string;
    trait: OntologyTerm;
    num_variants: number | AttributeCount;
}

export interface BaseRecord {
    id: string;
    record_type: RecordType;
}

export interface GenomicLocation {
    start: number;
    end: number | null;
    length: number | null;
    chr: string;
    strand: "+" | "-";
}

interface GeneFeature extends BaseRecord {
    record_type: "gene";
    symbol: string;
}

export interface GeneRecord extends GeneFeature {
    record_type: "gene";
    type: string;
    name: string | null;
    synonyms: string[] | null;
    location: GenomicLocation;
    cytogenic_location: string | null;
}

export interface TableAttributeReport {
    id: string;
    title: string;
    is_truncated?: boolean;
    data: any;
}

export interface SectionTableReport {
    [key: string]: TableAttributeReport[];
}

export interface RecordReport {
    id: string;
    record: any;
    [key: string]: any;
}

export interface PredictedConsequence {
    consequence_terms: string[];
    impact: "HIGH" | "MODERATE" | "LOW" | "MODIFIER";
    is_coding: boolean | null;
    impacted_gene: GeneFeature | null;
    impacted_transcript: string | null;
    codon_change: string | null;
    amino_acid_cahnge: string | null;
}

export interface VariantRecord extends BaseRecord {
    record_type: "variant";
    variant_class: string;
    id: string;
    ref_snp_id: string;
    location: GenomicLocation;
    is_adsp_variant: boolean | null;
    most_severe_consequence: PredictedConsequence | null;
    ref: string;
    alt: string;
}

export interface SpanRecord extends BaseRecord {
    record_type: "span";
    location: GenomicLocation;
}

export interface TrackRecord extends BaseRecord {
    record_type: "track";
    id: string;
    name: string;
    description: string;
    genome_build: "GRCh37" | "GRCh38";
    feature_type: string;
    data_source: string;
    url: string;
}

export type Record = GeneRecord | VariantRecord | SpanRecord | TrackRecord;
export type GenomicFeatureRecord = GeneRecord | VariantRecord | SpanRecord;

// record page structure; anchored sections

interface AnchoredSectionBase {
    id: string;
    label: string;
    description?: string | React.ReactNode;
}

// TODO: table wrapper "types"

export interface TableSection extends AnchoredSectionBase {
    endpoint: string;
    wrapper?: string;
    data?: APITableResponse | null;
    error?: string | null;
}

export interface AnchoredPageSection extends AnchoredSectionBase {
    icon: PageSectionIcons;
    tables?: TableSection[];
}
