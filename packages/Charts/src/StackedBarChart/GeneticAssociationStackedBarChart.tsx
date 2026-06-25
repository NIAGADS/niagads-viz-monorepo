import React, { useMemo } from "react";

import StackedBarChart, { StackedBarChartDataRow, StackedBarChartProps } from "./StackedBarChart";

interface GeneticAssociationCountRow {
    trait_category: string;
    num_variants: Record<string, number>;
}

interface GeneticAssociationStackedBarChartProps extends Omit<StackedBarChartProps, "data"> {
    data: { data: GeneticAssociationCountRow[] } | GeneticAssociationCountRow[];
}

const CATEGORY_LABELS: Record<string, string> = {
    AD: "Alzheimer's Disease",
    ADRD: "AD-Related Dementias",
};

const getRows = (data: GeneticAssociationStackedBarChartProps["data"]) => (Array.isArray(data) ? data : data.data);

const getCategoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category;

const transformGeneticAssociationCountsForStackedBar = (
    data: GeneticAssociationStackedBarChartProps["data"]
): StackedBarChartDataRow[] => {
    const segmentLabels: string[] = [];
    const categoryTotals = new Map<string, Record<string, number>>();

    getRows(data).forEach((row) => {
        if (!categoryTotals.has(row.trait_category)) {
            categoryTotals.set(row.trait_category, {});
        }

        const totals = categoryTotals.get(row.trait_category)!;
        Object.entries(row.num_variants).forEach(([label, value]) => {
            if (label === "total") {
                return;
            }
            if (!segmentLabels.includes(label)) {
                segmentLabels.push(label);
            }
            totals[label] = (totals[label] ?? 0) + value;
        });
    });

    return Array.from(categoryTotals.entries()).map(([category, totals]) => ({
        id: category,
        label: getCategoryLabel(category),
        values: segmentLabels.map((label) => ({
            label,
            value: totals[label] ?? 0,
        })),
    }));
};

const GeneticAssociationStackedBarChart = ({ data, ...stackedBarProps }: GeneticAssociationStackedBarChartProps) => {
    const chartData = useMemo(() => transformGeneticAssociationCountsForStackedBar(data), [data]);

    return <StackedBarChart {...stackedBarProps} data={chartData} />;
};

export default GeneticAssociationStackedBarChart;
