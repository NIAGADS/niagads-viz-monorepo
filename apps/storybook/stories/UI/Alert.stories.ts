import type { Meta, StoryObj } from "@storybook/react";

import { Alert } from "@bug_sam/ui";

const meta: Meta<typeof Alert> = {
    title: "NIAGADS-VIZ/UI/Alert",
    component: Alert,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    args: {
        variant: "default",
        message: "Pay attention!",
        children: "This is an alert"
    },
};
