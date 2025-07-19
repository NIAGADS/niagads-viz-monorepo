import { Card, CardBody, CardHeader, FeatureCard } from "@niagads/ui";
import type { Meta, StoryObj } from "@storybook/react";

import { Default as CardBodyStory } from "./CardBody.stories";
import { Default as CardHeaderStory } from "./CardHeader.stories";
import { Search } from "lucide-react";

const meta: Meta<typeof Card> = {
    title: "NIAGADS-VIZ/UI/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
    name: "Default Card",
    render: (args) => (
        <Card {...args}>
            <CardBody>{CardBodyStory.args!.children}</CardBody>
        </Card>
    ),
    args: {
        variant: "full",
        hover: true,
    },
};

export const PressableCard: Story = {
    ...Default,
    name: "Pressable Card",
    args: {
        variant: "full",
        hover: true,
        onClick: () => alert("Card clicked!"),
    },
};

export const Feature: Story = {
    name: "FeatureCard",
    render: (args) => (
        <FeatureCard
            {...args}
            icon={Search}
            title="Explore something interesting"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
        />
    ),
    args: {
        variant: "full",
        hover: true,
        onClick: () => alert("Off you go!"),
    },
};

export const CardWitHeader: Story = {
    name: "Default Card With Header",
    render: (args) => (
        <Card {...args}>
            <CardHeader>{CardHeaderStory.args!.children!} </CardHeader>
            <CardBody>{CardBodyStory.args!.children}</CardBody>
        </Card>
    ),
    args: {
        variant: "full",
        hover: false,
    },
};
