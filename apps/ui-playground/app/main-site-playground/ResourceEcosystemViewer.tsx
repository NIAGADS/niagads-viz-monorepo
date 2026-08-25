"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import styles from "./resource-ecosystem.module.css";
import { RESOURCE_ECOSYSTEM_OVERVIEW } from "./resources";

export type ConceptType =
    | "genes"
    | "variants"
    | "gwas"
    | "ld"
    | "qtls"
    | "regulatory"
    | "biosamples"
    | "curatedEvidence"
    | "phenotypes"
    | "openAccess"
    | "restrictedAccess"
    | "downloads"
    | "cloudAccess";

interface Concept {
    id: ConceptType;
    label: string;
    x: number;
    y: number;
}

export interface ResourceGroup {
    id: string;
    label: string;
    color: string;
}

export interface Resource {
    id: string;
    badge: string;
    name: string;
    description: string;
    url?: string;
    groupId: string;
    concepts: ConceptType[];
}

interface ResourceEcosystemViewerProps {
    resources: Resource[];
    resourceGroups: ResourceGroup[];
}

interface ResourceGroupLabel {
    label: string;
    start: number;
    span: number;
}

type ActiveTarget = { type: "resource"; id: string } | { type: "concept"; id: ConceptType } | null;

const CONCEPTS: Concept[] = [
    { id: "genes", label: "Genes", x: 220, y: 150 },
    { id: "variants", label: "Variants", x: 390, y: 150 },
    { id: "gwas", label: "Genetic associations", x: 390, y: 90 },
    { id: "ld", label: "LD", x: 390, y: 210 },
    { id: "qtls", label: "Molecular QTLs", x: 890, y: 168 },
    { id: "regulatory", label: "Regulatory elements", x: 650, y: 150 },
    { id: "biosamples", label: "Biosamples", x: 201, y: 300 },
    { id: "curatedEvidence", label: "Curated evidence", x: 365, y: 300 },
    { id: "phenotypes", label: "Phenotypes", x: 538, y: 300 },
    { id: "openAccess", label: "Open", x: 760, y: 300 },
    { id: "restrictedAccess", label: "Restricted", x: 865, y: 300 },
    { id: "downloads", label: "Downloads", x: 982, y: 300 },
    { id: "cloudAccess", label: "API / Cloud", x: 1124, y: 300 },
];

const LANDSCAPE_WIDTH = 1240;

function getFallbackResourceCenterX(index: number, resourceCount: number) {
    return ((index + 0.5) / resourceCount) * LANDSCAPE_WIDTH;
}

const GENE_EXONS: Array<[number, number]> = [
    [118, 46],
    [218, 58],
    [628, 80],
    [748, 48],
    [982, 26],
    [1080, 52],
];

// Deterministic schematic Manhattan profile; these are not measured association values.
const ASSOCIATION_POINT_Y = [
    118, 114, 122, 110, 116, 104, 120, 112, 98, 88, 76, 92, 108, 119, 114, 102, 97, 84, 68, 90, 105, 118, 111, 95, 80,
    99, 116, 121, 109,
] as const;

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

const LD_COLORS = ["var(--gray-100)", "var(--gray-300)", "var(--secondary-blue)", "var(--primary-blue)"] as const;

const conceptById = Object.fromEntries(CONCEPTS.map((concept) => [concept.id, concept])) as Record<
    ConceptType,
    (typeof CONCEPTS)[number]
>;

export function ResourceEcosystemViewer({ resources, resourceGroups }: ResourceEcosystemViewerProps) {
    const [active, setActive] = useState<ActiveTarget>(null);
    const [detailResourceId, setDetailResourceId] = useState<string | null>(null);
    const [resourceCenterX, setResourceCenterX] = useState<Record<string, number>>({});
    const resourceRowRef = useRef<HTMLDivElement>(null);
    const detailHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resourceGridStyle = { "--resource-count": resources.length } as CSSProperties;
    const resourceById = useMemo(
        () => Object.fromEntries(resources.map((resource) => [resource.id, resource])) as Record<string, Resource>,
        [resources]
    );
    const resourceGroupById = useMemo(
        () => Object.fromEntries(resourceGroups.map((group) => [group.id, group])) as Record<string, ResourceGroup>,
        [resourceGroups]
    );
    const resourceGroupLabels = useMemo(
        () =>
            resources.reduce<ResourceGroupLabel[]>((labels, resource, index) => {
                const label = resourceGroupById[resource.groupId].label;
                const previous = labels.at(-1);

                // FIXME: Groups sharing a label are merged only when their resources are adjacent in user-defined order.
                if (previous?.label === label) {
                    previous.span += 1;
                } else {
                    labels.push({ label, start: index + 1, span: 1 });
                }

                return labels;
            }, []),
        [resourceGroupById, resources]
    );

    useEffect(() => {
        const resourceRow = resourceRowRef.current;

        if (!resourceRow) {
            return;
        }

        const measureResourceCenters = () => {
            const rowBounds = resourceRow.getBoundingClientRect();

            if (rowBounds.width === 0) {
                return;
            }

            const centers: Record<string, number> = {};

            resourceRow.querySelectorAll<HTMLElement>("[data-resource-id]").forEach((resourceElement) => {
                const resourceId = resourceElement.dataset.resourceId;

                if (resourceId) {
                    const resourceBounds = resourceElement.getBoundingClientRect();
                    const centerInRow = resourceBounds.left + resourceBounds.width / 2 - rowBounds.left;
                    centers[resourceId] = (centerInRow / rowBounds.width) * LANDSCAPE_WIDTH;
                }
            });

            setResourceCenterX(centers);
        };

        measureResourceCenters();

        const resizeObserver = new ResizeObserver(measureResourceCenters);
        resizeObserver.observe(resourceRow);
        resourceRow.querySelectorAll<HTMLElement>("[data-resource-id]").forEach((resourceElement) => {
            resizeObserver.observe(resourceElement);
        });

        return () => resizeObserver.disconnect();
    }, [resources]);

    const conceptToResources = useMemo(() => {
        return Object.fromEntries(
            CONCEPTS.map((concept) => [
                concept.id,
                resources.filter((resource) => resource.concepts.includes(concept.id)).map((resource) => resource.id),
            ])
        ) as Record<ConceptType, string[]>;
    }, [resources]);

    const activeConcepts = useMemo(() => {
        if (!active) {
            return new Set<ConceptType>();
        }

        if (active.type === "resource") {
            return new Set(resourceById[active.id].concepts);
        }

        return new Set<ConceptType>([active.id]);
    }, [active, resourceById]);

    const activeResources = useMemo(() => {
        if (!active) {
            return new Set<string>();
        }

        if (active.type === "resource") {
            return new Set<string>([active.id]);
        }

        return new Set<string>(conceptToResources[active.id]);
    }, [active, conceptToResources]);

    const clearDetailHideTimer = () => {
        if (detailHideTimerRef.current) {
            clearTimeout(detailHideTimerRef.current);
            detailHideTimerRef.current = null;
        }
    };

    const showResourceDetail = (resourceId: string) => {
        clearDetailHideTimer();
        setDetailResourceId(resourceId);
        setActive({ type: "resource", id: resourceId });
    };

    const hideResourceDetail = (resourceId: string) => {
        clearDetailHideTimer();
        detailHideTimerRef.current = setTimeout(() => {
            setDetailResourceId(null);
            setActive((current) => (current?.type === "resource" && current.id === resourceId ? null : current));
            detailHideTimerRef.current = null;
        }, 120);
    };

    const detailResource = detailResourceId ? resourceById[detailResourceId] : undefined;

    const classForConcept = (id: ConceptType) =>
        [
            styles.conceptMark,
            active && !activeConcepts.has(id) ? styles.recede : "",
            activeConcepts.has(id) ? styles.active : "",
        ]
            .filter(Boolean)
            .join(" ");

    const classForResource = (id: string, index: number) => {
        const resource = resourceById[id];
        const startsGroup = index > 0 && resources[index - 1].groupId !== resource.groupId;

        return [
            styles.resource,
            startsGroup ? styles.groupStart : "",
            active && !activeResources.has(id) ? styles.recede : "",
            activeResources.has(id) ? styles.active : "",
        ]
            .filter(Boolean)
            .join(" ");
    };

    const pathClass = (resourceId: string, conceptId: ConceptType) =>
        [
            styles.link,
            active && !(activeResources.has(resourceId) && activeConcepts.has(conceptId)) ? styles.recede : "",
            activeResources.has(resourceId) && activeConcepts.has(conceptId) ? styles.active : "",
        ]
            .filter(Boolean)
            .join(" ");

    return (
        <main className={styles.shell}>
            <section className={styles.ecosystem} aria-label="NIAGADS homepage resource visualization prototype">
                <div className={styles.resourceGroupLabels} aria-hidden="true" style={resourceGridStyle}>
                    {resourceGroupLabels.map((groupLabel) => (
                        <span
                            className={styles.groupLabel}
                            key={`${groupLabel.label}-${groupLabel.start}`}
                            style={{ gridColumn: `${groupLabel.start} / span ${groupLabel.span}` }}
                        >
                            {groupLabel.label}
                        </span>
                    ))}
                </div>
                <div
                    className={styles.resourceRow}
                    aria-label="Resources"
                    ref={resourceRowRef}
                    style={resourceGridStyle}
                >
                    {resources.map((resource, resourceIndex) => (
                        <button
                            className={classForResource(resource.id, resourceIndex)}
                            aria-label={resource.name}
                            data-resource-id={resource.id}
                            key={resource.id}
                            style={
                                {
                                    "--resource-color": resourceGroupById[resource.groupId].color,
                                } as CSSProperties
                            }
                            type="button"
                            onBlur={() => hideResourceDetail(resource.id)}
                            onFocus={() => showResourceDetail(resource.id)}
                            onMouseEnter={() => showResourceDetail(resource.id)}
                            onMouseLeave={() => hideResourceDetail(resource.id)}
                            onPointerDown={() => showResourceDetail(resource.id)}
                        >
                            <span className={styles.badge}>{resource.badge}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.resourceDetailSlot}>
                    <aside
                        aria-label={`${detailResource?.name ?? "NIAGADS resource ecosystem"} description`}
                        className={`${styles.resourceDetail} ${detailResource ? "" : styles.defaultDetail}`}
                        onFocus={clearDetailHideTimer}
                        onMouseEnter={clearDetailHideTimer}
                        onMouseLeave={detailResource ? () => hideResourceDetail(detailResource.id) : undefined}
                        onPointerDown={clearDetailHideTimer}
                    >
                        <div className={styles.resourceDetailHeader}>
                            <h2>{detailResource?.name ?? RESOURCE_ECOSYSTEM_OVERVIEW.title}</h2>
                        </div>
                        <p>
                            {detailResource?.description ?? RESOURCE_ECOSYSTEM_OVERVIEW.description}
                            {!detailResource ? (
                                <strong className={styles.detailInstruction}>
                                    {RESOURCE_ECOSYSTEM_OVERVIEW.instruction}
                                </strong>
                            ) : null}
                        </p>
                        {detailResource?.url ? (
                            <a
                                className={styles.resourceDetailAction}
                                href={detailResource.url}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Explore resource <span aria-hidden="true">→</span>
                            </a>
                        ) : null}
                    </aside>
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

                    <defs>
                        <pattern id="regulatoryEnhancerPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                            <rect width="6" height="6" fill="var(--gray-100)" />
                            <path d="M-1 1 L1 -1 M0 6 L6 0 M5 7 L7 5" stroke="var(--gray-500)" strokeWidth="1" />
                        </pattern>
                        <pattern id="regulatoryPromoterPattern" width="5" height="5" patternUnits="userSpaceOnUse">
                            <rect width="5" height="5" fill="var(--gray-100)" />
                            <path d="M2.5 0 V5" stroke="var(--gray-500)" strokeWidth="1" />
                        </pattern>
                        <pattern id="regulatorySilencerPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                            <rect width="6" height="6" fill="var(--gray-100)" />
                            <path d="M-1 5 L1 7 M0 0 L6 6 M5 -1 L7 1" stroke="var(--gray-500)" strokeWidth="1" />
                        </pattern>
                    </defs>

                    <g className={styles.peripheralFrame} aria-hidden="true">
                        <path className={styles.utilityRule} d="M76 278 H1164" />
                        <text className={styles.zoneLabel} x="76" y="305">
                            Context
                        </text>
                        <path className={styles.utilityDivider} d="M630 286 V316" />
                        <text className={styles.zoneLabel} x="650" y="305">
                            Access
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
                        {resources.flatMap((resource, resourceIndex) =>
                            resource.concepts.map((conceptId) => {
                                const concept = conceptById[conceptId];
                                const start =
                                    resourceCenterX[resource.id] ??
                                    getFallbackResourceCenterX(resourceIndex, resources.length);
                                const bend = Math.max(62, concept.y - 58);
                                return (
                                    <path
                                        className={pathClass(resource.id, conceptId)}
                                        d={`M ${start} 42 C ${start} ${bend}, ${concept.x} ${bend}, ${concept.x} ${concept.y - 18}`}
                                        key={`${resource.id}-${conceptId}`}
                                        style={{ stroke: resourceGroupById[resource.groupId].color }}
                                    />
                                );
                            })
                        )}
                    </g>

                    <g
                        className={classForConcept("gwas")}
                        tabIndex={0}
                        role="button"
                        aria-label="Genetic associations, shown as a schematic Manhattan plot"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "gwas" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "gwas" })}
                        onPointerDown={() => setActive({ type: "concept", id: "gwas" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect fill="none" pointerEvents="all" x="330" y="42" width="120" height="90" rx="6" />
                        <path className={styles.associationBaseline} d="M341 128 H439" />
                        <path className={styles.associationThreshold} d="M341 96 H439" />
                        {ASSOCIATION_POINT_Y.map((y, index) => (
                            <circle
                                className={`${styles.associationPoint} ${y < 96 ? styles.associationPointSignificant : ""}`}
                                cx={341 + index * 3.5}
                                cy={y}
                                r={y < 96 ? 2.2 : 1.7}
                                key={index}
                            />
                        ))}
                        <text className={styles.conceptLabel} x="390" y="56" textAnchor="middle">
                            Genetic associations
                        </text>
                    </g>

                    <g
                        className={classForConcept("genes")}
                        tabIndex={0}
                        role="button"
                        aria-label="Genes"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "genes" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "genes" })}
                        onPointerDown={() => setActive({ type: "concept", id: "genes" })}
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
                        onPointerDown={() => setActive({ type: "concept", id: "variants" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.variantHitArea} x="332" y="134" width="116" height="48" rx="5" />
                        {[348, 362, 376, 390, 404, 418, 432].map((x) => (
                            <path className={styles.variant} d={`M ${x} 145 l 5 5 l -5 5 l -5 -5 Z`} key={x} />
                        ))}
                        <text className={styles.conceptLabel} x="390" y="176" textAnchor="middle">
                            Variants
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
                        onPointerDown={() => setActive({ type: "concept", id: "ld" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <path className={styles.ldTopRule} d="M341 190 H439" />
                        {LD_VALUES[0].map((_, index) => (
                            <path
                                className={styles.ldTick}
                                d={`M ${348 + index * 14} 182 V190`}
                                key={`tick-${index}`}
                            />
                        ))}
                        {LD_VALUES.map((row, rowIndex) =>
                            row.map((value, columnIndex) => {
                                const cx = 348 + rowIndex * 7 + columnIndex * 14;
                                const cy = 197 + rowIndex * 7;

                                return (
                                    <path
                                        className={styles.ldCell}
                                        d={`M ${cx} ${cy - 7} L ${cx + 7} ${cy} L ${cx} ${cy + 7} L ${cx - 7} ${cy} Z`}
                                        fill={LD_COLORS[value]}
                                        key={`${rowIndex}-${columnIndex}`}
                                    />
                                );
                            })
                        )}
                        <text className={styles.conceptLabel} x="390" y="264" textAnchor="middle">
                            LD
                        </text>
                    </g>

                    <g
                        className={classForConcept("qtls")}
                        tabIndex={0}
                        role="button"
                        aria-label="Molecular QTLs, shown as multiple relationships from a variant to genomic targets"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "qtls" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "qtls" })}
                        onPointerDown={() => setActive({ type: "concept", id: "qtls" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.qtlHitArea} x="764" y="108" width="310" height="146" rx="6" />
                        <path className={styles.qtlBridge} d="M890 150 C878 122 852 122 840 150" />
                        <path className={styles.qtlBridge} d="M890 150 C865 205 812 205 780 158" />
                        <path className={styles.qtlBridge} d="M890 150 C915 196 970 196 995 158" />
                        <path className={styles.qtlBridge} d="M890 150 C930 222 1020 222 1060 150" />
                        <path className={styles.variant} d="M890 144 l6 6 l-6 6 l-6 -6 Z" />
                        <text className={styles.conceptLabel} x="920" y="246" textAnchor="middle">
                            Molecular QTLs
                        </text>
                    </g>

                    <g
                        className={classForConcept("regulatory")}
                        tabIndex={0}
                        role="button"
                        aria-label="Regulatory elements"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "regulatory" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "regulatory" })}
                        onPointerDown={() => setActive({ type: "concept", id: "regulatory" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.regulatoryHitArea} x="524" y="104" width="250" height="94" rx="6" />
                        <path className={styles.regulatoryLoop} d="M556 142 C566 110 608 110 618 140" />
                        <rect className={styles.regulatoryEnhancer} x="540" y="142" width="32" height="16" rx="2" />
                        <rect className={styles.regulatoryPromoter} x="610" y="140" width="16" height="20" rx="2" />
                        <rect className={styles.regulatorySilencer} x="730" y="143" width="28" height="14" rx="2" />
                        <text className={styles.regulatoryMicroLabel} x="556" y="136" textAnchor="middle">
                            Enhancer
                        </text>
                        <text className={styles.regulatoryMicroLabel} x="618" y="174" textAnchor="middle">
                            Promoter
                        </text>
                        <text className={styles.regulatoryMicroLabel} x="668" y="136" textAnchor="middle">
                            Gene
                        </text>
                        <text className={styles.regulatoryMicroLabel} x="744" y="136" textAnchor="middle">
                            Silencer
                        </text>
                        <text className={styles.conceptLabel} x="650" y="194" textAnchor="middle">
                            Regulatory elements
                        </text>
                    </g>

                    <g
                        className={classForConcept("biosamples")}
                        tabIndex={0}
                        role="button"
                        aria-label="Biosamples"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "biosamples" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "biosamples" })}
                        onPointerDown={() => setActive({ type: "concept", id: "biosamples" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="130" y="282" width="142" height="40" rx="6" />
                        <UtilityGlyph kind="biosample" x={138} y={288} />
                        <UtilityLabel conceptId="biosamples" x={170} y={305} />
                    </g>

                    <g
                        className={classForConcept("curatedEvidence")}
                        tabIndex={0}
                        role="button"
                        aria-label="Curated evidence"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "curatedEvidence" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "curatedEvidence" })}
                        onPointerDown={() => setActive({ type: "concept", id: "curatedEvidence" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="290" y="282" width="150" height="40" rx="6" />
                        <UtilityGlyph kind="evidence" x={298} y={288} />
                        <UtilityLabel conceptId="curatedEvidence" x={330} y={305} />
                    </g>

                    <g
                        className={classForConcept("phenotypes")}
                        tabIndex={0}
                        role="button"
                        aria-label="Harmonized phenotypes"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "phenotypes" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "phenotypes" })}
                        onPointerDown={() => setActive({ type: "concept", id: "phenotypes" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="458" y="282" width="160" height="40" rx="6" />
                        <UtilityGlyph kind="phenotype" x={466} y={288} />
                        <UtilityLabel conceptId="phenotypes" x={498} y={305} />
                    </g>

                    <g
                        className={classForConcept("openAccess")}
                        tabIndex={0}
                        role="button"
                        aria-label="Open access"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "openAccess" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "openAccess" })}
                        onPointerDown={() => setActive({ type: "concept", id: "openAccess" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="720" y="282" width="80" height="40" rx="6" />
                        <UtilityGlyph kind="openLock" x={728} y={288} />
                        <UtilityLabel conceptId="openAccess" x={760} y={305} />
                    </g>

                    <g
                        className={classForConcept("restrictedAccess")}
                        tabIndex={0}
                        role="button"
                        aria-label="Restricted access"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "restrictedAccess" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "restrictedAccess" })}
                        onPointerDown={() => setActive({ type: "concept", id: "restrictedAccess" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="810" y="282" width="110" height="40" rx="6" />
                        <UtilityGlyph kind="closedLock" x={818} y={288} />
                        <UtilityLabel conceptId="restrictedAccess" x={850} y={305} />
                    </g>

                    <g
                        className={classForConcept("downloads")}
                        tabIndex={0}
                        role="button"
                        aria-label="Downloads"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "downloads" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "downloads" })}
                        onPointerDown={() => setActive({ type: "concept", id: "downloads" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="930" y="282" width="104" height="40" rx="6" />
                        <UtilityGlyph kind="download" x={938} y={288} />
                        <UtilityLabel conceptId="downloads" x={970} y={305} />
                    </g>

                    <g
                        className={classForConcept("cloudAccess")}
                        tabIndex={0}
                        role="button"
                        aria-label="Programmatic and cloud access"
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "cloudAccess" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "cloudAccess" })}
                        onPointerDown={() => setActive({ type: "concept", id: "cloudAccess" })}
                        onMouseLeave={() => setActive(null)}
                    >
                        <rect className={styles.utilityHitArea} x="1044" y="282" width="161" height="40" rx="6" />
                        <UtilityGlyph kind="cloud" x={1052} y={288} />
                        <UtilityLabel conceptId="cloudAccess" x={1084} y={305} />
                    </g>
                </svg>
            </section>
        </main>
    );
}

function ConceptLabel({ conceptId }: { conceptId: ConceptType }) {
    const concept = conceptById[conceptId];

    return (
        <text className={styles.conceptLabel} x={concept.x} y={concept.y + 44} textAnchor="middle">
            {concept.label}
        </text>
    );
}

function UtilityLabel({ conceptId, x, y }: { conceptId: ConceptType; x: number; y: number }) {
    return (
        <text className={styles.utilityLabel} x={x} y={y} textAnchor="start">
            {conceptById[conceptId].label}
        </text>
    );
}

function UtilityGlyph({
    kind,
    x,
    y,
}: {
    kind: "biosample" | "phenotype" | "evidence" | "download" | "cloud" | "openLock" | "closedLock";
    x: number;
    y: number;
}) {
    const glyph = {
        biosample: (
            <>
                <path d="M8 2 h8 M9 2 v12 a3 3 0 0 0 6 0 V2 M9 11 h6" />
            </>
        ),
        phenotype: (
            <>
                <rect x="4" y="4" width="16" height="18" rx="2" />
                <path d="M9 4 V2 h6 v2 M8 13 l3 3 l6 -7" />
            </>
        ),
        evidence: (
            <>
                <path d="M5 2 h9 l5 5 v6 M14 2 v5 h5 M5 2 v20 h10" />
                <circle cx="14" cy="15" r="4" />
                <path d="m17 18 l4 4" />
            </>
        ),
        download: <path d="M12 2 v13 M7 10 l5 5 l5 -5 M4 20 v2 h16 v-2" />,
        cloud: (
            <>
                <path d="M6 19 h12 a4 4 0 0 0 0 -8 a6 6 0 0 0 -11.4 -1.8 A5 5 0 0 0 6 19 Z" />
                <path d="m10 11 l-2 2 l2 2 M14 11 l2 2 l-2 2" />
            </>
        ),
        openLock: (
            <>
                <rect x="5" y="10" width="14" height="12" rx="2" />
                <path d="M9 10 V7 a4 4 0 0 1 7.5 -2" />
                <circle cx="12" cy="15" r="1" />
                <path d="M12 16 v2" />
            </>
        ),
        closedLock: (
            <>
                <rect x="5" y="10" width="14" height="12" rx="2" />
                <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" />
                <circle cx="12" cy="15" r="1" />
                <path d="M12 16 v2" />
            </>
        ),
    }[kind];

    return (
        <g className={styles.utilityGlyph} transform={`translate(${x} ${y})`} aria-hidden="true">
            {glyph}
        </g>
    );
}
