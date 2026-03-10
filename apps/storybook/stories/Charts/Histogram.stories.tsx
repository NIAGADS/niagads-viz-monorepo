import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Histogram } from "@niagads/charts";

// Generate skewed data with right tail (values between 0 and 1)
const generateSkewedData = (count: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < count; i++) {
        // Use exponential-like distribution for right skew
        const u = Math.random();
        const value = Math.pow(u, 0.5); // Exponent < 1 creates right skew, range [0, 1]
        data.push(value);
    }
    return data;
};

const exampleData = generateSkewedData(500);

const meta: Meta<typeof Histogram> = {
    title: "Charts/Histogram",
    component: Histogram,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ width: "900px", height: "500px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        data: {
            control: { type: "object" },
            description: "Array of numeric values to histogram",
        },
        numBins: {
            control: { type: "number", min: 5, max: 50, step: 1 },
            description: "Number of bins to divide the data into",
        },
        cap: {
            control: { type: "number", min: 0, step: 1 },
            description: "Optional cap on bar height; capped bars show actual count label",
        },
        xAxis: {
            control: { type: "object" },
            description: "X-axis configuration (label, min, max)",
        },
        yAxis: {
            control: { type: "object" },
            description: "Y-axis configuration (label, min, max)",
        },
    },
    args: {
        data: exampleData,
        numBins: 15,
        cap: undefined,
        xAxis: { label: "Value", min: undefined, max: undefined },
        yAxis: { label: "Count", min: undefined, max: undefined },
    },
};

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {
    args: {
        data: exampleData,
        numBins: 25,
        xAxis: { label: "p-value", min: 0, max: 1.0 },
        yAxis: { label: "Counts" },
    },
};

export const WithFrequencies: Story = {
    args: {
        data: exampleData,
        numBins: 25,
        xAxis: { label: "p-value", min: 0, max: 1.0 },
        yAxis: { label: undefined },
        useFrequencies: true,
    },
};

export const WithCap: Story = {
    args: {
        data: exampleData,
        numBins: 25,
        cap: 50,
        xAxis: { label: "p-value", min: 0, max: 1.0 },
        yAxis: { label: "Count" },
    },
};
