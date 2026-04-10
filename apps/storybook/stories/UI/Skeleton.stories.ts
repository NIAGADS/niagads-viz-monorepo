import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Skeleton } from "@niagads/ui";

const meta: Meta<typeof Skeleton> = {
    title: "UI/Skeleton",
    component: Skeleton,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    argTypes: {
        type: { control: { type: "radio" }, options: ["default", "card", "table"] },
    },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        type: "default",
    },
};
