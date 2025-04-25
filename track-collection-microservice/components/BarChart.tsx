"use client";
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ChartOptions {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    chartType: "bar" | "column";
    categories: string[];
}

interface ChartProps {
    series: any;
    opts: any;
}

export const BarChart = ({ series, opts }: ChartProps) => {
    const options: any = useMemo(
        () => ({
            chart: {
                type: opts.chartType,
                height: "300px",
            },
            credits: { enabled: false },
            legend: { enabled: false },
            title: {
                text: opts.title,
            },
            xAxis: {
                categories: opts.categories,
                crosshair: true,
                accessibility: {
                    description: opts.xAxisLabel,
                },
            },
            yAxis: {
                title: {
                    text: opts.yAxisLabel,
                },
            },
            series: series,
        }),
        [series]
    );
    return (
        <div className="chart-container">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
