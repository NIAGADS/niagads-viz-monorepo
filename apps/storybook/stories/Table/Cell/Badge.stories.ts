import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@niagads/table";

const meta: Meta<typeof Badge> = {
    title: "Table/Cell/Badge",
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
    value: "FAIL",
    icon: "warning",
    tooltip: "this data did not pass QC",
    color: "red",
    borderColor: "red",
    backgroundColor: "#ffe5e5",
};

export const Default: Story = {
    args: {
        props: props,
    },
};
