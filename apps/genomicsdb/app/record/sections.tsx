import { AnchoredPageSection } from "@/lib/types";

const __GENE_RECORD_SECTIONS: AnchoredPageSection[] = [
    { id: "overview", label: "Overview", icon: "home" },
    {
        id: "gwas-genetic-associations",
        label: "NIAGADS GWAS associations",
        description: "",
        icon: "gantt",
        tables: [
            {
                id: "gwas-ad",
                label: "Alzheimer's Disease",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=AD&source=GWAS",
            },
            {
                id: "gwas-adrd",
                label: "AD-Related Dementias",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=ADRD&source=GWAS",
            },
            {
                id: "gwas-biomarker",
                label: "AD/ADRD Biomarkers",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=BIOMARKER&source=GWAS",
            },
        ],
    },
    {
        id: "curated-genetic-associations",
        label: "Curated associations",
        description: "",
        icon: "gantt",
        tables: [
            {
                id: "curated-ad",
                label: "Alzheimer's Disease",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=AD&source=CURATED",
            },
            {
                id: "curated-adrd",
                label: "AD-Related Dementias",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=ADRD&source=CURATED",
            },
            {
                id: "curated-biomarker",
                label: "AD/ADRD Biomarkers",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=BIOMARKER&source=CURATED",
            },
            {
                id: "curated-Other",
                label: "Other Associations",
                description: "",
                endpoint: "/associations?pvalue=5e-8&trait=OTHER&source=CURATED",
            },
        ],
    },
    { id: "link-outs", label: "Link outs", description: "", icon: "link", tables: [] },
    {
        id: "predicted-function",
        label: "Functional Annotation",
        description: "",
        icon: "file",
        tables: [
            {
                id: "go-function",
                label: "GO Associations",
                description: "",
                endpoint: "/function",
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
            },
        ],
    },
];

export const RECORD_PAGE_SECTIONS = {
    gene: __GENE_RECORD_SECTIONS,
};

// TODO - linkouts
// export type ContentTabType = "related-gene-records" | "clinical" | "proteins" | "nucleotide-sequences" | "transcripts";
