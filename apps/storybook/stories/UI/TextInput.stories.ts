import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextInput } from "@niagads/ui";

const meta: Meta<typeof TextInput> = {
    title: "UI/TextInput",
    component: TextInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        value: { control: "text" },
        placeholder: { control: "text" },
    },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
    args: {
        onChange: undefined,
        placeholder: undefined,
        value: "",
    },
};
