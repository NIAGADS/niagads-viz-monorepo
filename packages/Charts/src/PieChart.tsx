import React from "react";
import { ResponsivePie } from "@nivo/pie";

import styles from "./styles/common.module.css";

interface PieChartDataRow {
    id: string;
    label: string;
    value: number;
}

interface PieChartProps {
    id: string;
    data: PieChartDataRow[];
    onClick?: (key: string) => void;
}

const PieChart = ({ id, data, onClick }: PieChartProps) => {
    const total = data.reduce((total, row) => total += row.value, 0);

    // calculates color based on value
    const gradient = 360;
    const transformedData = data.map(row => ({
        ...row,
        color: `hsl(${Math.floor((row.value / total) * gradient)}, 70%, 50%)`
    }));

    console.log(total);
    console.log(transformedData);

    return (
        <div className={styles["chart-wrapper"]}>
            <ResponsivePie
                id={id}
                data={transformedData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                padAngle={0.5}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        translateX: 120,
                        itemsSpacing: 3,
                        itemWidth: 100,
                        itemHeight: 16,
                    },
                ]}
                onClick={(row) => onClick && onClick(row.data.id)}
            />
        </div>
    );
};

export default PieChart;
