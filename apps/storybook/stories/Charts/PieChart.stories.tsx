import type { Meta, StoryObj } from "@storybook/react";

import { PieChart } from "@niagads/charts";

const meta = {
    title: "Charts/PieChart",
    component: PieChart,
    decorators: [
        (Story) => (
            <div style={{ minWidth: "400px", minHeight: "400px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
    args: {
        id: "test",
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
                id: "test4",
                label: "Test 4",
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
