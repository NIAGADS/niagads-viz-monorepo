import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "@niagads/ui";

const meta: Meta<typeof TextInput> = {
    title: "NIAGADS-VIZ/UI/TextInput",
    component: TextInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
    args: {
        onChange: undefined,
        placeholder: undefined,
        value: ""
    },
};
