import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Slider } from "@niagads/ui/client";

const meta: Meta<typeof Slider> = {
    title: "NIAGADS-VIZ/UI/Slider",
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

export const Display: Story = {
    args: {
        name: "test slider",
        label: "Test Slider",
        variant: "default",
        value: [20, 50],
        min: 0,
        max: 100,
        step: 10,
        onChange: (n) => console.log(n),
    },
};


export const OneThumb = () => {
    const [value, setValue] = useState([50]);

    return (
        <div>
            <Slider 
                name="testSlider"
                value={value}
                min={0}
                max={100}
                step={5}
                onChange={v => setValue(v)}
            />
        </div>
    )
}

export const TwoThumbs: React.FC = () => {
    const [value, setValue] = useState([25, 75])

    return (
        <div>
            <Slider 
                name="testSlider"
                value={value}
                min={0}
                max={100}
                step={5}
                onChange={v => setValue(v)}
            />
        </div>
    )
}

