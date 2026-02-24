import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "@niagads/ui";

const meta: Meta<typeof Checkbox> = {
    title: "UI/Checkbox",
    component: Checkbox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: { control: { type: "radio" }, options: ["primary", "secondary"] },
        label: { control: "text" },
        disabled: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        variant: "primary",
        label: "Option A",
        disabled: false,
        onChange: (event) => alert("I've been toggled!"),
    },
};
