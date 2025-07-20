import type { Meta, StoryObj } from "@storybook/react";

import { HelpIcon } from "@niagads/ui/client";

const meta: Meta<typeof HelpIcon> = {
    title: "UI/HelpIcon",
    component: HelpIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        anchorId: { control: "text" },
        message: { control: "text" },
        variant: { control: { type: "radio" }, options: ["alert", "question", "info"] },
        className: {
            control: "text",
            description: "Custom className for the icon wrapper; used primarily to set the icon color",
        },
    },
};

export default meta;
type Story = StoryObj<typeof HelpIcon>;

export const Default: Story = {
    args: {
        anchorId: "info",
        message: "Pay attention!",
        variant: "alert",
        className: "",
    },
};
