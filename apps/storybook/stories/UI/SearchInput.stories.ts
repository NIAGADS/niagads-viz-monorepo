import type { Meta, StoryObj } from "@storybook/react";

import { SearchInput } from "@bug_sam/ui";

const meta: Meta<typeof SearchInput> = {
    title: "NIAGADS-VIZ/UI/SearchInput",
    component: SearchInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
    args: {
        onChange: undefined,
        placeholder: undefined,
        value: ""
    },
};
