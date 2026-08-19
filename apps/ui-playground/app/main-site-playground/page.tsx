"use client";

import { useMemo, useState } from "react";
import styles from "./resource-ecosystem.module.css";

type ConceptId =
    | "genes"
    | "variants"
    | "loci"
    | "gwas"
    | "ld"
    | "qtls"
    | "regulatory"
    | "biosamples"
    | "curatedEvidence"
    | "harmonizedPhenotypes"
    | "downloads"
    | "cloudAccess";

type ResourceId = "dss" | "genomicsdb" | "xqtl" | "filer" | "api" | "advp" | "phc";
type ActiveTarget = { type: "resource"; id: ResourceId } | { type: "concept"; id: ConceptId } | null;

const CONCEPTS: Array<{ id: ConceptId; label: string; x: number; y: number }> = [
    { id: "genes", label: "Genes", x: 220, y: 150 },
    { id: "variants", label: "Variants", x: 390, y: 150 },
    { id: "loci", label: "Genomic regions", x: 1110, y: 146 },
    { id: "gwas", label: "Genetic associations", x: 710, y: 104 },
    { id: "ld", label: "LD", x: 880, y: 180 },
    { id: "qtls", label: "Molecular QTLs", x: 470, y: 210 },
    { id: "regulatory", label: "Regulatory elements", x: 700, y: 210 },
    { id: "biosamples", label: "Biosamples", x: 154, y: 298 },
    { id: "harmonizedPhenotypes", label: "Harmonized phenotypes", x: 336, y: 298 },
    { id: "curatedEvidence", label: "Curated evidence", x: 646, y: 298 },
    { id: "downloads", label: "Downloads", x: 824, y: 298 },
    { id: "cloudAccess", label: "API / cloud access", x: 960, y: 298 },
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
        concepts: ["genes", "variants", "loci", "gwas", "ld", "downloads"],
    },
    {
        id: "xqtl",
        badge: "xQTL",
        name: "xQTL Browser",
        type: "niagads",
        concepts: ["qtls", "genes", "loci", "biosamples"],
    },
    {
        id: "filer",
        badge: "FLR",
        name: "FILER",
        type: "niagads",
        concepts: ["regulatory", "loci", "biosamples", "downloads"],
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

const GENE_EXONS: Array<[number, number]> = [
    [118, 46],
    [218, 58],
    [628, 34],
    [748, 48],
    [982, 26],
    [1080, 52],
];

// Schematic values provide the familiar LD heatmap structure without implying measured data.
const LD_VALUES = [
    [3, 2, 1, 3, 2, 0, 2],
    [3, 1, 2, 0, 2, 3],
    [3, 2, 1, 1, 3],
    [2, 3, 2, 0],
    [1, 2, 3],
    [2, 1],
    [3],
] as const;

const LD_COLORS = ["#edf2f0", "#b9cac6", "#668985", "#173f49"] as const;

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
                    viewBox="0 0 1240 340"
                    role="img"
                    aria-labelledby="ecosystem-title ecosystem-desc"
                >
                    <title id="ecosystem-title">NIAGADS resource ecosystem concept landscape</title>
                    <desc id="ecosystem-desc">
                        Resources connect to a core genomic landscape plus peripheral context, evidence, download, and
                        programmatic access zones. Hover or focus a resource or concept to highlight relevant
                        connections.
                    </desc>

                    <g className={styles.peripheralFrame} aria-hidden="true">
                        <path className={styles.utilityRule} d="M76 278 H1164" />
                        <text className={styles.zoneLabel} x="76" y="306">
                            Context
                        </text>
                        <path className={styles.utilityDivider} d="M520 288 V316" />
                        <text className={styles.zoneLabel} x="542" y="306">
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
                        <path className={styles.associationBaseline} d="M614 128 H806" />
                        {[638, 666, 696, 724, 754, 784].map((x, index) => (
                            <path
                                className={styles.peak}
                                d={`M ${x - 18} 128 L ${x} ${[104, 76, 98, 58, 112, 88][index]} L ${x + 18} 128`}
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
                        <line className={styles.geneTrackHit} x1="92" x2="1160" y1="150" y2="150" />
                        <line className={styles.genomeRail} x1="92" x2="1160" y1="150" y2="150" />
                        {GENE_EXONS.map(([x, width]) => (
                            <rect className={styles.geneExon} x={x} y="142" width={width} height="16" key={x} />
                        ))}
                        <path className={styles.geneDirection} d="M126 142 V132 H146 M141 128 L146 132 L141 136" />
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
                        <rect className={styles.variantHitArea} x="332" y="134" width="116" height="48" rx="5" />
                        {[348, 376, 404, 432].map((x) => (
                            <path className={styles.variant} d={`M ${x} 145 l 5 5 l -5 5 l -5 -5 Z`} key={x} />
                        ))}
                        <text className={styles.conceptLabel} x="390" y="176" textAnchor="middle">
                            Variants
                        </text>
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
                        <path className={styles.regionBrace} d="M1040 132 v-18 h140 v18 M1040 168 v18 h140 v-18" />
                        <text className={styles.conceptLabel} x="1110" y="106" textAnchor="middle">
                            Genomic regions
                        </text>
                    </g>

                    <g
                        className={classForConcept("ld")}
                        tabIndex={0}
                        role="button"
                        aria-label="Linkage disequilibrium, shown as a schematic triangular pairwise matrix"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "ld" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "ld" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.ldTopRule} d="M817 150 H943" />
                        {LD_VALUES[0].map((_, index) => (
                            <path
                                className={styles.ldTick}
                                d={`M ${826 + index * 18} 140 V150`}
                                key={`tick-${index}`}
                            />
                        ))}
                        {LD_VALUES.map((row, rowIndex) =>
                            row.map((value, columnIndex) => {
                                const cx = 826 + rowIndex * 9 + columnIndex * 18;
                                const cy = 159 + rowIndex * 9;

                                return (
                                    <path
                                        className={styles.ldCell}
                                        d={`M ${cx} ${cy - 9} L ${cx + 9} ${cy} L ${cx} ${cy + 9} L ${cx - 9} ${cy} Z`}
                                        fill={LD_COLORS[value]}
                                        key={`${rowIndex}-${columnIndex}`}
                                    />
                                );
                            })
                        )}
                        <text className={styles.conceptLabel} x="880" y="238" textAnchor="middle">
                            LD
                        </text>
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
                        <path className={styles.qtlBridge} d="M350 204 C390 178 432 246 478 214 S552 184 590 212" />
                        <circle className={styles.qtlNode} cx="380" cy="199" r="7" />
                        <circle className={styles.qtlNode} cx="490" cy="210" r="7" />
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
                        <path className={styles.regulatoryArc} d="M612 218 C636 174 692 174 716 218" />
                        <path className={styles.regulatoryArc} d="M704 218 C730 166 794 170 820 218" />
                        <rect className={styles.enhancer} x="646" y="206" width="44" height="10" rx="5" />
                        <rect className={styles.enhancer} x="754" y="206" width="38" height="10" rx="5" />
                        <ConceptLabel conceptId="regulatory" />
                    </g>

                    <g
                        className={classForConcept("biosamples")}
                        tabIndex={0}
                        role="button"
                        aria-label="Biosamples"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "biosamples" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "biosamples" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="134" y="284" width="138" height="38" rx="6" />
                        <path className={styles.biosampleTube} d="M142 288 h12 M145 288 v15 a5 5 0 0 0 10 0 v-15" />
                        <path className={styles.biosampleFill} d="M146 299 h8 v4 a4 4 0 0 1 -8 0 Z" />
                        <UtilityLabel conceptId="biosamples" x={166} y={306} />
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
                        <rect className={styles.utilityHitArea} x="626" y="284" width="158" height="38" rx="6" />
                        <path className={styles.utilityIcon} d="M634 287 h16 l7 7 v18 h-23 Z M650 287 v7 h7" />
                        <path className={styles.utilityAccent} d="m639 302 l4 4 l8 -9" />
                        <UtilityLabel conceptId="curatedEvidence" x={666} y={306} />
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
                        <rect className={styles.utilityHitArea} x="316" y="284" width="190" height="38" rx="6" />
                        <path className={styles.utilityIcon} d="M324 289 h22 v22 h-22 Z M330 286 h10 v6 h-10 Z" />
                        <path className={styles.utilityAccent} d="m329 301 l4 4 l8 -9" />
                        <UtilityLabel conceptId="harmonizedPhenotypes" x={356} y={306} />
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
                        <rect className={styles.utilityHitArea} x="804" y="284" width="120" height="38" rx="6" />
                        <path className={styles.utilityIcon} d="M824 286 v15 M818 296 l6 6 l6 -6 M815 308 v4 h18 v-4" />
                        <UtilityLabel conceptId="downloads" x={844} y={306} />
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
                        <rect className={styles.utilityHitArea} x="940" y="284" width="178" height="38" rx="6" />
                        <path
                            className={styles.utilityIcon}
                            d="M950 308 h30 a7 7 0 0 0 1 -14 a11 11 0 0 0 -21 -3 a8 8 0 0 0 -10 17 Z"
                        />
                        <path className={styles.utilityAccent} d="M960 297 l-4 4 l4 4 M970 297 l4 4 l-4 4" />
                        <UtilityLabel conceptId="cloudAccess" x={990} y={306} />
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

function UtilityLabel({ conceptId, x, y }: { conceptId: ConceptId; x: number; y: number }) {
    return (
        <text className={styles.utilityLabel} x={x} y={y} textAnchor="start">
            {conceptById[conceptId].label}
        </text>
    );
}
