// Record types
export interface BaseRecord {
  id: string
  type: "gene" | "variant" | "span" | "track"
}

// Gene record structure
export interface GeneRecord extends BaseRecord {
  type: "gene"
  symbol: string
  name: string | null
  synonyms: string[] | null
  location: {
    start: number
    end: number
    chr: string
    strand: "+" | "-"
  }
  hgnc_annotation: {
    agr?: string
    ena?: string
    lsdb?: string
    name?: string
    gencc?: string
    cosmic?: string
    mgd_id?: string
    rgd_id?: string
    status?: string
    symbol?: string
    ccds_id?: string
    hgnc_id?: string
    omim_id?: string
    ucsc_id?: string
    vega_id?: string
    location?: string // cytogenic location
    orphanet?: string
    entrez_id?: string
    prev_name?: string
    pubmed_id?: string
    alias_name?: string
    gene_group?: string
    locus_type?: string
    locus_group?: string
    mane_select?: string
    prev_symbol?: string
    uniprot_ids?: string
    alias_symbol?: string
    date_modified?: string
    gene_group_id?: string
    ensembl_gene_id?: string
    refseq_accession?: string
    date_name_changed?: string
    location_sortable?: string
    date_approved_reserved?: string
  } | null
  go_annotation: Array<{
    go_term_id: string
    go_term: string
    ontology: "BP" | "MF" | "CC" // Biological Process, Molecular Function, Cellular Component
    evidence: Array<{
      citation: string
      qualifier: string
      evidence_code: string
      go_evidence_code: string
      annotation_source: string
      evidence_code_qualifier: string | null
    }>
  }> | null
  pathway_membership: Array<{
    pathway: string
    pathway_id: string
    pathway_source: string
  }> | null
}

// Variant record 
export interface VariantRecord extends BaseRecord {
  type: "variant"
  variantType: "RefSNP" | "Genomic Location"
  chromosome: string
  position: string
  reference: string
  alternate: string
  genes: string[]
  consequence: string
  impact: "HIGH" | "MODERATE" | "LOW" | "MODIFIER"
  maf: string
  phenotypes: string[]
}
// Span record
export interface SpanRecord extends BaseRecord {
  type: "span"
  chromosome: string
  start: number
  end: number
  length: number
  spanType: "regulatory_region" | "enhancer" | "promoter" | "intergenic" | "custom_region"
  description: string
  genes: string[]
  features: string[]
  datasets: string[]
  annotations?: {
    chromHMM?: string
    conservation?: number
    accessibility?: number
  }
}

// Track record
export interface TrackRecord extends BaseRecord {
  type: "track"
  id: string
  name: string
  description: string
  genome_build: "GRCh37" | "GRCh38"
  feature_type: "variant" | "gene" | "region"
  is_download_only: boolean
  is_shard: boolean | null
  cohorts?: string[] | null
  biosample_characteristics?: {
    tissue?: string[]
    biomarker?: string[]
    cell_type?: string[]
  } | null
  subject_phenotypes?: {
    disease?: string[]
    ethnicity?: string[]
    study_diagnosis?: Array<{
      phenotype?: { term: string }
      num_cases?: number
      num_controls?: number
    }>
  } | null
  experimental_design: {
    analysis: "GWAS" | "eQTL" | "ChIP-seq" | "ATAC-seq" | "RNA-seq" | "Methylation"
    classification: "genetic association" | "expression" | "epigenetic" | "regulatory"
    data_category: "summary statistics" | "raw data" | "processed data"
    is_lifted?: boolean
    covariates?: string[]
  }
  provenance: {
    data_source: string
    accession: string
    pubmed_id?: string[]
    consortium?: string[]
    attribution: string
  }
  file_properties: {
    file_name: string
    url: string
    file_format: "vcf" | "bed" | "bigWig" | "tsv" | "bam"
    file_schema?: string
  }
}

export type Record = GeneRecord | VariantRecord | SpanRecord | TrackRecord

// API Response structure
export interface ApiResponse<T> {
  data: T[]
  request: {
    request_id: string
    endpoint: string
    parameters: { [key: string]: any }
    message: string | null
  }
  pagination: {
    page: number
    total_num_pages: number
    paged_num_records: number
    total_num_records: number
  }
}

// Section types for gene records
export type GeneSectionType =
  | "overview"
  | "trait-associations"
  | "niagads-gwas"
  | "gwas-catalog"
  | "link-outs"
  | "function-prediction"
  | "pathways-interactions"

// Content tabs
export type ContentTabType =
  | "niagads-alzheimers"
  | "niagads-neuropathologies"
  | "gwas-alzheimers"
  | "gwas-other-traits"
  | "related-gene-records"
  | "clinical"
  | "proteins"
  | "nucleotide-sequences"
  | "transcripts"
  | "gene-ontology"
  | "pathways"
  | "interactions"

export type VariantSectionType = "overview" | "population" | "functional" | "associations" | "linkage"
export type SpanSectionType = "overview" | "features" | "genes" | "regulatory" | "conservation" | "datasets"

// Track section types
export type TrackSectionType =
  | "overview"
  | "study-design"
  | "subjects-samples"
  | "related-tracks"
  | "downloads"
  | "visualization"

export type SectionType = GeneSectionType | VariantSectionType | SpanSectionType | TrackSectionType
export type RecordType = GeneRecord | VariantRecord | SpanRecord | TrackRecord
