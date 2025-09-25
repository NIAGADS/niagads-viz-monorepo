import React from "react";
import useSWR from "swr";
import { ResponsiveBar, Bar } from "@nivo/bar";
import { LoadingSpinner } from "@niagads/ui";
import { APIResponse } from "@niagads/common";

interface AssociationSummaryChartProps {
    id: string;
    base_url: string;
    trait: string;
    source: string;
    pvalue_threshold?: string;
}

const AssociationSummaryChart = ({
    id,
    base_url,
    trait,
    source,
    pvalue_threshold = "5e-8",
}: AssociationSummaryChartProps) => {
    const { data, error, isLoading } = useSWR(
        `${base_url}?content=counts&trait=${trait}&source=${source}&pvalue=${pvalue_threshold}`,
        (url: string) => fetch(url).then((res) => res.json())
    );

    return isLoading ? (
        <LoadingSpinner />
    ) : data ? (
        <ResponsiveBar
            data={transformData(data)}
            indexBy="term"
            keys={["downstream", "upstream", "in gene"]}
            margin={{ top: 60, right: 110, bottom: 60, left: 80 }}
            padding={0.2}
            labelTextColor={"inherit:darker(1.4)"}
            labelSkipWidth={16}
            labelSkipHeight={16}
            enableTotals={true}
            enableGridX={true}
            enableGridY={false}
            totalsOffset={10}
            layout="horizontal"
            legends={[
                {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    translateX: 120,
                    itemsSpacing: 3,
                    itemWidth: 100,
                    itemHeight: 16,
                },
            ]}
            axisBottom={{
                legend: `N Variants (p < ${pvalue_threshold})`,
                legendOffset: 32,
                tickRotation: 45,
                truncateTickAt: 50,
            }}
        />
    ) : (
        <div>Error fetching data</div>
    );
};

const transformData = (data: any): Record<string, any>[] => {
    return data.data.map((rawData: any) => ({
        term: rawData.trait.term,
        ...rawData.num_variants,
    }));
};

export default AssociationSummaryChart;
