export type RolloutStatus = "available" | "next" | "later" | "following";

type ResourceId = "genomicsdb" | "topgenes" | "advp" | "filer" | "xqtl";

export const ROLLOUT_STATUSES: Record<RolloutStatus, string> = {
    available: "Available now",
    next: "Coming next",
    later: "Then",
    following: "Following",
};

interface RolloutItem {
    id: string;
    title: string;
    description: string;
    status: RolloutStatus;
    resourceId: ResourceId;
}

interface OpenAccessResource {
    id: ResourceId;
    name: string;
    description: string;
    url: string;
    partner: boolean;
}

// Update each item's status independently; array order sets the reading order.
export const ROLLOUT_ITEMS: RolloutItem[] = [
    {
        id: "genomicsdb-queries",
        title: "GenomicsDB queries",
        description: "Explore annotated genes, variants, and genomic regions and AD/ADRD genetic associations.",
        status: "available",
        resourceId: "genomicsdb",
    },
    {
        id: "adsp-r5-snvs",
        title: "ADSP R5 SNVs",
        description: "Annotated single-nucleotide variants from ADSP Release 5, available through GenomicsDB.",
        status: "available",
        resourceId: "genomicsdb",
    },
    {
        id: "adsp-r5-indels",
        title: "ADSP R5 INDELs",
        description: "Annotated insertions and deletions from ADSP Release 5, available through GenomicsDB.",
        status: "available",
        resourceId: "genomicsdb",
    },
    {
        id: "gvc-topgenes",
        title: "GVC TopGenes",
        description: "Expert-reviewed genetic evidence for AD/ADRD genes and loci.",
        status: "available",
        resourceId: "topgenes",
    },
    {
        id: "adsp-r5-structural-variants",
        title: "ADSP R5 structural variants",
        description: "Annotated structural variants from ADSP Release 5, coming to the API through GenomicsDB.",
        status: "next",
        resourceId: "genomicsdb",
    },
    {
        id: "advp",
        title: "ADVP",
        description: "Curated genetic associations from published Alzheimer's disease studies.",
        status: "next",
        resourceId: "advp",
    },
    {
        id: "filer",
        title: "FILER",
        description: "Harmonized functional genomics data for interpreting variants and regulatory regions.",
        status: "later",
        resourceId: "filer",
    },
    {
        id: "fungen-xqtls",
        title: "ADSP FunGen xQTLs",
        description: "Molecular QTL and fine-mapping results across brain tissues and cell types.",
        status: "following",
        resourceId: "xqtl",
    },
];

export const OPEN_ACCESS_RESOURCES: OpenAccessResource[] = [
    {
        id: "genomicsdb",
        name: "Alzheimer's GenomicsDB",
        description:
            "Explore AD and ADRD genetic associations from NIAGADS-hosted GWAS summary statistics, ADSP variants, and functional annotations in the context of genes, variants, and genomic regions.",
        url: "https://www.niagads.org/genomics",
        partner: false,
    },
    {
        id: "topgenes",
        name: "GVC TopGenes",
        description:
            "An expert-reviewed catalog of genes and loci implicated in Alzheimer's disease and related dementias, curated by the ADSP Gene Verification Committee.",
        url: "https://topgenes.niagads.org/",
        partner: true,
    },
    {
        id: "advp",
        name: "Alzheimer's Disease Variant Portal (ADVP)",
        description:
            "A harmonized collection of genetic association findings curated from the literature. Browse evidence for Alzheimer's disease risk, endophenotypes, and neuropathology.",
        url: "https://advp.niagads.org/",
        partner: true,
    },
    {
        id: "filer",
        name: "FILER",
        description:
            "A searchable repository of harmonized human functional genomics data. Find regulatory annotations by biological context and genomic region to help interpret genetic findings.",
        url: "https://tf.lisanwanglab.org/FILER/",
        partner: false,
    },
    {
        id: "xqtl",
        name: "ADSP FunGen xQTL Atlas",
        description:
            "Explore harmonized molecular QTL and fine-mapping results to investigate how genetic variation affects molecular traits across brain tissues and cell types.",
        url: "https://xqtl.niagads.org/",
        partner: false,
    },
];
