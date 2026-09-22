"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { Card, CardBody } from "@niagads/ui";

import styles from "./resource-ecosystem.module.css";

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
    | "cloudAccess"
    | "sequencing";

interface Concept {
    id: ConceptType;
    label: string;
}

type GenomicConceptId = Extract<
    ConceptType,
    "genes" | "variants" | "gwas" | "ld" | "qtls" | "regulatory" | "sequencing"
>;
type AccessConceptId = Exclude<ConceptType, GenomicConceptId>;

interface GenomicBandLayout {
    id: GenomicConceptId;
    x: number;
    y: number;
    labelDx: number;
    labelDy: number;
    connectorDx: number;
    connectorDy: number;
}

interface AccessLayout {
    id: AccessConceptId;
    x: number;
    y: number;
    connectorY: number;
    labelX: number;
    labelY: number;
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

export interface ResourceEcosystemOverview {
    title: string;
    description: string;
    instruction: string;
}

interface ResourceEcosystemViewerProps {
    overview: ResourceEcosystemOverview;
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
    { id: "genes", label: "Genes" },
    { id: "variants", label: "Variants" },
    { id: "gwas", label: "Genetic associations" },
    { id: "ld", label: "LD" },
    { id: "qtls", label: "Molecular QTLs" },
    { id: "regulatory", label: "Regulatory elements" },
    { id: "biosamples", label: "Biosamples" },
    { id: "curatedEvidence", label: "Curated evidence" },
    { id: "phenotypes", label: "Phenotypes" },
    { id: "openAccess", label: "Open" },
    { id: "restrictedAccess", label: "Restricted" },
    { id: "downloads", label: "Downloads" },
    { id: "cloudAccess", label: "API / Cloud" },
    { id: "sequencing", label: "Sequencing" },
];

const GENOMIC_BAND_LAYOUT: GenomicBandLayout[] = [
    { id: "genes", x: 140, y: 150, labelDx: -29, labelDy: 44, connectorDx: -79, connectorDy: -30 },
    { id: "variants", x: 310, y: 150, labelDx: 0, labelDy: 26, connectorDx: 0, connectorDy: -18 },
    { id: "gwas", x: 310, y: 90, labelDx: 0, labelDy: -34, connectorDx: 0, connectorDy: -18 },
    { id: "ld", x: 310, y: 210, labelDx: 0, labelDy: 54, connectorDx: 0, connectorDy: -18 },
    { id: "qtls", x: 810, y: 168, labelDx: 30, labelDy: 78, connectorDx: 0, connectorDy: -36 },
    { id: "regulatory", x: 570, y: 150, labelDx: 0, labelDy: 44, connectorDx: 0, connectorDy: -18 },
    { id: "sequencing", x: 1165, y: 120, labelDx: -30, labelDy: 56, connectorDx: 15, connectorDy: -36 },
];

const ACCESS_LAYOUT: AccessLayout[] = [
    { id: "biosamples", x: 365, y: 300, connectorY: 292, labelX: 330, labelY: 305 },
    { id: "curatedEvidence", x: 201, y: 300, connectorY: 292, labelX: 170, labelY: 305 },
    { id: "phenotypes", x: 538, y: 300, connectorY: 292, labelX: 498, labelY: 305 },
    { id: "openAccess", x: 760, y: 300, connectorY: 292, labelX: 760, labelY: 305 },
    { id: "restrictedAccess", x: 865, y: 300, connectorY: 292, labelX: 850, labelY: 305 },
    { id: "downloads", x: 982, y: 300, connectorY: 292, labelX: 970, labelY: 305 },
    { id: "cloudAccess", x: 1124, y: 300, connectorY: 292, labelX: 1084, labelY: 305 },
];

const LANDSCAPE_WIDTH = 1240;

const genomicLayoutById = Object.fromEntries(GENOMIC_BAND_LAYOUT.map((layout) => [layout.id, layout])) as Record<
    GenomicConceptId,
    GenomicBandLayout
>;

const accessLayoutById = Object.fromEntries(ACCESS_LAYOUT.map((layout) => [layout.id, layout])) as Record<
    AccessConceptId,
    AccessLayout
>;

function getConnectorGeometry(conceptId: ConceptType) {
    if (conceptId in genomicLayoutById) {
        const layout = genomicLayoutById[conceptId as GenomicConceptId];

        return {
            anchorY: layout.y,
            x: layout.x + layout.connectorDx,
            y: layout.y + layout.connectorDy,
        };
    }

    const layout = accessLayoutById[conceptId as AccessConceptId];

    return { anchorY: layout.y, x: layout.x, y: layout.connectorY };
}

function getFallbackResourceCenterX(index: number, resourceCount: number) {
    return ((index + 0.5) / resourceCount) * LANDSCAPE_WIDTH;
}

const GENE_EXONS: Array<[number, number]> = [
    [38, 46],
    [138, 58],
    [548, 80],
    [668, 48],
    [902, 26],
    [1000, 52],
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

const SEQUENCING_READS = [
    [1052, 24, 101],
    [1080, 18, 101],
    [1110, 30, 101],
    [1148, 20, 101],
    [1062, 34, 108],
    [1102, 22, 108],
    [1132, 28, 108],
    [1168, 18, 108],
    [1044, 18, 115],
    [1070, 26, 115],
    [1108, 18, 115],
    [1140, 32, 115],
    [1050, 28, 122],
    [1058, 42, 129],
    [1068, 36, 136],
    [1078, 52, 143],
    [1090, 46, 122],
    [1100, 58, 129],
    [1112, 34, 136],
    [1122, 48, 143],
    [1132, 40, 122],
    [1144, 54, 129],
    [1156, 30, 136],
    [1164, 44, 143],
] as const;

const conceptById = Object.fromEntries(CONCEPTS.map((concept) => [concept.id, concept])) as Record<
    ConceptType,
    (typeof CONCEPTS)[number]
>;

export function ResourceEcosystemViewer({ overview, resources, resourceGroups }: ResourceEcosystemViewerProps) {
    const [active, setActive] = useState<ActiveTarget>(null);
    const [detailResourceId, setDetailResourceId] = useState<string | null>(null);
    const [resourceCenterX, setResourceCenterX] = useState<Record<string, number>>({});
    const resourceRowRef = useRef<HTMLDivElement>(null);
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

    const selectResource = (resourceId: string) => {
        setDetailResourceId(resourceId);
        setActive({ type: "resource", id: resourceId });
    };

    const handleOutsidePointerDown = (event: React.PointerEvent<HTMLElement>) => {
        const target = event.target;

        if (
            target instanceof Element &&
            (target.closest("[data-resource-id]") || target.closest(`.${styles.resourceDetail}`))
        ) {
            return;
        }

        setDetailResourceId(null);
        setActive(null);
    };

    const handleConceptPointerOver = (event: React.PointerEvent<SVGSVGElement>) => {
        const target = event.target;

        if (target instanceof Element && target.closest(`.${styles.conceptMark}`)) {
            setDetailResourceId(null);
        }
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
        <main className={styles.shell} onPointerDown={handleOutsidePointerDown}>
            <section className={styles.ecosystem} aria-label="NIAGADS homepage resource visualization prototype">
                <div className={styles.resourceDetailSlot}>
                    <Card
                        aria-label={`${detailResource?.name ?? "NIAGADS resource ecosystem"} description`}
                        className={`${styles.resourceDetail} ${detailResource ? "" : styles.defaultDetail}`}
                        style={
                            {
                                "--resource-color": detailResource
                                    ? resourceGroupById[detailResource.groupId].color
                                    : "var(--primary-blue)",
                            } as CSSProperties
                        }
                    >
                        <CardBody className={styles.resourceDetailBody}>
                            <div className={styles.resourceDetailHeader}>
                                <h2>{detailResource?.name ?? overview.title}</h2>
                            </div>
                            <p>
                                {detailResource?.description ?? overview.description}
                                {!detailResource ? (
                                    <strong className={styles.detailInstruction}>{overview.instruction}</strong>
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
                        </CardBody>
                    </Card>
                </div>

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
                            onFocus={() => selectResource(resource.id)}
                            onMouseEnter={() => selectResource(resource.id)}
                            onPointerDown={() => selectResource(resource.id)}
                        >
                            <span className={styles.badge}>{resource.badge}</span>
                        </button>
                    ))}
                </div>

                <svg
                    className={styles.landscape}
                    viewBox={`0 0 ${LANDSCAPE_WIDTH} 340`}
                    preserveAspectRatio="none"
                    role="img"
                    aria-labelledby="ecosystem-title ecosystem-desc"
                    onPointerOver={handleConceptPointerOver}
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
                        <path className={styles.utilityRule} d="M0 278 H1240" />
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
                            d="M0 126 C235 76 392 95 530 132 S799 185 950 132 1138 100 1240 146"
                        />
                        <path
                            className={styles.softContour}
                            d="M0 265 C274 216 410 254 556 242 S785 204 910 249 1082 286 1240 244"
                        />
                        <line className={styles.resourceRail} x1="0" x2="1240" y1="32" y2="32" />
                    </g>

                    <line className={styles.geneTrackHit} x1="0" x2="1240" y1="150" y2="150" />
                    <line className={styles.genomeRail} x1="0" x2="1240" y1="150" y2="150" />

                    <g className={styles.linkLayer} aria-hidden="true">
                        {resources.flatMap((resource, resourceIndex) =>
                            resource.concepts.map((conceptId) => {
                                const start =
                                    resourceCenterX[resource.id] ??
                                    getFallbackResourceCenterX(resourceIndex, resources.length);
                                const connector = getConnectorGeometry(conceptId);
                                const bend = Math.max(62, connector.anchorY - 58);
                                const targetX = connector.x;
                                const targetY = connector.y;
                                const connectorPath = `M ${start} 42 C ${start} ${bend}, ${targetX} ${bend}, ${targetX} ${targetY}`;
                                const isActiveLink = activeResources.has(resource.id) && activeConcepts.has(conceptId);
                                return (
                                    <g key={`${resource.id}-${conceptId}`}>
                                        <path
                                            className={pathClass(resource.id, conceptId)}
                                            d={connectorPath}
                                            style={{ stroke: resourceGroupById[resource.groupId].color }}
                                        />
                                        <circle
                                            className={`${styles.linkTarget} ${isActiveLink ? styles.active : ""}`}
                                            cx={targetX}
                                            cy={targetY}
                                            r="3.5"
                                            style={{ fill: resourceGroupById[resource.groupId].color }}
                                        />
                                    </g>
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
                        <rect fill="none" pointerEvents="all" x="250" y="42" width="120" height="90" rx="6" />
                        <path className={styles.associationBaseline} d="M261 128 H359" />
                        <path className={styles.associationThreshold} d="M261 96 H359" />
                        {ASSOCIATION_POINT_Y.map((y, index) => (
                            <circle
                                className={`${styles.associationPoint} ${y < 96 ? styles.associationPointSignificant : ""}`}
                                cx={261 + index * 3.5}
                                cy={y}
                                r={y < 96 ? 2.2 : 1.7}
                                key={index}
                            />
                        ))}
                        <GenomicLabel conceptId="gwas" />
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
                        <rect className={styles.geneConceptHitArea} x="20" y="118" width="180" height="84" rx="6" />
                        {GENE_EXONS.map(([x, width]) => (
                            <rect className={styles.geneExon} x={x} y="142" width={width} height="16" key={x} />
                        ))}
                        <path className={styles.geneDirection} d="M46 142 V132 H66 M61 128 L66 132 L61 136" />
                        <GenomicLabel conceptId="genes" />
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
                        <rect className={styles.variantHitArea} x="252" y="134" width="116" height="48" rx="5" />
                        {[268, 282, 296, 310, 324, 338, 352].map((x) => (
                            <path className={styles.variant} d={`M ${x} 145 l 5 5 l -5 5 l -5 -5 Z`} key={x} />
                        ))}
                        <GenomicLabel conceptId="variants" />
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
                        <rect className={styles.ldHitArea} x="250" y="180" width="120" height="90" rx="6" />
                        <path className={styles.ldTopRule} d="M261 190 H359" />
                        {LD_VALUES[0].map((_, index) => (
                            <path
                                className={styles.ldTick}
                                d={`M ${268 + index * 14} 182 V190`}
                                key={`tick-${index}`}
                            />
                        ))}
                        {LD_VALUES.map((row, rowIndex) =>
                            row.map((value, columnIndex) => {
                                const cx = 268 + rowIndex * 7 + columnIndex * 14;
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
                        <GenomicLabel conceptId="ld" />
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
                        <rect className={styles.qtlHitArea} x="684" y="108" width="310" height="146" rx="6" />
                        <path className={styles.qtlBridge} d="M810 150 C798 122 772 122 760 150" />
                        <path className={styles.qtlBridge} d="M810 150 C785 205 732 205 700 158" />
                        <path className={styles.qtlBridge} d="M810 150 C835 196 890 196 915 158" />
                        <path className={styles.qtlBridge} d="M810 150 C850 222 940 222 980 150" />
                        <path className={styles.variant} d="M810 144 l6 6 l-6 6 l-6 -6 Z" />
                        <GenomicLabel conceptId="qtls" />
                    </g>

                    <g
                        className={classForConcept("sequencing")}
                        aria-label="Sequencing data, shown as aligned reads"
                        role="button"
                        tabIndex={0}
                        onBlur={() => setActive(null)}
                        onFocus={() => setActive({ type: "concept", id: "sequencing" })}
                        onMouseEnter={() => setActive({ type: "concept", id: "sequencing" })}
                        onMouseLeave={() => setActive(null)}
                        onPointerDown={() => setActive({ type: "concept", id: "sequencing" })}
                    >
                        <rect className={styles.sequencingHitArea} x="1045" y="92" width="190" height="110" rx="6" />
                        <g>
                            {SEQUENCING_READS.map(([x, width, y], index) => {
                                const readX = 592.5 + x / 2;
                                const readWidth = width / 2;
                                const mismatchX = readX + Math.min(readWidth - 4, 14 + (index % 4) * 4.5);

                                return (
                                    <g key={`${x}-${width}`}>
                                        <line
                                            className={styles.sequencingRead}
                                            x1={readX}
                                            x2={readX + readWidth}
                                            y1={y}
                                            y2={y}
                                        />
                                        <line
                                            className={styles.sequencingBase}
                                            x1={mismatchX}
                                            x2={mismatchX}
                                            y1={y - 2.5}
                                            y2={y + 2.5}
                                        />
                                    </g>
                                );
                            })}
                        </g>
                        <GenomicLabel conceptId="sequencing" />
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
                        <rect className={styles.regulatoryHitArea} x="444" y="104" width="250" height="94" rx="6" />
                        <path className={styles.regulatoryLoop} d="M476 142 C486 110 528 110 538 140" />
                        <rect className={styles.regulatoryEnhancer} x="460" y="142" width="32" height="16" rx="2" />
                        <rect className={styles.regulatoryPromoter} x="530" y="140" width="16" height="20" rx="2" />
                        <rect className={styles.regulatorySilencer} x="650" y="143" width="28" height="14" rx="2" />
                        <text className={styles.regulatoryMicroLabel} x="476" y="136" textAnchor="middle">
                            Enhancer
                        </text>
                        <text className={styles.regulatoryMicroLabel} x="538" y="174" textAnchor="middle">
                            Promoter
                        </text>
                        <text className={styles.regulatoryMicroLabel} x="588" y="136" textAnchor="middle">
                            Gene
                        </text>
                        <text className={styles.regulatoryMicroLabel} x="664" y="136" textAnchor="middle">
                            Silencer
                        </text>
                        <GenomicLabel conceptId="regulatory" />
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
                        <rect className={styles.utilityHitArea} x="290" y="282" width="142" height="40" rx="6" />
                        <UtilityGlyph kind="biosample" x={298} y={288} />
                        <UtilityLabel conceptId="biosamples" />
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
                        <rect className={styles.utilityHitArea} x="130" y="282" width="150" height="40" rx="6" />
                        <UtilityGlyph kind="evidence" x={138} y={288} />
                        <UtilityLabel conceptId="curatedEvidence" />
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
                        <UtilityLabel conceptId="phenotypes" />
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
                        <UtilityLabel conceptId="openAccess" />
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
                        <UtilityLabel conceptId="restrictedAccess" />
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
                        <UtilityLabel conceptId="downloads" />
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
                        <UtilityLabel conceptId="cloudAccess" />
                    </g>
                </svg>
            </section>
        </main>
    );
}

function GenomicLabel({ conceptId }: { conceptId: GenomicConceptId }) {
    const concept = conceptById[conceptId];
    const layout = genomicLayoutById[conceptId as GenomicConceptId];

    return (
        <text
            className={styles.conceptLabel}
            x={layout.x + layout.labelDx}
            y={layout.y + layout.labelDy}
            textAnchor="middle"
        >
            {concept.label}
        </text>
    );
}

function UtilityLabel({ conceptId }: { conceptId: AccessConceptId }) {
    const concept = conceptById[conceptId];
    const layout = accessLayoutById[conceptId];

    return (
        <text className={styles.utilityLabel} x={layout.labelX} y={layout.labelY} textAnchor="start">
            {concept.label}
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
        <svg className={styles.utilityGlyph} x={x} y={y} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            {glyph}
        </svg>
    );
}
