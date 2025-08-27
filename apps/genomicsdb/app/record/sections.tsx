import AssociationTable from "@/components/tables/AssociationTable";
import GOAssociationTable from "@/components/tables/GOAssociationTable";
import PathwayTable from "@/components/tables/PathwayTable";
import { AnchoredPageSection } from "@/lib/types";

const GWAS_ASSOC_SECTION: AnchoredPageSection = {
    id: "gwas-genetic-associations",
    label: "NIAGADS GWAS associations",
    description: "",
    icon: "chart",
    tables: [
        {
            id: "gwas-ad",
            label: "Alzheimer's Disease",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=AD&source=GWAS",
            wrapper: AssociationTable
        },
        {
            id: "gwas-adrd",
            label: "AD-Related Dementias",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=ADRD&source=GWAS",
            wrapper: AssociationTable
        },
        {
            id: "gwas-biomarker",
            label: "AD/ADRD Biomarkers",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=BIOMARKER&source=GWAS",
            wrapper: AssociationTable
        },
    ],
};

const CURATED_ASSOC_SECTION: AnchoredPageSection = {
    id: "curated-genetic-associations",
    label: "Curated associations",
    description: "",
    icon: "file",
    tables: [
        {
            id: "curated-ad",
            label: "Alzheimer's Disease",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=AD&source=CURATED",
            wrapper: AssociationTable
        },
        {
            id: "curated-adrd",
            label: "AD-Related Dementias",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=ADRD&source=CURATED",
            wrapper: AssociationTable
        },
        {
            id: "curated-biomarker",
            label: "AD/ADRD Biomarkers",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=BIOMARKER&source=CURATED",
            wrapper: AssociationTable
        },
        {
            id: "curated-Other",
            label: "Other Associations",
            description: "",
            endpoint: "/associations?pvalue=5e-8&trait=OTHER&source=CURATED",
            wrapper: AssociationTable
        },
    ],
};

const UC_GWAS_ASSOC_SECTION: AnchoredPageSection = {
    id: "gwas-genetic-associations",
    label: "NIAGADS GWAS associations",
    description: "",
    icon: "chart",
    underConstruction: true,
};

const UC_CURATED_ASSOC_SECTION: AnchoredPageSection = {
    id: "curated-genetic-associations",
    label: "Curated associations",
    description: "",
    icon: "file",
    underConstruction: true,
};

const __SPAN_RECORD_SECTIONS: AnchoredPageSection[] = [
    { id: "overview", label: "Overview", icon: "home" },
    {
        id: "colocated-features",
        label: "Colocated Genomic Features",
        description: "",
        icon: "location",
        tables: [
            {
                id: "genes",
                label: "Genes",
                description: "",
                endpoint: "/genes",
            },
            {
                id: "variants",
                label: "Variants",
                description: "",
                endpoint: "/variants",
            },
            // TODO: functional genomics
        ],
    },
    UC_GWAS_ASSOC_SECTION,
    UC_CURATED_ASSOC_SECTION,
];

const __GENE_RECORD_SECTIONS: AnchoredPageSection[] = [
    GWAS_ASSOC_SECTION,
    CURATED_ASSOC_SECTION,
    //{ id: "link-outs", label: "Link outs", description: "", icon: "link", tables: [] },
    {
        id: "predicted-function",
        label: "Functional Annotation",
        description: "",
        icon: "annotate",
        tables: [
            {
                id: "go-function",
                label: "GO Associations",
                description: "",
                endpoint: "/function",
                wrapper: GOAssociationTable
            },
        ],
    },
    {
        id: "pathways",
        label: "Pathway membership",
        description: "",
        icon: "network",
        tables: [
            {
                id: "pathway",
                label: "Pathway Membership",
                description: "",
                endpoint: "/pathways",
                wrapper: PathwayTable,
            },
        ],
    },
];

const __VARIANT_RECORD_SECTIONS: AnchoredPageSection[] = [
    { id: "overview", label: "Overview", icon: "home" },
    GWAS_ASSOC_SECTION,
    CURATED_ASSOC_SECTION,
    {
        id: "predicted-consequences",
        label: "Predicted Consequences",
        underConstruction: true,
        description: "",
        icon: "annotate",
        tables: [
            {
                id: "transcript-consequences",
                label: "Transcript Consequences",
                description: "",
                endpoint: "/function?&conseq=TRANSCRIPT",
            },
            {
                id: "regulatory-consequences",
                label: "Regulatory Consequences",
                description: "",
                endpoint: "/function?&conseq=REGULATORY",
            },
            {
                id: "motif-consequences",
                label: "Regulatory Motif Consequences",
                description: "",
                endpoint: "/function?&conseq=MOTIF",
            },
            {
                id: "intergenic-consequences",
                label: "Intergenic Consequences",
                description: "",
                endpoint: "/function?&conseq=INTERGENIC",
            },
        ],
    },
    {
        id: "variation",
        label: "Genetic Variation",
        description: "",
        icon: "frequency",
        tables: [
            {
                id: "frequency",
                label: "Population Frequencies",
                description: "",
                endpoint: "/frequencies",
            },
        ],
    },
    // TODO: linkage
];

export const RECORD_PAGE_SECTIONS = {
    gene: __GENE_RECORD_SECTIONS,
    variant: __VARIANT_RECORD_SECTIONS,
    region: __SPAN_RECORD_SECTIONS,
};

// TODO - linkouts
// export type ContentTabType = "related-gene-records" | "clinical" | "proteins" | "nucleotide-sequences" | "transcripts";
