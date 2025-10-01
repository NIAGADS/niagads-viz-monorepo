import { Bar, BarChart, Label, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";

import React from "react";

// dataKey: value pairs

// dataKey: legend label pairs
export interface Series {
    [key: string]: string;
}

export interface GeneticAssociationSummaryChartConfig {
    data: any;
    series: Series;
}

export const LegacyAssociationSummaryBarChart = ({ data, series }: GeneticAssociationSummaryChartConfig) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="trait_category">
                    <Label value="Trait Category" position="bottom" />
                </XAxis>
                <YAxis>
                    <Label value="No. Variants" />
                </YAxis>

                <Legend />

                <Bar name={"AD"} dataKey="upstream" stackId="gwas" />
            </BarChart>
        </ResponsiveContainer>
    );
};

/*  {Object.entries(series).map(([dataKey, label]) =>
                    dataKey === "total" ? null : <Bar name={label} dataKey={dataKey} stackId={dataKey.split("|")[0]} />
                )}*/
/*
                     {
[1]     trait_category: 'gwas|adrd',
[1]     uptream: 307,
[1]     downstream: 148,
[1]     in_gene: 0,
[1]     upstream: 182
[1]   },
[1]   {
[1]     trait_category: 'gwas|ad_adrd_biomarkers',
[1]     uptream: 131,
[1]     downstream: 54,
[1]     in_gene: 0
[1]   },
1]   {
[1]     trait_category: 'curated|non-ad_adrd',
[1]     uptream: 83,
[1]     downstream: 61,
[1]     in_gene: 0,
[1]     upstream: 64
[1]   },*/
