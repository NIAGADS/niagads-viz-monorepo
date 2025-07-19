import { Card, CardBody, CardHeader } from "@niagads/ui";
import type { Meta, StoryObj } from "@storybook/react";

import { Default as CardBodyStory } from "./CardBody.stories";
import { Default as CardHeaderStory } from "./CardHeader.stories";
// @ts-nocheck
import React from "react";

// no-check b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children

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
            <CardHeader>{CardHeaderStory.args!.children!} </CardHeader>
            <CardBody>{CardBodyStory.args!.children}</CardBody>
        </Card>
    ),
    args: {
        variant: "half",
        hover: false,
    },
};

export const LinkCard: Story = {
    ...Default,
    name: "Pressable Card: Link",
    args: {
        variant: "half",
        hover: true,
    },
};

export const ButtonCard: Story = {
    ...Default,
    name: "PressableCard: Button",
    args: {
        variant: "half",
        hover: true,
        onClick: (event) => alert("I've been clicked!"),
    },
};
