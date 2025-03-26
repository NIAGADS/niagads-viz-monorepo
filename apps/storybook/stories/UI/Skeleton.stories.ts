import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "@bug_sam/ui";

const meta: Meta<typeof Skeleton> = {
    title: "NIAGADS-VIZ/UI/Skeleton",
    component: Skeleton,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        type: "default",
    },
};
