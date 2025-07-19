import { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@niagads/ui";
import { CheckCircle } from "lucide-react";
import React from "react";

const meta: Meta<typeof Badge> = {
    title: "UI/Badge",
    component: Badge,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        text: "Default Badge",
    },
};

export const WithIcon: Story = {
    args: {
        text: "With Icon",
        icon: CheckCircle,
        iconPosition: "start",
    },
};

export const Pill: Story = {
    args: {
        text: "Pill Variant",
        variant: "pill",
    },
};

export const PillWithIcon: Story = {
    args: {
        text: "Pill + Icon",
        icon: CheckCircle,
        iconPosition: "end",
        variant: "pill",
    },
};
