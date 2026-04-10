import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Info } from "lucide-react";
import { InlineIcon } from "@niagads/ui";

const meta: Meta<typeof InlineIcon> = {
    title: "UI/InlineIcon",
    component: InlineIcon,
    tags: ["autodocs"],
    argTypes: {
        icon: {
            control: false,
            description: "Icon to display (ReactNode)",
        },
        children: {
            control: "text",
            description: "Text or child component to display next to the icon",
        },
        iconPosition: {
            control: { type: "radio" },
            options: ["start", "end"],
            description: "Position of the icon relative to the text",
            type: { name: "string", required: false },
        },
        className: {
            control: false,
            type: { name: "string", required: false },
        },
    },
    args: {
        icon: <Info size={18} />,
        children: "Info text",
        iconPosition: "start",
    },
};

export default meta;
type Story = StoryObj<typeof InlineIcon>;

export const Playground: Story = {
    args: {
        // icon, children, and iconPosition are set in meta.args
    },
};
