import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "@bug_sam/ui";

const meta: Meta<typeof Select> = {
    title: "NIAGADS-VIZ/UI/Select",
    component: Select,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        fields: [0, 10, 20, 50, 100, 500],
        label: "Results per page",
        id: "pages",
        inline: true,
        variant: "outline",
        //defaultValue: undefined
    },
};
