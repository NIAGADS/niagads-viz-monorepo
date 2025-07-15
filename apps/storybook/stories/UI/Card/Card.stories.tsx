//@ts-nocheck
// b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Card, CardHeader, CardBody } from "@niagads/ui";
import { Default as CardHeaderStory } from "./CardHeader.stories";
import { Default as CardBodyStory } from "./CardBody.stories";

const meta: Meta<typeof Card> = {
    title: "NIAGADS-VIZ/UI/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
    name: "Default Card",
    render: (args) => (
        <Card {...args}>
            <CardHeader {...CardHeaderStory.args} />
            <CardBody {...CardBodyStory.args} />
        </Card>
    ),
    args: {
        variant = "half",
    },
};

export const LinkCard: Story = {
    ...Default,
    name: "Pressable Card: Link",
    args: {
        shadow: true,
        radius: "md",
        href: "#",
    },
};

export const ButtonCard: Story = {
    ...Default,
    name: "PressableCard: Button",
    args: {
        shadow: true,
        radius: "md",
        onClick: (event) => alert("I've been clicked!"),
    },
};
