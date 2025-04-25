"use client";
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ChartOptions {
    title: string;
    chartType: any;
    xAxisLabel: string;
    yAxisLabel: string;
    categories: string[];
}

interface ChartProps {
    series: any;
    opts: any;
}

export const GenericPlot = ({ series, opts }: ChartProps) => {
    const options: any = useMemo(
        () => ({
            chart: {
                type: "scatter",
                inverted: true,
                //height: "300px",
            },
            credits: { enabled: false },
            legend: { enabled: false },
            title: {
                text: opts.title,
            },
            xAxis: {
                categories: opts.categories,
                title: {
                    text: opts.xAxisLabel,
                },
            },
            yAxis: {
                title: {
                    text: opts.yAxisLabel,
                },
            },
            plotOptions: {
                scatter: {
                    dataLabels: {
                        enabled: true,
                        format: "{name}",
                    },
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
