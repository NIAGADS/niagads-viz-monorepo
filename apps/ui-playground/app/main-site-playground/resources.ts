export const RESOURCE_GROUPS = [
    { id: "knowledgebase", label: "NIAGADS Resources", color: "var(--primary-blue)" },
    { id: "access", label: "NIAGADS Resources", color: "var(--accent-teal)" },
    { id: "partner", label: "Partner Resources", color: "var(--warning-amber)" },
];

export const RESOURCES = [
    {
        id: "genomicsdb",
        badge: "GDB",
        name: "GenomicsDB",
        url: "https://www.niagads.org/genomics",
        groupId: "knowledgebase",
        concepts: ["genes", "variants", "gwas", "ld", "cloudAccess", "curatedEvidence", "openAccess", "phenotypes"],
    },
    {
        id: "xqtl",
        badge: "xQTL",
        name: "xQTL Browser",
        url: "https://xqtl.niagads.org",
        groupId: "knowledgebase",
        concepts: ["qtls", "variants", "genes", "biosamples", "openAccess"],
    },
    {
        id: "filer",
        badge: "FLR",
        name: "FILER",
        groupId: "knowledgebase",
        concepts: ["regulatory", "biosamples", "downloads", "cloudAccess", "openAccess"],
    },
    {
        id: "dss",
        badge: "DSS",
        name: "DSS",
        url: "https://dss.niagads.org/datasets/",
        groupId: "access",
        concepts: ["downloads", "openAccess", "restrictedAccess"],
    },
    {
        id: "api",
        badge: "API",
        name: "Open Access API",
        url: "https://api.niagads.org",
        groupId: "access",
        concepts: ["cloudAccess", "openAccess"],
    },
    {
        id: "advp",
        badge: "ADVP",
        name: "ADVP",
        url: "https://advp.niagads.org",
        groupId: "partner",
        concepts: ["gwas", "genes", "variants", "curatedEvidence", "openAccess", "phenotypes"],
    },
    {
        id: "phc",
        badge: "PHC",
        name: "PHC",
        groupId: "partner",
        concepts: ["phenotypes", "restrictedAccess"],
    },
];
