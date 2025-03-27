import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@niagads/table";

const meta: Meta<typeof Badge> = {
    title: "NIAGADS-VIZ/Text/Badge",
    component: Badge,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

// FIXME:

const props = {
    value: "Story not implemented; see notes in Boolean Badge story code",
};

export const Default: Story = {
    args: {
        props: props,
    },
};
