import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ActionButton } from "@niagads/ui";

const DownloadIcon = () => (
    <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
    </svg>
);

const meta: Meta<typeof ActionButton> = {
    title: "UI/ActionButton",
    component: ActionButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text", description: "Action label" },
        icon: { control: false },
        className: { control: false },
        style: { control: false },
        onClick: { action: "clicked", description: "Click handler" },
    },
    args: {
        children: "Export data",
    },
    render: (args) => <ActionButton {...args} icon={<DownloadIcon />} />,
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {};
