import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeSlider as RSlider, Slider } from "@niagads/ui/client";
import React, { useState } from "react";

import { Range } from "@niagads/common";

// Slider story with controls
const SliderStory = (props: any) => {
    const [value, setValue] = useState<number>(props.value ?? 50);
    return (
        <div style={{ padding: "2rem", maxWidth: "500px" }}>
            <Slider {...props} value={value} onChange={setValue} />
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                <p>
                    <strong>Current Value:</strong> {value}
                </p>
            </div>
        </div>
    );
};

// RangeSlider story with controls
const RangeSliderStory = (props: any) => {
    const [rangeValue, setRangeValue] = useState<Range>(props.value ?? { min: 25, max: 75 });
    return (
        <div style={{ padding: "2rem", maxWidth: "500px" }}>
            <RSlider {...props} value={rangeValue} onChange={setRangeValue} />
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                <p>
                    <strong>Current Range:</strong> [{rangeValue.min}, {rangeValue.max}]
                </p>
            </div>
        </div>
    );
};

const meta: Meta = {
    title: "UI/Client/Slider",
    tags: ["autodocs"],
    argTypes: {
        name: { control: "text", defaultValue: "slider" },
        label: { control: "text", defaultValue: "Select a value" },
        min: { control: "number", defaultValue: 0 },
        max: { control: "number", defaultValue: 100 },
        step: { control: "number", defaultValue: 1 },
        value: { control: "number", defaultValue: 50 },
        variant: {
            control: "radio",
            options: ["single", "min", "max"],
            defaultValue: "single",
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSlider: Story = {
    args: {
        name: "single-slider",
        label: "Select a value",
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        variant: "single",
    },
    render: (args) => <SliderStory {...args} />,
};

export const MinSlider: Story = {
    args: {
        name: "min-slider",
        label: "Pick minimum",
        min: 0,
        max: 100,
        step: 1,
        value: 25,
        variant: "min",
    },
    render: (args) => <SliderStory {...args} />,
};

export const MaxSlider: Story = {
    args: {
        name: "max-slider",
        label: "Pick maximum",
        min: 0,
        max: 100,
        step: 1,
        value: 75,
        variant: "max",
    },
    render: (args) => <SliderStory {...args} />,
};

export const RangeSlider: Story = {
    args: {
        name: "range-slider",
        label: "Select a range",
        min: 0,
        max: 100,
        step: 1,
        value: { min: 25, max: 75 },
    },
    render: (args) => <RangeSliderStory {...args} />,
};
