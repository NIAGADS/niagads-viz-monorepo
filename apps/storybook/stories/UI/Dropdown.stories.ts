import type { Meta, StoryObj } from "@storybook/react";

import { Dropdown } from "@bug_sam/ui";

const meta: Meta<typeof Dropdown> = {
    title: "NIAGADS-VIZ/UI/Dropdown",
    component: Dropdown,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
    args: {
        options: [
            {
                name: "Option 1",
                value: 1,
            },
            {
                name: "Option 2",
                value: 2,
            },
            {
                name: "Option 3",
                value: 3,
            },
        ],
        closeOnSelect: false,
        onSelect: (x) => console.log(x),
    },
};
