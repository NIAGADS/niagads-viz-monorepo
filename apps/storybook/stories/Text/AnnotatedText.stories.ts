import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@bug_sam/table";

const meta: Meta<typeof Text> = {
    title: "NIAGADS-VIZ/Text/Annotated Text",
    component: Text,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Text>;

// TODO: investigate https://www.npmjs.com/package/storybook-addon-deep-controls
// to allow control & documentation of nested settings

const props = {
    value: "Lorem ipsum dolor sit amet",
    tooltip: "add notes to text that provide an explanation or context",
    color: "teal",
    inlineTooltip: true,
};

export const Default: Story = {
    args: {
        props: props,
    },
};
