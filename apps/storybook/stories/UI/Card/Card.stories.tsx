import { Card, CardBody, CardHeader } from "@niagads/ui";
import type { Meta, StoryObj } from "@storybook/react";

import { Default as CardBodyStory } from "./CardBody.stories";
import { Default as CardHeaderStory } from "./CardHeader.stories";
//@ts-nocheck
// b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children
import React from "react";

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
            <div>Placeholder until we can resolve the CardHeader/Body issue see Card.stories.tsx</div>
            {/*<CardHeader {...CardHeaderStory.args} />
            <CardBody {...CardBodyStory.args} />*/}
        </Card>
    ),
    args: {
        variant: "half",
    },
};

export const LinkCard: Story = {
    ...Default,
    name: "Pressable Card: Link",
    args: {
        variant: "half",
    },
};

export const ButtonCard: Story = {
    ...Default,
    name: "PressableCard: Button",
    args: {
        variant: "half",
        onClick: (event) => alert("I've been clicked!"),
    },
};
