import type { Meta, StoryObj } from "@storybook/react";

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
    render: (args) => <StackedBarChart {...args} />,
    args: {
        legendPosition: "right",
        title: "Example Stacked Bar Chart",
        displayOpts: { width: 500 },
        data: [
            {
                id: "alzheimers-disease",
                label: "Alzheimer's Disease",
                values: [
                    {
                        label: "upstream",
                        value: 2103,
                    },
                    {
                        label: "in gene",
                        value: 1166,
                    },
                    {
                        label: "downstream",
                        value: 74,
                    },
                ],
            },
            {
                id: "ad-related-dementias",
                label: "AD-Related Dementias",
                values: [
                    {
                        label: "upstream",
                        value: 226,
                    },
                    {
                        label: "in gene",
                        value: 143,
                    },
                    {
                        label: "downstream",
                        value: 16,
                    },
                ],
            },
            {
                id: "ad-adrd-biomarkers",
                label: "AD/ADRD Biomarkers",
                values: [
                    {
                        label: "upstream",
                        value: 18,
                    },
                    {
                        label: "in gene",
                        value: 33,
                    },
                    {
                        label: "downstream",
                        value: 16,
                    },
                ],
            },
        ],
    },
};
