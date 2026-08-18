"use client";

import { useMemo, useState } from "react";
import styles from "./resource-ecosystem.module.css";

type ConceptId =
    | "genes"
    | "variants"
    | "loci"
    | "gwas"
    | "ld"
    | "effects"
    | "qtls"
    | "regulatory"
    | "tissues"
    | "publications"
    | "phenotypes"
    | "datasets"
    | "programmatic";

type ResourceId = "dss" | "genomicsdb" | "xqtl" | "filer" | "api" | "advp" | "phc";
type ActiveTarget = { type: "resource"; id: ResourceId } | { type: "concept"; id: ConceptId } | null;

const CONCEPTS: Array<{ id: ConceptId; label: string; x: number; y: number }> = [
    { id: "genes", label: "Genes", x: 180, y: 172 },
    { id: "variants", label: "Variants", x: 300, y: 166 },
    { id: "loci", label: "Genomic regions", x: 425, y: 164 },
    { id: "gwas", label: "Genetic associations", x: 560, y: 125 },
    { id: "ld", label: "LD", x: 683, y: 168 },
    { id: "effects", label: "Variant effects", x: 782, y: 216 },
    { id: "qtls", label: "Molecular QTLs", x: 380, y: 236 },
    { id: "regulatory", label: "Regulatory elements", x: 528, y: 260 },
    { id: "tissues", label: "Tissues / cells", x: 676, y: 272 },
    { id: "publications", label: "Publications", x: 820, y: 116 },
    { id: "phenotypes", label: "Phenotypes", x: 914, y: 176 },
    { id: "datasets", label: "Datasets / files", x: 986, y: 238 },
    { id: "programmatic", label: "Programmatic access", x: 1078, y: 184 },
];

const RESOURCES: Array<{
    id: ResourceId;
    badge: string;
    name: string;
    type: "niagads" | "partner";
    concepts: ConceptId[];
}> = [
    { id: "dss", badge: "DSS", name: "DSS Portal", type: "niagads", concepts: ["datasets"] },
    {
        id: "genomicsdb",
        badge: "GDB",
        name: "GenomicsDB",
        type: "niagads",
        concepts: ["genes", "variants", "loci", "gwas", "ld", "effects", "datasets"],
    },
    {
        id: "xqtl",
        badge: "xQTL",
        name: "xQTL Browser",
        type: "niagads",
        concepts: ["qtls", "genes", "loci", "tissues"],
    },
    {
        id: "filer",
        badge: "FLR",
        name: "FILER",
        type: "niagads",
        concepts: ["regulatory", "loci", "tissues", "datasets"],
    },
    { id: "api", badge: "API", name: "Open Access API", type: "niagads", concepts: ["programmatic"] },
    {
        id: "advp",
        badge: "ADVP",
        name: "ADVP",
        type: "partner",
        concepts: ["gwas", "genes", "variants", "loci", "publications"],
    },
    { id: "phc", badge: "PHC", name: "PHC", type: "partner", concepts: ["phenotypes"] },
];

const RESOURCE_X: Record<ResourceId, number> = {
    dss: 116,
    genomicsdb: 300,
    xqtl: 495,
    filer: 660,
    api: 828,
    advp: 1000,
    phc: 1134,
};

const GENE_BLOCKS: Array<[number, number, number, string]> = [
    [122, 172, 38, "APP"],
    [175, 172, 52, "APOE"],
    [246, 172, 44, "BIN1"],
    [358, 172, 88, "region"],
    [468, 172, 54, "CLU"],
    [760, 172, 44, "TREM2"],
    [944, 172, 78, "file set"],
];

const conceptById = Object.fromEntries(CONCEPTS.map((concept) => [concept.id, concept])) as Record<
    ConceptId,
    (typeof CONCEPTS)[number]
>;
const resourceById = Object.fromEntries(RESOURCES.map((resource) => [resource.id, resource])) as Record<
    ResourceId,
    (typeof RESOURCES)[number]
>;

export default function MainSitePlayground() {
    const [active, setActive] = useState<ActiveTarget>(null);

    const conceptToResources = useMemo(() => {
        return Object.fromEntries(
            CONCEPTS.map((concept) => [
                concept.id,
                RESOURCES.filter((resource) => resource.concepts.includes(concept.id)).map((resource) => resource.id),
            ])
        ) as Record<ConceptId, ResourceId[]>;
    }, []);

    const activeConcepts = useMemo(() => {
        if (!active) {
            return new Set<ConceptId>();
        }

        if (active.type === "resource") {
            return new Set(resourceById[active.id].concepts);
        }

        return new Set<ConceptId>([active.id]);
    }, [active]);

    const activeResources = useMemo(() => {
        if (!active) {
            return new Set<ResourceId>();
        }

        if (active.type === "resource") {
            return new Set<ResourceId>([active.id]);
        }

        return new Set<ResourceId>(conceptToResources[active.id]);
    }, [active, conceptToResources]);

    const classForConcept = (id: ConceptId) =>
        [
            styles.conceptMark,
            active && !activeConcepts.has(id) ? styles.recede : "",
            activeConcepts.has(id) ? styles.active : "",
        ]
            .filter(Boolean)
            .join(" ");

    const classForResource = (id: ResourceId) =>
        [
            styles.resource,
            resourceById[id].type === "partner" ? styles.partner : "",
            active && !activeResources.has(id) ? styles.recede : "",
            activeResources.has(id) ? styles.active : "",
        ]
            .filter(Boolean)
            .join(" ");

    const pathClass = (resourceId: ResourceId, conceptId: ConceptId) =>
        [
            styles.link,
            resourceById[resourceId].type === "partner" ? styles.partnerLink : "",
            active && !(activeResources.has(resourceId) && activeConcepts.has(conceptId)) ? styles.recede : "",
            activeResources.has(resourceId) && activeConcepts.has(conceptId) ? styles.active : "",
        ]
            .filter(Boolean)
            .join(" ");

    return (
        <main className={styles.shell}>
            <section className={styles.ecosystem} aria-label="NIAGADS homepage resource visualization prototype">
                <div className={styles.resourceRow} aria-label="Resources">
                    {RESOURCES.map((resource) => (
                        <a
                            className={classForResource(resource.id)}
                            href={`#${resource.id}`}
                            key={resource.id}
                            onBlur={() => setActive(null)}
                            onFocus={() => setActive({ type: "resource", id: resource.id })}
                            onMouseEnter={() => setActive({ type: "resource", id: resource.id })}
                            onMouseLeave={() => setActive(null)}
                        >
                            <span className={styles.badge}>{resource.badge}</span>
                            <span className={styles.name}>{resource.name}</span>
                        </a>
                    ))}
                </div>

                <svg
                    className={styles.landscape}
                    viewBox="0 0 1240 330"
                    role="img"
                    aria-labelledby="ecosystem-title ecosystem-desc"
                >
                    <title id="ecosystem-title">NIAGADS resource ecosystem concept landscape</title>
                    <desc id="ecosystem-desc">
                        Resources connect to genomic, molecular, evidence, phenotype, dataset, and programmatic access
                        concepts. Hover or focus a resource or concept to highlight relevant connections.
                    </desc>

                    <defs>
                        <linearGradient
                            id="railGradient"
                            x1="88"
                            x2="1128"
                            y1="0"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#496B83" />
                            <stop offset="0.45" stopColor="#28756C" />
                            <stop offset="1" stopColor="#675D8D" />
                        </linearGradient>
                        <pattern id="ldPattern" width="18" height="18" patternUnits="userSpaceOnUse">
                            <rect width="18" height="18" fill="#eef4f2" />
                            <rect width="9" height="9" fill="#6a9589" opacity="0.62" />
                            <rect x="9" y="9" width="9" height="9" fill="#355f67" opacity="0.42" />
                        </pattern>
                    </defs>

                    <g className={styles.contextLayer}>
                        <path
                            className={styles.softContour}
                            d="M92 126 C235 76 392 95 530 132 S799 185 950 132 1138 100 1180 146"
                        />
                        <path
                            className={styles.softContour}
                            d="M118 265 C274 216 410 254 556 242 S785 204 910 249 1082 286 1176 244"
                        />
                        <line className={styles.resourceRail} x1="76" x2="1164" y1="32" y2="32" />
                        <line className={styles.genomeRail} x1="92" x2="1134" y1="172" y2="172" />
                        {GENE_BLOCKS.map(([x, y, width, label]) => (
                            <g key={`${x}-${label}`}>
                                <rect className={styles.geneBlock} x={x} y={y - 12} width={width} height="24" rx="4" />
                                <text className={styles.microLabel} x={x + width / 2} y={y + 4} textAnchor="middle">
                                    {label}
                                </text>
                            </g>
                        ))}
                    </g>

                    <g className={styles.linkLayer} aria-hidden="true">
                        {RESOURCES.flatMap((resource) =>
                            resource.concepts.map((conceptId) => {
                                const concept = conceptById[conceptId];
                                const start = RESOURCE_X[resource.id];
                                const bend = Math.max(62, concept.y - 58);
                                return (
                                    <path
                                        className={pathClass(resource.id, conceptId)}
                                        d={`M ${start} 42 C ${start} ${bend}, ${concept.x} ${bend}, ${concept.x} ${concept.y - 18}`}
                                        key={`${resource.id}-${conceptId}`}
                                    />
                                );
                            })
                        )}
                    </g>

                    <g
                        className={classForConcept("gwas")}
                        tabIndex={0}
                        role="button"
                        aria-label="Genetic associations"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "gwas" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "gwas" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.associationBaseline} d="M478 145 H642" />
                        {[502, 526, 552, 575, 598, 623].map((x, index) => (
                            <path
                                className={styles.peak}
                                d={`M ${x - 16} 145 L ${x} ${[122, 94, 116, 78, 130, 108][index]} L ${x + 16} 145`}
                                key={x}
                            />
                        ))}
                        <ConceptLabel conceptId="gwas" />
                    </g>

                    <g
                        className={classForConcept("genes")}
                        tabIndex={0}
                        role="button"
                        aria-label="Genes"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "genes" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "genes" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.dnaHelix} d="M118 147 C150 122 183 222 216 197 S280 122 314 147" />
                        <path className={styles.dnaHelix} d="M118 197 C150 222 183 122 216 147 S280 222 314 197" />
                        {[132, 164, 196, 228, 260, 292].map((x) => (
                            <line className={styles.rung} x1={x} x2={x + 18} y1="156" y2="188" key={x} />
                        ))}
                        <ConceptLabel conceptId="genes" />
                    </g>

                    <g
                        className={classForConcept("variants")}
                        tabIndex={0}
                        role="button"
                        aria-label="Variants"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "variants" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "variants" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        {[270, 294, 320, 342].map((x, index) => (
                            <path
                                className={styles.variant}
                                d={`M ${x} ${[152, 184, 158, 176][index]} l 8 8 l -8 8 l -8 -8 Z`}
                                key={x}
                            />
                        ))}
                        <ConceptLabel conceptId="variants" />
                    </g>

                    <g
                        className={classForConcept("loci")}
                        tabIndex={0}
                        role="button"
                        aria-label="Genomic regions"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "loci" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "loci" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.regionBrace} d="M360 150 v-18 h136 v18 M360 194 v18 h136 v-18" />
                        <ConceptLabel conceptId="loci" />
                    </g>

                    <g
                        className={classForConcept("ld")}
                        tabIndex={0}
                        role="button"
                        aria-label="Linkage disequilibrium"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "ld" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "ld" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.ldDiamond} d="M638 168 L683 123 L728 168 L683 213 Z" />
                        {[0, 1, 2, 3].map((row) =>
                            [0, 1, 2, 3].map((col) => (
                                <rect
                                    className={styles.ldTile}
                                    x={665 + (col - row) * 11}
                                    y={128 + (col + row) * 11}
                                    width="15"
                                    height="15"
                                    transform="rotate(45 672.5 135.5)"
                                    key={`${row}-${col}`}
                                />
                            ))
                        )}
                        <ConceptLabel conceptId="ld" />
                    </g>

                    <g
                        className={classForConcept("effects")}
                        tabIndex={0}
                        role="button"
                        aria-label="Variant effects"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "effects" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "effects" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.effectRibbon} d="M726 204 C758 185 779 184 814 206 S862 232 884 203" />
                        <circle className={styles.effectDot} cx="774" cy="206" r="8" />
                        <circle className={styles.effectDot} cx="842" cy="222" r="6" />
                        <ConceptLabel conceptId="effects" />
                    </g>

                    <g
                        className={classForConcept("qtls")}
                        tabIndex={0}
                        role="button"
                        aria-label="Molecular QTLs"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "qtls" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "qtls" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.qtlBridge} d="M304 222 C335 198 373 274 414 238 S472 208 496 232" />
                        <circle className={styles.qtlNode} cx="326" cy="218" r="7" />
                        <circle className={styles.qtlNode} cx="424" cy="235" r="7" />
                        <ConceptLabel conceptId="qtls" />
                    </g>

                    <g
                        className={classForConcept("regulatory")}
                        tabIndex={0}
                        role="button"
                        aria-label="Regulatory elements"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "regulatory" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "regulatory" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.regulatoryArc} d="M462 266 C482 220 536 220 556 266" />
                        <path className={styles.regulatoryArc} d="M544 266 C568 208 626 214 650 266" />
                        <rect className={styles.enhancer} x="486" y="254" width="42" height="10" rx="5" />
                        <rect className={styles.enhancer} x="588" y="254" width="34" height="10" rx="5" />
                        <ConceptLabel conceptId="regulatory" />
                    </g>

                    <g
                        className={classForConcept("tissues")}
                        tabIndex={0}
                        role="button"
                        aria-label="Tissues and cell types"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "tissues" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "tissues" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        {[628, 656, 684, 712].map((x) => (
                            <path
                                className={styles.cell}
                                d={`M ${x} 272 c 10 -20 31 -13 32 5 c 1 17 -19 27 -32 15 c -9 -7 -7 -13 0 -20 Z`}
                                key={x}
                            />
                        ))}
                        <ConceptLabel conceptId="tissues" />
                    </g>

                    <g
                        className={classForConcept("publications")}
                        tabIndex={0}
                        role="button"
                        aria-label="Publications"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "publications" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "publications" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.paper} d="M792 82 h54 l20 20 v70 h-74 Z" />
                        <path className={styles.paperFold} d="M846 82 v20 h20" />
                        <path className={styles.paperLine} d="M806 122 h42 M806 140 h34" />
                        <ConceptLabel conceptId="publications" />
                    </g>

                    <g
                        className={classForConcept("phenotypes")}
                        tabIndex={0}
                        role="button"
                        aria-label="Phenotypes"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "phenotypes" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "phenotypes" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.phenotypeForm} d="M890 132 h70 v86 h-70 Z" />
                        <path className={styles.check} d="M906 166 l12 12 l28 -32" />
                        <path className={styles.paperLine} d="M906 194 h38" />
                        <ConceptLabel conceptId="phenotypes" />
                    </g>

                    <g
                        className={classForConcept("datasets")}
                        tabIndex={0}
                        role="button"
                        aria-label="Datasets and files"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "datasets" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "datasets" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        {[0, 1, 2].map((layer) => (
                            <path
                                className={styles.datasetLayer}
                                d={`M 938 ${224 + layer * 16} l 56 -25 l 56 25 l -56 25 Z`}
                                key={layer}
                            />
                        ))}
                        <ConceptLabel conceptId="datasets" />
                    </g>

                    <g
                        className={classForConcept("programmatic")}
                        tabIndex={0}
                        role="button"
                        aria-label="Programmatic access"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "programmatic" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "programmatic" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.apiGate} d="M1044 145 h82 v76 h-82 Z" />
                        <path
                            className={styles.codeMark}
                            d="M1066 170 l-14 13 l14 13 M1104 170 l14 13 l-14 13 M1089 166 l-14 34"
                        />
                        <ConceptLabel conceptId="programmatic" />
                    </g>
                </svg>
            </section>
        </main>
    );
}

function ConceptLabel({ conceptId }: { conceptId: ConceptId }) {
    const concept = conceptById[conceptId];

    return (
        <text className={styles.conceptLabel} x={concept.x} y={concept.y + 44} textAnchor="middle">
            {concept.label}
        </text>
    );
}
