import { BadgeIconType, BooleanBadge } from "@niagads/table";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BooleanBadge> = {
    title: "Table/Cell/Boolean Badge",
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

// TODO: investigate https://www.npmjs.com/package/storybook-addon-deep-controls
// to allow control & documentation of nested settings

interface BadgeProps {
    value: boolean;
    color?: string;
    icon?: BadgeIconType;
    iconOnly?: boolean;
}
const props: BadgeProps = {
    value: true,
    color: "green",
    icon: "circleCheck",
    iconOnly: false,
};

export const Default: Story = {
    args: {
        props: props,
    },
};
