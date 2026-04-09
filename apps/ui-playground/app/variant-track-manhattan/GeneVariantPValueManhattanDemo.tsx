"use client";

import { GeneVariantPValueManhattanPlotOptions, geneVariantPValueManhattanPlot } from "@niagads/charts";
import { useEffect, useMemo, useRef } from "react";
import { model } from "../variant-track/apoe_gene_model";

type AssociationRecord = {
    neg_log10_pvalue?: number | string;
    trait_category?: string;
    relative_position?: string;
    study?: string;
    variant?: {
        id: string;
        ref_snp_id?: string;
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

function parsePosition(variantId?: string) {
    if (!variantId) return Number.NaN;
    const parts = variantId.split(":");
    return parts.length > 1 ? Number(parts[1]) : Number.NaN;
}

function buildTrackConfig(associations: AssociationRecord[]): GeneVariantPValueManhattanPlotOptions {
    const normalized = associations
        .map((record) => {
            const position = parsePosition(record.variant?.id);
            const score = Number(record.neg_log10_pvalue);

            return {
                position,
                score,
                id: record.variant?.ref_snp_id || record.variant?.id,
                traitCategory: record.trait_category || "Uncategorized",
            };
        })
        .filter((record) => Number.isFinite(record.position) && Number.isFinite(record.score));

    const canonicalTranscript = model.transcripts.find((t: { is_canonical?: boolean }) => t.is_canonical);
    const sortedExons = (canonicalTranscript?.exons || [])
        .map((exon: { location: { start: number; end: number } }) => ({
            start: exon.location.start,
            end: exon.location.end,
        }))
        .sort((a, b) => a.start - b.start);
    const geneStart = model.location.start;
    const geneEnd = model.location.end;
    const flankPadding = 10_000;
    const domain = [geneStart - flankPadding, geneEnd + flankPadding] as [number, number];

    const transcriptStart = canonicalTranscript?.location.start ?? geneStart;
    const transcriptEnd = canonicalTranscript?.location.end ?? geneEnd;

    const introns =
        transcriptStart && transcriptEnd
            ? [
                  { start: transcriptStart, end: sortedExons[0]?.start ?? transcriptEnd },
                  ...sortedExons.slice(0, -1).map((exon, idx) => ({
                      start: exon.end,
                      end: sortedExons[idx + 1].start,
                  })),
                  { start: sortedExons[sortedExons.length - 1]?.end ?? transcriptStart, end: transcriptEnd },
              ].filter((segment) => segment.end > segment.start)
            : [];

    return {
        displayOpts: {
            width: 1200,
            height: 500,
        },
        domain,
        variants: normalized
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((record) => ({
                id: record.id!,
                position: record.position,
                value: record.score,
                trait: record.traitCategory,
            })),
        gene: {
            label: "APOE",
            introns: introns.map((segment) => ({
                ...segment,
            })),
            exons: sortedExons,
            start: geneStart,
            end: geneEnd,
        },
    };
}

export default function GeneVariantPValueManhattanDemo({ associations }: { associations: unknown[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const config = useMemo(() => buildTrackConfig(associations as AssociationRecord[]), [associations]);

    useEffect(() => {
        if (containerRef.current) {
            geneVariantPValueManhattanPlot(containerRef.current, config);
        }
    }, [config]);

    return (
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
            <div ref={containerRef} />
        </div>
    );
}
