import type { Meta, StoryObj } from "@storybook/react";

import { BooleanBadge, BadgeIconType } from "@bug_sam/table";

const meta: Meta<typeof BooleanBadge> = {
    title: "NIAGADS-VIZ/Text/Boolean Badge",
    component: BooleanBadge,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BooleanBadge>;

// FIXME: the story re-renders after the icon prop gets internally updated to the mapped icon object & then throws an error;
// maybe need to add an internal property for the iconObj? or just not worry about the story

interface BadgeProps {
    value: boolean;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    icon?: BadgeIconType;
}
const props: BadgeProps = {
    value: true,
    color: "green",
    icon: "solidCheck",
};

export const Default: Story = {
    args: {
        props: props,
    },
};
