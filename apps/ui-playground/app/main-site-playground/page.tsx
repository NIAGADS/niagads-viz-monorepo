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
    | "curatedEvidence"
    | "harmonizedPhenotypes"
    | "downloads"
    | "cloudAccess";

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
    { id: "tissues", label: "Tissues / cells", x: 902, y: 76 },
    { id: "harmonizedPhenotypes", label: "Harmonized phenotypes", x: 1078, y: 76 },
    { id: "curatedEvidence", label: "Curated evidence", x: 884, y: 228 },
    { id: "downloads", label: "Downloads", x: 1010, y: 228 },
    { id: "cloudAccess", label: "Programmatic / cloud access", x: 1130, y: 228 },
];

const RESOURCES: Array<{
    id: ResourceId;
    badge: string;
    name: string;
    type: "niagads" | "partner";
    concepts: ConceptId[];
}> = [
    { id: "dss", badge: "DSS", name: "DSS Portal", type: "niagads", concepts: ["downloads"] },
    {
        id: "genomicsdb",
        badge: "GDB",
        name: "GenomicsDB",
        type: "niagads",
        concepts: ["genes", "variants", "loci", "gwas", "ld", "effects", "downloads"],
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
        concepts: ["regulatory", "loci", "tissues", "downloads"],
    },
    { id: "api", badge: "API", name: "Open Access API", type: "niagads", concepts: ["cloudAccess"] },
    {
        id: "advp",
        badge: "ADVP",
        name: "ADVP",
        type: "partner",
        concepts: ["gwas", "genes", "variants", "loci", "curatedEvidence"],
    },
    { id: "phc", badge: "PHC", name: "PHC", type: "partner", concepts: ["harmonizedPhenotypes"] },
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
                        Resources connect to a core genomic landscape plus peripheral context, evidence, download, and
                        programmatic access zones. Hover or focus a resource or concept to highlight relevant
                        connections.
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

                    <g className={styles.peripheralFrame} aria-hidden="true">
                        <path className={styles.contextZone} d="M820 62 H1164 M820 132 H1164" />
                        <text className={styles.zoneLabel} x="824" y="55">
                            Context
                        </text>
                        <path className={styles.accessZone} d="M812 210 H1164 M812 286 H1164" />
                        <text className={styles.zoneLabel} x="816" y="203">
                            Evidence &amp; Access
                        </text>
                    </g>

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
                        <line className={styles.genomeRail} x1="92" x2="812" y1="172" y2="172" />
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
                        {[866, 894, 922, 950].map((x) => (
                            <path
                                className={styles.cell}
                                d={`M ${x} 86 c 9 -18 29 -12 30 4 c 1 16 -18 25 -30 14 c -8 -7 -6 -12 0 -18 Z`}
                                key={x}
                            />
                        ))}
                        <ConceptLabel conceptId="tissues" />
                    </g>

                    <g
                        className={classForConcept("curatedEvidence")}
                        tabIndex={0}
                        role="button"
                        aria-label="Curated evidence"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "curatedEvidence" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "curatedEvidence" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.evidenceMark} d="M842 236 h66 M852 222 h48 M866 250 h32" />
                        <circle className={styles.evidenceDot} cx="842" cy="236" r="5" />
                        <circle className={styles.evidenceDot} cx="852" cy="222" r="4.5" />
                        <circle className={styles.evidenceDot} cx="866" cy="250" r="3.8" />
                        <ConceptLabel conceptId="curatedEvidence" />
                    </g>

                    <g
                        className={classForConcept("harmonizedPhenotypes")}
                        tabIndex={0}
                        role="button"
                        aria-label="Harmonized phenotypes"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "harmonizedPhenotypes" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "harmonizedPhenotypes" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.phenotypeForm} d="M1042 72 h74 v44 h-74 Z" />
                        <path className={styles.check} d="M1056 96 l11 11 l28 -31" />
                        <path className={styles.paperLine} d="M1080 106 h24" />
                        <ConceptLabel conceptId="harmonizedPhenotypes" />
                    </g>

                    <g
                        className={classForConcept("downloads")}
                        tabIndex={0}
                        role="button"
                        aria-label="Downloads"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "downloads" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "downloads" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        {[0, 1, 2].map((layer) => (
                            <path
                                className={styles.datasetLayer}
                                d={`M 968 ${228 + layer * 10} l 42 -17 l 42 17 l -42 17 Z`}
                                key={layer}
                            />
                        ))}
                        <ConceptLabel conceptId="downloads" />
                    </g>

                    <g
                        className={classForConcept("cloudAccess")}
                        tabIndex={0}
                        role="button"
                        aria-label="Programmatic and cloud access"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "cloudAccess" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "cloudAccess" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.apiGate} d="M1100 224 h62 v44 h-62 Z" />
                        <path
                            className={styles.codeMark}
                            d="M1115 238 l-11 8 l11 8 M1147 238 l11 8 l-11 8 M1134 234 l-11 28"
                        />
                        <ConceptLabel conceptId="cloudAccess" />
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
