import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeSlider as RSlider, RangeSliderVariant, Slider } from "@niagads/ui/client";
import React, { useEffect, useState } from "react";

import { Range } from "@niagads/common";

// Parent component for basic Slider
const SliderDemo = () => {
    const [value, setValue] = useState<number>(50);

    return (
        <div style={{ padding: "2rem", maxWidth: "500px" }}>
            <Slider
                name="single-slider"
                label="Select a value"
                value={value}
                min={0}
                max={100}
                step={1}
                onChange={setValue}
            />
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                <p>
                    <strong>Current Value:</strong> {value}
                </p>
            </div>
        </div>
    );
};

const RangeSliderDemo = ({ variant }: { variant: RangeSliderVariant }) => {
    const [rangeValue, setRangeValue] = useState<Range>();

    useEffect(() => {
        if (variant === "range") setRangeValue({ min: 50, max: 75 });
        else if (variant === "max") setRangeValue({ min: 0, max: 50 });
        else setRangeValue({ min: 50, max: 100 });
    }, []);

    return (
        <div style={{ padding: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
            {rangeValue && (
                <div style={{ maxWidth: "400px" }}>
                    <h3>Range - {variant} </h3>

                    <RSlider
                        name="range-slider"
                        label="Select a range"
                        value={rangeValue}
                        min={0}
                        max={100}
                        step={1}
                        variant={variant}
                        onChange={(v: Range) => setRangeValue(v)}
                    />

                    <div
                        style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "4px" }}
                    >
                        <p>
                            <strong>Current Range:</strong> [{rangeValue.min}, {rangeValue.max}]
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Storybook Meta Configuration
const meta: Meta = {
    title: "UI/Client/Slider",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story: Basic Slider
export const BasicSlider: Story = {
    render: () => <SliderDemo />,
};

export const MinSlider: Story = {
    render: () => <RangeSliderDemo variant="min" />,
};

export const MaxSlider: Story = {
    render: () => <RangeSliderDemo variant="max" />,
};

export const RangeSlider: Story = {
    render: () => <RangeSliderDemo variant="range" />,
};
