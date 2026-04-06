import { Histogram, RangeSelectHistogram } from "@niagads/charts";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TABLE_DEFINTION as largeNumericTable } from "../../examples/tables/table_large_numeric_values";
import { useState } from "react";

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
            control: { type: "number" },
            description: "Number of bins",
            defaultValue: 15,
        },
        min: {
            control: { type: "number" },
            description: "Minimum value for x-axis",
            defaultValue: 0,
        },
        max: {
            control: { type: "number" },
            description: "Maximum value for x-axis",
            defaultValue: 1,
        },
        label: {
            control: { type: "text" },
            description: "Label for x-axis",
            defaultValue: "Value",
        },
        displayOpts: {
            control: { type: "object" },
            description: "Display options (DisplayProps)",
        },
    },
    args: {
        data: exampleData,
        numBins: 15,
        min: 0,
        max: 1,
        label: "Value",
        displayOpts: undefined,
    },
};

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {
    args: {
        data: exampleData,
        numBins: 25,
        min: 0,
        max: 1,
        label: "score",
        displayOpts: undefined,
    },
};

// Extract -log10(pvalue) from table data
const pvalueData = largeNumericTable.data.map((row) => {
    const p = parseFloat(row.pvalue as string);
    return parseFloat((-Math.log10(p)).toFixed(2));
});

export const PValueHistogram: Story = {
    render: (args) => <Histogram {...args} />,
    args: {
        data: pvalueData as number[],
        numBins: 50,
        min: 0,
        max: 50,
        label: "-log10p",
        displayOpts: undefined,
    },
};

// RangeSelectHistogram story using pvalueData
export const PValueRangeSelectHistogram = {
    render: (args: any) => {
        const [selected, setSelected] = useState([5, 10]);
        return (
            <div>
                <div style={{ marginBottom: 12, fontSize: 16 }}>
                    Selected range: {selected[0]} – {selected[1]}
                </div>
                <RangeSelectHistogram {...args} initialSelection={selected} onRangeSelect={setSelected} />
            </div>
        );
    },
    args: {
        data: pvalueData as number[],
        numBins: 50,
        min: 0,
        max: 50,
        label: "-log10p",
        displayOpts: undefined,
        selectionStrategy: "range",
        initialSelection: [5, 10],
    },
};
