import type { Meta, StoryObj } from "@storybook/react";

import { PercentageBar } from "@niagads/table";

const meta: Meta<typeof PercentageBar> = {
    title: "NIAGADS-VIZ/Table/Cell/PercentageBar",
    component: PercentageBar,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PercentageBar>;

export const Default: Story = {
    args: {
        props: { value: 0.62 },
    },
};
