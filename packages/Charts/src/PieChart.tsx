import React, { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";

import styles from "./styles/common.module.css";

export interface PieChartDataRow {
    id: string;
    label: string;
    value: number;
}

export interface PieChartProps {
    id: string;
    data: PieChartDataRow[];
    onClick?: (key: string) => void;
}

const PieChart = ({ id, data, onClick }: PieChartProps) => {
    const total = data.reduce((total, row) => (total += row.value), 0);

    // calculates color based on value
    const gradient = 260;
    const dataWithColors = useMemo(() => {
        return data.map((row) => ({
            ...row,
            color: `hsl(${Math.floor((row.value / total) * gradient)}, 70%, 50%)`,
        }));
    }, [data]);

    return (
        <div className={styles["chart-wrapper"]}>
            <ResponsivePie
                id={id}
                data={dataWithColors}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                padAngle={0.5}
                cornerRadius={2}
                colors={{ datum: "data.color" }}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
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
                onClick={(dataRow) => onClick && onClick(`${dataRow.data.id}`)}
            />
        </div>
    );
};

export default PieChart;
