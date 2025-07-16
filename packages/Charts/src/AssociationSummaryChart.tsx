import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import React from "react";

// dataKey: value pairs
export interface SummaryData {
    trait_category: string;
    [key: string]: number | string;
}

// dataKey: legend label pairs
export interface Series {
    [key: string]: string;
}

export interface GeneticAssociationSummaryChartConfig {
    data: SummaryData[];
    series: Series;
}

export const AssociationSummaryBarChart = ({ config }: { config: GeneticAssociationSummaryChartConfig }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={config.data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis label="Trait Category" dataKey="trait_category" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.entries(config.series).map(([dataKey, label]) => {
                    <Bar key={dataKey} name={label} dataKey={dataKey} stackId={dataKey.split("|")[0]} />;
                })}
            </BarChart>
        </ResponsiveContainer>
    );
};
