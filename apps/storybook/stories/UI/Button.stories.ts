import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@niagads/ui";

const meta: Meta<typeof Button> = {
    title: "NIAGADS-VIZ/UI/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: { type: "radio" },
            options: ["default", "link", "icon"],
            description: "Button style variant",
        },
        color: {
            control: { type: "radio" },
            options: ["default", "primary"],
            description: "Button color style variant",
        },
        children: { control: "text", description: "Button label or content" },
        disabled: { control: "boolean", description: "Disable the button" },
        onClick: { action: "clicked", description: "Click handler" },
        className: { control: false },
    },
    args: {
        variant: "default",
        children: "Example Button",
        disabled: false,
        className: "",
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
    args: {
        // All controls are set in meta.args
    },
};
