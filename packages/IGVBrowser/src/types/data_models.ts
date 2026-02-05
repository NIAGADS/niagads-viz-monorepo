export interface VariantConsequence {
    conseq: string;
    impact: string;
    is_coding: boolean;
    codon_change: string;
    amino_acid_change: string;
    impacted_gene: string;
    impacted_gene_symbol: string;
}

export interface VCFInfo {
    location: string;
    position: number;
    chromosome: string;
    display_id: string;
    metaseq_id: string;
    ref_snp_id: string;
    variant_class: string;
    display_allele: string;
    is_adsp_variant: boolean;
    variant_class_abbrev: string;
    most_severe_consequence?: VariantConsequence;
}

export interface IGVBrowserTrack {
    // required properties from user
    id: string;
    type: string;
    name: string;
    description: string;
    format: string;
    url: string;
    indexURL?: string;
    indexed?: boolean;
    removable?: boolean;
    reader?: any;
    decode?: any;

    infoURL?: string;

    // optional from user for custom rendering
    height?: string;
    visibilityWindow?: number;
    oauthToken?: any;
    autoscale?: boolean;
    minHeight?: number;
    maxHeight?: number;
    order?: number;
    color?: string; //if a function, don't export

    queryable?: boolean;
    metadata?: any;
}

export interface IGVBrowserQueryParams {
    loc?: string;
    file?: string[];
    roiLabel?: string;
    highlight?: boolean;
    track?: string[];
    filesAreIndexed?: boolean;
}

export interface Collection {
    route: any;
    name: string;
}

export interface CollectionMetadata {
    name: string;
    description: string;
    num_tracks: string;
}
