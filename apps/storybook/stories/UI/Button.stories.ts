import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@bug_sam/ui";

const meta: Meta<typeof Button> = {
    title: "NIAGADS-VIZ/UI/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        variant: "primary",
        size: "md",
        children: "Example Button",
        //onClick: (event) => alert("I've been clicked!")
    },
};
