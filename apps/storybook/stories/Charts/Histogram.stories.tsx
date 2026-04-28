import {
    Histogram,
    RangeSelectHistogram as RSHistogram,
    ThresholdSelectHistogram as TSHistogram,
} from "@niagads/charts";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TABLE_DEFINITION as largeNumericTable } from "../../examples/tables/table_large_numeric_values";
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

export const OverflowHistogram: Story = {
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
export const RangeSelectHistogram = {
    render: (args: any) => {
        const [selected, setSelected] = useState();
        return (
            <div>
                <div style={{ marginBottom: 12, fontSize: 16 }}>Selected range: {JSON.stringify(selected)}</div>
                <RSHistogram {...args} onRangeSelect={setSelected} />
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
        range: { min: 7, max: 25 },
    },
};

export const MinThresholdSelectHistogram = {
    render: (args: any) => {
        const [selected, setSelected] = useState();

        return (
            <div>
                {selected && (
                    <div style={{ marginBottom: 12, fontSize: 16 }}>Selected range: {JSON.stringify(selected)}</div>
                )}
                <TSHistogram {...args} onRangeSelect={setSelected} />
            </div>
        );
    },
    args: {
        data: pvalueData as number[],
        numBins: 50,
        max: 50,
        label: "-log10p",
        displayOpts: undefined,
        limit: 7,
        limitType: "min",
    },
};

export const MaxThresholdSelectHistogram = {
    render: (args: any) => {
        const [selected, setSelected] = useState();

        return (
            <div>
                {selected && (
                    <div style={{ marginBottom: 12, fontSize: 16 }}>Selected range: {JSON.stringify(selected)}</div>
                )}
                <TSHistogram {...args} onRangeSelect={setSelected} />
            </div>
        );
    },
    args: {
        data: pvalueData as number[],
        numBins: 50,
        max: 50,
        label: "-log10p",
        displayOpts: undefined,
        limit: 7,
        limitType: "max",
    },
};
