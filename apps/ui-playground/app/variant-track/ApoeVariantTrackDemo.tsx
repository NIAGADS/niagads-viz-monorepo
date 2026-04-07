"use client";

import { AnnotatedVariantTrackOptions, annotatedVariantTrack } from "@niagads/charts";
import { useEffect, useMemo, useRef } from "react";

type AssociationRecord = {
    neg_log10_pvalue?: number | string;
    trait_category?: string;
    relative_position?: string;
    study?: string;
    variant?: {
        id?: string;
        ref_snp_id?: string | null;
        most_severe_consequence?: {
            impacted_gene?: {
                symbol?: string;
            } | null;
        } | null;
    } | null;
    trait?: {
        term?: string;
    } | null;
};

const TRAIT_COLORS = ["#79b6dc", "#76ad5d", "#f0bd42", "#df7b4d", "#4d7fbe", "#9d7db1", "#a8bf57", "#6ea7cf"];

function parsePosition(variantId?: string) {
    if (!variantId) return Number.NaN;
    const parts = variantId.split(":");
    return parts.length > 1 ? Number(parts[1]) : Number.NaN;
}

function formatMb(value: number) {
    return `${(value / 1_000_000).toFixed(2)}Mb`;
}

function clusterIntervals(values: number[], gapThreshold: number) {
    const sorted = values.slice().sort((a, b) => a - b);

    return sorted.reduce((clusters, value) => {
        const lastCluster = clusters[clusters.length - 1];
        if (!lastCluster || value - lastCluster[lastCluster.length - 1] > gapThreshold) {
            clusters.push([value]);
        } else {
            lastCluster.push(value);
        }
        return clusters;
    }, [] as number[][]);
}

function selectTopVariantsByTraitCategory<T extends { traitCategory: string; score: number }>(
    records: T[],
    limit: number
) {
    return Array.from(
        records.reduce((groups, record) => {
            const existing = groups.get(record.traitCategory) || [];
            existing.push(record);
            groups.set(record.traitCategory, existing);
            return groups;
        }, new Map<string, T[]>())
    ).flatMap(([_traitCategory, group]) => group.sort((a, b) => b.score - a.score).slice(0, limit));
}

function buildTrackConfig(associations: AssociationRecord[]): AnnotatedVariantTrackOptions {
    const normalized = associations
        .map((record) => {
            const position = parsePosition(record.variant?.id);
            const score = Number(record.neg_log10_pvalue);
            const gene = record.variant?.most_severe_consequence?.impacted_gene?.symbol || "Region";

            return {
                position,
                score,
                traitCategory: record.trait_category || "Uncategorized",
                relativePosition: record.relative_position || "",
                study: record.study || "",
                rsid: record.variant?.ref_snp_id || record.variant?.id || "",
                traitTerm: record.trait?.term || "",
                gene,
            };
        })
        .filter((record) => Number.isFinite(record.position) && Number.isFinite(record.score));

    const topVariants = selectTopVariantsByTraitCategory(normalized, 20);
    const selectedMin = Math.min(...topVariants.map((record) => record.position));
    const selectedMax = Math.max(...topVariants.map((record) => record.position));
    const selectedSpan = selectedMax - selectedMin || 1;
    const flankPadding = Math.max(selectedSpan * 0.12, 250);
    const domain = [selectedMin - flankPadding, selectedMax + flankPadding] as [number, number];

    const focusRegion = [
        Math.min(...topVariants.map((record) => record.position)),
        Math.max(...topVariants.map((record) => record.position)),
    ] as [number, number];

    const traitCategories = Array.from(new Set(topVariants.map((record) => record.traitCategory)));
    const colorByTrait = new Map(
        traitCategories.map((trait, index) => [trait, TRAIT_COLORS[index % TRAIT_COLORS.length]])
    );
    const domainSpan = domain[1] - domain[0] || 1;

    const genePositions = topVariants.map((record) => record.position);
    const geneClusters = clusterIntervals(genePositions, Math.max(domainSpan * 0.015, 120));

    const genes = [
        {
            label: "APOE",
            introns: [{ start: domain[0], end: domain[1] }],
            exons: geneClusters.map((cluster, clusterIndex) => ({
                start: Math.min(...cluster),
                end: Math.max(...cluster) + Math.max(domainSpan * 0.004, 40),
                fill: clusterIndex % 2 === 0 ? "#4c89bd" : "#7c8da0",
                height: clusterIndex % 2 === 0 ? 22 : 18,
            })),
        },
    ];

    const tickValues = Array.from({ length: 6 }, (_, index) => domain[0] + (index / 5) * domainSpan);

    return {
        displayOpts: {
            width: 1200,
            height: 500,
        },
        domain,
        variants: topVariants
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((record) => ({
                position: record.position,
                value: record.score,
                trait: record.traitCategory,
            })),
        gene: genes[0],
    };
}

export default function ApoeVariantTrackDemo({ associations }: { associations: unknown[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const config = useMemo(() => buildTrackConfig(associations as AssociationRecord[]), [associations]);

    useEffect(() => {
        if (containerRef.current) {
            annotatedVariantTrack(containerRef.current, config);
        }
    }, [config]);

    return (
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
            <div ref={containerRef} />
        </div>
    );
}
