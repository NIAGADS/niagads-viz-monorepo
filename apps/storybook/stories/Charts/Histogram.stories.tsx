import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";

import { Histogram } from "@niagads/charts";
import { TABLE_DEFINTION as largeNumericTable } from "../../examples/tables/table_large_numeric_values";

// Demo wrapper to show selected range in parent div
const HistogramWithSliderDemo = (props: any) => {
    const [selected, setSelected] = useState<number[]>(props.initialSelection ?? []);
    return (
        <div>
            <div style={{ marginBottom: 12, fontSize: 16 }}>
                Selected range: {selected.length === 0 ? "(none)" : selected.join(" – ")}
            </div>
            <Histogram {...props} initialSelection={selected} onRangeSelect={setSelected} />
        </div>
    );
};

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
        enableRangeSelect: {
            control: { type: "boolean" },
            description: "Show slider for range selection",
            defaultValue: false,
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
        enableRangeSelect: false,
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

// Extract -log10(pvalue) from table data
const pvalueData = largeNumericTable.data.map((row) => {
    const p = parseFloat(row.pvalue as string);
    return parseFloat((-Math.log10(p)).toFixed(2));
});

export const PValueHistogram: Story = {
    render: (args) => <Histogram {...args} />,
    args: {
        data: pvalueData as number[],
        opts: {
            numBins: 50,
            xLabel: "-log10p",
            aspectRatio: 0.5,
            xMin: 0,
            xMax: 50,
        },
    },
};

export const PValueHistogramWithSlider: Story = {
    render: (args) => <HistogramWithSliderDemo {...args} />,
    args: {
        data: pvalueData as number[],
        opts: {
            numBins: 50,
            xLabel: "-log10p",
            aspectRatio: 0.5,
            xMin: 0,
            xMax: 50,
        },
        enableRangeSelect: true,
        rangeSelectionType: "max",
        initialSelection: [7],
    },
};
