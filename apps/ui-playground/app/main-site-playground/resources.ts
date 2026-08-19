export const RESOURCE_GROUPS = [
    { id: "knowledgebase", label: "NIAGADS Open Access" },
    { id: "access", label: "NIAGADS Open Access" },
    { id: "partner", label: "Partners" },
];

export const RESOURCES = [
    {
        id: "genomicsdb",
        badge: "GDB",
        name: "GenomicsDB",
        url: "https://www.niagads.org/genomics",
        groupId: "knowledgebase",
    },
    {
        id: "xqtl",
        badge: "xQTL",
        name: "xQTL Browser",
        url: "https://xqtl.niagads.org",
        groupId: "knowledgebase",
    },
    {
        id: "filer",
        badge: "FLR",
        name: "FILER",
        groupId: "knowledgebase",
    },
    {
        id: "dss",
        badge: "DSS",
        name: "DSS Portal",
        url: "https://dss.niagads.org/datasets/",
        groupId: "access",
    },
    {
        id: "api",
        badge: "API",
        name: "Open Access API",
        url: "https://api.niagads.org",
        groupId: "access",
    },
    {
        id: "advp",
        badge: "ADVP",
        name: "ADVP",
        url: "https://advp.niagads.org",
        groupId: "partner",
    },
    {
        id: "phc",
        badge: "PHC",
        name: "PHC",
        groupId: "partner",
    },
];
