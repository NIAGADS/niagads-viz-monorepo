// FIXME: move to a `Collection`
export const VariantReferenceTrack =
{
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

export const GENOME = 'hg38';
export const FEATURE_SEARCH_ENDPOINT = '/service/track/feature?id='
