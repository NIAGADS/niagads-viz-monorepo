import {
    Activity,
    AudioLines,
    Brain,
    ChartNoAxesCombined,
    Database,
    ExternalLink,
    FilePenLine,
    FileText,
    GitBranch,
    Home,
    Info,
    SquareChartGantt,
} from "lucide-react";

// lib/types.ts - project type definitions
import { APIPagination } from "@niagads/common";
import { TableProps } from "@niagads/table";

// icons

export const PAGE_SECTION_ICONS = {
    home: Home,
    brain: Brain,
    chart: ChartNoAxesCombined,
    link: ExternalLink,
    network: GitBranch,
    database: Database,
    info: Info,
    activity: Activity,
    frequency: AudioLines,
    file: FileText,
    annotate: FilePenLine,
    location: SquareChartGantt,
};

export type PageSectionIcon = keyof typeof PAGE_SECTION_ICONS;

// API Response

export interface Request {
    request_id: string;
    endpoint: string;
    parameters: RequestParameters;
}

export interface RequestParameters {
    id: string;
}

export type TablePagination = { [key: string]: APIPagination };

// Search Results

export interface SearchResult {
    id: string;
    description: string;
    display: string;
    record_type: RecordType;
    matched_term: string;
    match_rank: number;
}

// Page Request Parameters

export interface PageProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

export interface RecordPageProps extends PageProps {
    params: Promise<{
        entity: string;
        id: string;
    }>;
}

// Supporting literals

export type AssociationTraitCategory = "biomarker" | "ad" | "adrd" | "other" | "all_ad" | "all";
export type AssociationTraitSource = "gwas" | "curated" | "all";

// this implementation allows us to create an assertion on record type
export const RECORD_TYPES = ["gene", "variant", "structural_variant", "region", "track"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

// Records and supporting data types

export interface OntologyTerm {
    term_id: string;
    term: string;
}

export interface AttributeCount {
    [key: string]: number;
}

export interface GeneticAssociationSummary {
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

export interface PredictedConsequenceSummary {
    consequence_terms: string[];
    impact: "HIGH" | "MODERATE" | "LOW" | "MODIFIER";
    is_coding: boolean | null;
    impacted_gene: GeneFeature | null;
    impacted_transcript: string | null;
    codon_change: string | null;
    amino_acid_cahnge: string | null;
}

export interface CADDScore {
    phred: number;
    raw: number;
}

export interface VariantRecord extends BaseRecord {
    record_type: "variant";
    variant_class: string;
    id: string;
    ref_snp_id: string;
    location: GenomicLocation;
    is_adsp_variant: boolean | null;
    most_severe_consequence: PredictedConsequenceSummary | null;
    cadd_scores: CADDScore;
    is_structural_variant: boolean;
    allele_string: string;
    ref: string;
    alt: string;
}

export interface RegionRecord extends BaseRecord {
    record_type: "region";
    location: GenomicLocation;
    num_structural_variants: number;
    num_genes: number;
    num_small_variants: number | string;
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

export type GenomicFeatureRecord = GeneRecord | VariantRecord | RegionRecord;
// named "EntityRecord" so as not to confuse w/built-in "Record" for generic key-value pair
export type EntityRecord = GeneRecord | VariantRecord | RegionRecord | TrackRecord;

// record page structure; anchored sections

interface AnchoredSectionBase {
    id: string;
    label: string;
    description?: string | React.ReactNode;
    underConstruction?: boolean;
}

// TODO: table wrapper "types"

// generic placeholder b/c to avoid importing
// client component in server component, if we need better typing
// can import TableProps from @niagads/table in
// the client component
export interface NIAGADSTableProps {
    id: string;
    options?: any;
    columns: any;
    data: any;
}

export interface APITableResponse {
    request: Request;
    pagination: APIPagination;
    table: TableProps;
}

export interface TableSection extends AnchoredSectionBase {
    endpoint: string;
    wrapper?: string;
    data?: APITableResponse | null;
    error?: string | null;
}

export interface AnchoredPageSection extends AnchoredSectionBase {
    icon: PageSectionIcon;
    tables?: TableSection[];
}
