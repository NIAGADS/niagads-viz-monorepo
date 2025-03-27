import type { Meta, StoryObj } from "@storybook/react";

import { Slider } from "@niagads/ui";

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

export const Default: Story = {
    args: {
        name: "test slider",
        label: "Test Slider",
        variant: "default",
        value: 50,
        min: 0,
        max: 100,
        step: 10,
        onChange: (n) => console.log(n),
    },
};
