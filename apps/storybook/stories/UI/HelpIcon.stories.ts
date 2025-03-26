import type { Meta, StoryObj } from "@storybook/react";

import { HelpIcon } from "@bug_sam/ui";

const meta: Meta<typeof HelpIcon> = {
    title: "NIAGADS-VIZ/UI/HelpIcon",
    component: HelpIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HelpIcon>;

export const Default: Story = {
    args: {
        message: "Pay attention!",
        type: "info"
    },
};
