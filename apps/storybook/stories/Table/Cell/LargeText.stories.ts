import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@niagads/table";

const meta: Meta<typeof Text> = {
    title: "Table/Cell/Truncated Text",
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
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, elit at molestie accumsan, arcu orci interdum diam, vitae mattis libero est vel enim. Suspendisse quis metus erat. Nullam convallis sed turpis nec elementum. Mauris mattis elit eros, in commodo tellus laoreet at. Nunc ultrices vel massa sit amet tincidunt.",
    color: "grey",
    truncateTo: 100,
};

export const Default: Story = {
    args: {
        props: props,
    },
};
