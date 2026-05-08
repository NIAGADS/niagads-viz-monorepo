import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { StackedBarChart } from "@niagads/charts";

const meta = {
    title: "Charts/StackedBarChart",
    component: StackedBarChart,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof StackedBarChart>;

export default meta;
type Story = StoryObj<typeof StackedBarChart>;

export const Default: Story = {
    render: (args) => {
        const [selectedId, setSelectedId] = useState<string | null>(null);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                <div style={{ fontSize: "16px", color: "blue", marginBottom: "20px" }}>
                    {selectedId ? `Selected: ${selectedId}` : "Click a slice to select"}
                </div>
                <StackedBarChart {...args} onClick={setSelectedId} />
            </div>
        );
    },
    args: {
        legendPosition: "right",
        title: "Example Stacked Bar Chart",
        displayOpts: { width: 300 },
        data: [
            {
                id: "car1",
                label: "Nissan",
                values: [
                    {
                        label: "value",
                        value: 9
                    },
                    {
                        label: "speed",
                        value: 5
                    },
                    {
                        label: "reliability",
                        value: 4
                    },
                ]
            },
            {
                id: "car2",
                label: "Honda",
                values: [
                    {
                        label: "value",
                        value: 3
                    },
                    {
                        label: "speed",
                        value: 15
                    },
                    {
                        label: "reliability",
                        value: 4
                    },
                ]
            },
            {
                id: "car3",
                label: "Toyota",
                values: [
                    {
                        label: "value",
                        value: 7
                    },
                    {
                        label: "speed",
                        value: 12
                    },
                    {
                        label: "reliability",
                        value: 9
                    },
                ]
            },
        ],
    },
};
