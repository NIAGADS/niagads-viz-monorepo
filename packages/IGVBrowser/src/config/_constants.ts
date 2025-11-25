export const DEFAULT_FLANK = 1000;
export const ALWAYS_ON_TRACKS = ["ideogram", "ruler", "sequence", "ENSEMBL_GENE"];
export const HASH_PREFIX = "#/locus/";

export const FEATURE_SEARCH_URL = `/api/feature-lookup?id=$FEATURE$&flank=${DEFAULT_FLANK}`;

export const VariantReferenceTrack = {
    name: "ADSP R4 Variants",
    url: "/service/track/variant",
    type: "variant_service",
    format: "webservice",
    visibilityWindow: 100000,
    supportsWholeGenome: false,
    queryable: true,
    description:
        "Variants from the Alzheimer''s Disease Sequencing Project (ADSP) 36K R4 whole genome sequencing effort - INDELs and SNVs that passed the ADSP biallelic quality control (QC) criteria. Variants are annotated by the ADSP Annotation Pipeline.",
    id: "ADSP_R4",
    order: 1,
    infoURL: "/record",
    removable: false,
};
