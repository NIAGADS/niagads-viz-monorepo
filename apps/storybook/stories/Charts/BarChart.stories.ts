import type { Meta, StoryObj } from "@storybook/react";

import { BarChart } from "@niagads/charts";

const meta: Meta<typeof BarChart> = {
    title: "Charts/BarChart",
    component: BarChart,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
    args: {
        id: "test",
        data: [],
    },
};
