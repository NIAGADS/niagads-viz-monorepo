import type { Meta, StoryObj } from "@storybook/react";

import { Alert } from "@niagads/ui";

const meta = {
    title: "UI/Alert",
    component: Alert,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ minWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        variant: {
            control: { type: "radio" },
            options: ["info", "error", "warning", "success"],
            description: "defaults to info",
        },
        message: { control: "text", description: "alert title; main message" },
        children: { control: "text", description: "(optional) text or child component" },
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    args: {
        variant: "info",
        message: "Pay attention!",
        children: "This is an alert",
    },
};
