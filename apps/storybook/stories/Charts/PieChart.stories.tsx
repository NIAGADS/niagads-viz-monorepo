import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { PieChart } from "@niagads/charts";

const meta = {
    title: "Charts/PieChart",
    component: PieChart,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
    render: (args) => {
        const [selectedId, setSelectedId] = useState<string | null>(null);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    {selectedId ? `Selected: ${selectedId}` : "Click a slice to select"}
                </div>
                <PieChart {...args} onClick={setSelectedId} />
            </div>
        );
    },
    args: {
        legendPosition: "right",
        data: [
            {
                id: "test1",
                label: "Test 1",
                value: 5,
            },
            {
                id: "test2",
                label: "Test 2",
                value: 15,
            },
            {
                id: "test3",
                label: "Test 3",
                value: 11,
            },
            {
                id: "test4 - no label",
                value: 19,
            },
            {
                id: "test5",
                label: "Test 5",
                value: 8,
            },
        ],
    },
};
