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
