import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface BarChartProps {
    id: string;
    keys: string[];
    data: Record<string, any>[];
    xAxisLabel?: string;
    yAxisLabel?: string;
}

const BarChart = ({
    id,
    keys,
    data,
    xAxisLabel,
}: BarChartProps) => {

    return (
        <ResponsiveBar
            data={data}
            indexBy="term"
            keys={keys}
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
            axisBottom={xAxisLabel ? {
                legend: xAxisLabel,
                legendOffset: 32,
                tickRotation: 45,
                truncateTickAt: 50,
            } : null}
        />
    ) 
};


export default BarChart;
