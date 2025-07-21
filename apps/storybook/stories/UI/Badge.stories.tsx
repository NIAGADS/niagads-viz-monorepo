import { CheckCircle, Info, XCircle } from "lucide-react";
import { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@niagads/ui";
import React from "react";

const iconOptions = {
    None: null,
    CheckCircle: <CheckCircle size={18} />,
    Info: <Info size={18} />,
    XCircle: <XCircle size={18} />,
};

const meta: Meta<typeof Badge> = {
    title: "UI/Badge",
    component: Badge,
    tags: ["autodocs"],
    argTypes: {
        icon: {
            control: { type: "select" },
            options: Object.keys(iconOptions),
            mapping: iconOptions,
        },
        iconPosition: {
            control: { type: "radio" },
            options: ["start", "end"],
        },
        variant: {
            control: { type: "radio" },
            options: ["badge", "pill"],
        },
        children: {
            control: { type: "text" },
        },
        className: {
            control: { type: "text" },
        },
        style: {
            control: { type: "object" },
        },
    },
    args: {
        children: "Default Badge",
        icon: null,
        iconPosition: "start",
        variant: "badge",
        className: "",
        style: {},
    },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
    args: {
        children: "Default Badge",
        icon: null,
        iconPosition: "start",
        variant: "badge",
        className: "",
        style: {},
    },
};

export const WithIcon: Story = {
    args: {
        children: "With Icon",
        icon: <CheckCircle size={18} />,
        iconPosition: "start",
    },
};

export const Pill: Story = {
    args: {
        children: "Pill Variant",
        variant: "pill",
    },
};

export const PillWithIcon: Story = {
    args: {
        children: "Pill + Icon",
        icon: <CheckCircle size={18} />,
        iconPosition: "end",
        variant: "pill",
    },
};
