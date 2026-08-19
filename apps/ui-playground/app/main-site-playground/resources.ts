export const RESOURCE_GROUPS = [
    { id: "knowledgebase", label: "NIAGADS Open Access", color: "var(--primary-blue)" },
    { id: "access", label: "NIAGADS Open Access", color: "var(--accent-teal)" },
    { id: "partner", label: "Partners", color: "var(--warning-amber)" },
];

export const RESOURCES = [
    {
        id: "genomicsdb",
        badge: "GDB",
        name: "GenomicsDB",
        url: "https://www.niagads.org/genomics",
        groupId: "knowledgebase",
        concepts: ["genes", "variants", "gwas", "ld", "cloudAccess", "curatedEvidence"],
    },
    {
        id: "xqtl",
        badge: "xQTL",
        name: "xQTL Browser",
        url: "https://xqtl.niagads.org",
        groupId: "knowledgebase",
        concepts: ["qtls", "variants", "genes", "biosamples"],
    },
    {
        id: "filer",
        badge: "FLR",
        name: "FILER",
        groupId: "knowledgebase",
        concepts: ["regulatory", "biosamples", "downloads", "cloudAccess"],
    },
    {
        id: "dss",
        badge: "DSS",
        name: "DSS Portal",
        url: "https://dss.niagads.org/datasets/",
        groupId: "access",
        concepts: ["downloads"],
    },
    {
        id: "api",
        badge: "API",
        name: "Open Access API",
        url: "https://api.niagads.org",
        groupId: "access",
        concepts: ["cloudAccess"],
    },
    {
        id: "advp",
        badge: "ADVP",
        name: "ADVP",
        url: "https://advp.niagads.org",
        groupId: "partner",
        concepts: ["gwas", "genes", "variants", "curatedEvidence"],
    },
    {
        id: "phc",
        badge: "PHC",
        name: "PHC",
        groupId: "partner",
        concepts: ["harmonizedPhenotypes"],
    },
];
