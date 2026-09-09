export const RESOURCE_ECOSYSTEM_OVERVIEW = {
    title: "NIAGADS Ecosystem",
    description: `Together with partner offerings, NIAGADS provides an integrated suite of resources for discovering, exploring, and accessing Alzheimer's 
        disease and related dementia genetics and genomics data.`,

    instruction: "Hover, focus, or tap a resource above to learn more.",
};

export const RESOURCE_GROUPS = [
    { id: "knowledgebase", label: "NIAGADS Resources", color: "var(--primary-blue)" },
    { id: "access", label: "NIAGADS Resources", color: "var(--accent-teal)" },
    { id: "partner", label: "Partner Resources", color: "var(--warning-amber)" },
];

export const RESOURCES = [
    {
        id: "genomicsdb",
        badge: "GDB",
        name: "Alzheimer's GenomicsDB",
        description: `The NIAGADS Alzheimer's GenomicsDB is an interactive knowledgebase for exploring AD/ADRD genetic associations, 
            ADSP variants, and functional annotations in the context of genes, variants, and genomic regions. 
            Researchers can search, browse, and integrate GWAS and sequencing results to investigate disease-associated loci 
            and their potential functional relevance.`,
        url: "https://www.niagads.org/genomics",
        groupId: "knowledgebase",
        concepts: ["genes", "variants", "gwas", "ld", "cloudAccess", "curatedEvidence", "openAccess", "phenotypes"],
    },
    {
        id: "xqtl",
        badge: "xQTL",
        name: "ADSP FunGen xQTL Browser",
        description: `The ADSP FunGen xQTL Browser provides access to harmonized molecular QTL and fine-mapping results 
            in AD-relevant brain tissues and cell types. Researchers can explore how genetic variation affects gene expression 
            and other molecular traits.`,
        url: "https://xqtl.niagads.org",
        groupId: "knowledgebase",
        concepts: ["qtls", "variants", "genes", "biosamples", "openAccess"],
    },
    {
        id: "filer",
        badge: "FLR",
        name: "FILER",
        url: "https://tf.lisanwanglab.org/FILER/",
        description: `FILER is a harmonized, searchable collection of human functional genomics data assembled from major resources including
            ENCODE, Roadmap Epigenomics, and GTEx. Researchers can identify and query functional
            genomic tracks by biological context and genomic region to investigate regulatory evidence
            and help interpret disease-associated variants and loci.`,
        groupId: "knowledgebase",
        concepts: ["regulatory", "biosamples", "downloads", "cloudAccess", "openAccess"],
    },
    {
        id: "dss",
        badge: "DSS",
        name: "Data Sharing Service",
        description: `The NIAGADS Data Sharing Service (DSS) provides qualified access to genetics, genomics, phenotypic, 
            and related data from the Alzheimer’s Disease Sequencing Project and other AD/ADRD studies. 
            Researchers can browse available datasets, review their contents and access requirements, 
            and apply for controlled access to data appropriate for their research.`,
        url: "https://dss.niagads.org/datasets/",
        groupId: "access",
        concepts: ["downloads", "openAccess", "restrictedAccess"],
    },
    {
        id: "api",
        badge: "API",
        name: "Open Access API",
        description: `The NIAGADS Open Access API provides programmatic access to NIAGADS open data, 
            metadata, annotations, and knowledgebase resources. It enables researchers and developers to search, 
            retrieve, and integrate information from our knowledgebases into analysis pipelines, 
            applications, and computational workflows.`,
        url: "https://api.niagads.org",
        groupId: "access",
        concepts: ["cloudAccess", "openAccess"],
    },
    {
        id: "advp",
        badge: "ADVP",
        name: "Alzheimer's Disease Variant Portal",
        description: `The Alzheimer’s Disease Variant Portal (ADVP) is a curated, harmonized collection of published genetic associations
             for AD and related phenotypes.`,
        url: "https://advp.niagads.org",
        groupId: "partner",
        concepts: ["gwas", "genes", "variants", "curatedEvidence", "openAccess", "phenotypes"],
    },
    {
        id: "phc",
        badge: "PHC",
        name: "ADSP PHC",
        url: "https://vmacdata.org/adsp-phc",
        description: `The Alzheimer's Disease Sequencing Project Phenotype Harmonization Consortium (ADSP-PHC) harmonizes phenotypic and endophenotypic data
             across ADSP cohorts to support integrated genetic and genomic analyses of AD/ADRD. Its releases provide standardized 
             data and documentation across domains including cognition, diagnosis, biomarkers, neuropathology, cardiovascular risk, 
             and neuroimaging, with harmonized datasets distributed through the NIAGADS DSS.`,
        groupId: "partner",
        concepts: ["phenotypes", "restrictedAccess"],
    },
];
