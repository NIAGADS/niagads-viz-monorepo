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
        opts: {
            control: { type: "object" },
            description: "Histogram options (HistogramOptions)",
        },
    },
    args: {
        data: exampleData,
        opts: {
            numBins: 15,
            xLabel: "Value",
            aspectRatio: 0.5,
            margin: { top: 20, right: 30, bottom: 40, left: 40 },
            xMin: 0,
            xMax: 1,
        },
    },
};

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {
    args: {
        data: exampleData,
        opts: {
            numBins: 25,
            xLabel: "score",
            aspectRatio: 0.5,
        },
    },
};
