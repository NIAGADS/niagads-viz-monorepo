import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";

import { Slider } from "@niagads/ui/client";

type SliderVariant = "single" | "min" | "max" | "range";

const SliderDemo: React.FC<{ variant: SliderVariant; label: string }> = ({ variant, label }) => {
    const initialValues: Record<SliderVariant, number[]> = {
        single: [50],
        min: [50],
        max: [50],
        range: [25, 75],
    };

    const [value, setValue] = React.useState(initialValues[variant]);
    const min = 0;
    const max = 100;
    const step = 5;

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Slider
                name={variant + "Slider"}
                label={label}
                value={value}
                min={min}
                max={max}
                step={step}
                variant={variant}
                onChange={setValue}
            />
            <div style={{ marginTop: 16, fontSize: 14, color: "#374151" }}>
                <strong>Current Value:</strong> {value[0]}
            </div>
        </div>
    );
};

const meta: Meta<typeof Slider> = {
    title: "UI/Client/Slider",
    component: Slider,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const SingleSlider = () => <SliderDemo variant="single" label="Single Slider" />;
export const MinSlider = () => <SliderDemo variant="min" label="Min Slider (highlight min→value)" />;
export const MaxSlider = () => <SliderDemo variant="max" label="Max Slider (highlight value→max)" />;
export const RangeSlider = () => <SliderDemo variant="range" label="Range Slider (highlight range)" />;
