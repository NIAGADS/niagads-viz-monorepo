import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@niagads/ui";

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
        variant: "action",
        children: "Example Button",
        onClick: (event) => alert("I've been clicked!"),
    },
};
