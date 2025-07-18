"use server";

import {
    APIResponse,
    AssociationTraitCategory,
    AssociationTraitSource,
    GeneticAssocationSummary,
    RecordReport,
} from "@/lib/types";
import { _fetch, fetchRecordAssociations } from "@/lib/route-handlers";
import { getCache, setCache } from "@/lib/cache";

import { InlineError } from "@/components/InlineError";
import Placeholder from "../placeholder";
import { Series } from "@niagads/charts";
import { _get } from "@niagads/common";
import { is_error_response } from "@/lib/utils";
import { stringify } from "querystring";

type RelativePosition = "in gene" | "upstream" | "downstream";

interface AssociationSummaryChartProps {
    recordId: string;
}

interface SummaryData {
    trait_category: string;
    upstream: number;
    downstream: number;
    in_gene: number;
}

const data_key = (source: string, category: string) => {
    const cleanCategory = category
        .replace(/'/g, "") // remove apostrophes
        .replace(/[\/\s]+/g, "_") // replace slashes and spaces with underscores
        .toLowerCase();
    return `${source}|${cleanCategory}`;
};

const build_chart_data = (summary: GeneticAssocationSummary) => {
    const totals: Record<string, SummaryData> = {};
    Object.entries(summary).forEach(([source, traits]) => {
        traits.forEach((item: { trait_category: string; num_variants: Record<string, number> }) => {
            const seriesKey: string = data_key(source, item.trait_category);
            if (totals.hasOwnProperty(seriesKey)) {
                totals[seriesKey]["upstream"] =
                    (totals[seriesKey]["upstream"] ?? 0) + (item.num_variants["upstream"] ?? 0);
                totals[seriesKey]["downstream"] =
                    (totals[seriesKey]["downstream"] ?? 0) + (item.num_variants["downstream"] ?? 0);
                totals[seriesKey]["in_gene"] =
                    (totals[seriesKey]["in_gene"] ?? 0) + (item.num_variants["in_gene"] ?? 0);
            } else {
                const dataPoint: SummaryData = {
                    trait_category: seriesKey,
                    upstream: item.num_variants["upstream"] ?? 0,
                    downstream: item.num_variants["downstream"] ?? 0,
                    in_gene: item.num_variants["in_gene"] ?? 0,
                };
                totals[seriesKey] = dataPoint;
            }
        });
    });
    return Object.values(totals);
};

const build_chart_series = (summary: GeneticAssocationSummary): Series => {
    const series = {};
    Object.entries(summary).map(([source, traits]) => {
        return traits.forEach((item: { trait_category: string; num_variants: Record<string, number> }) => {
            const seriesKey: string = data_key(source, item.trait_category);
            Object.assign(series, { [seriesKey]: item.trait_category });
        });
    });

    return series as Series;
};

export default async function GeneAssociationSummaryChart({ recordId }: AssociationSummaryChartProps) {
    async function fetchSummary(traitCategory: AssociationTraitCategory, source: AssociationTraitSource) {
        const response = (await fetchRecordAssociations(
            "gene",
            recordId,
            traitCategory,
            source,
            "summary"
        )) as APIResponse;
        if (is_error_response(response)) {
            throw new Error(JSON.stringify(response));
        }
        return response.data;
    }

    const namespace = "gene-record-genetic-association-summary";
    let summary: any = ((await getCache(namespace, recordId)) as unknown as GeneticAssocationSummary) || {};

    if (!summary || Object.keys(summary).length === 0) {
        let errorMessage: string | null = null;
        const sources: AssociationTraitSource[] = ["gwas", "curated"];
        try {
            for (const source of sources) {
                summary[source] = await fetchSummary("all", source);
            }
            await setCache(namespace, recordId, summary);
        } catch (error: any) {
            errorMessage = error.message;
        }

        if (errorMessage) {
            return <InlineError message={errorMessage} reload={false}></InlineError>;
        }
    }

    const data: SummaryData[] = build_chart_data(summary);
    const series: Series = build_chart_series(summary);
    return (
        <div>
            <Placeholder type={"chart"} />
        </div>
    );
}
// {/*<AssociationSummaryBarChart data={data} series={series} />*/}
