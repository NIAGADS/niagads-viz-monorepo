import type { Meta, StoryObj } from "@storybook/react";

import { CardHeader } from "@niagads/ui";
import React from "react";

const meta: Meta<typeof CardHeader> = {
    title: "UI/Card/CardHeader",
    component: CardHeader,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CardHeader>;

export const Default: Story = {
    args: {
        children: "Example Card Header",
    },
};
