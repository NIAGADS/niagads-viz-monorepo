import type { Meta, StoryObj } from "@storybook/react";

import { HelpIcon } from "@niagads/ui";

const meta: Meta<typeof HelpIcon> = {
    title: "UI/HelpIcon",
    component: HelpIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
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
        message: "Pay attention!",
        variant: "alert",
        className: "",
    },
};
