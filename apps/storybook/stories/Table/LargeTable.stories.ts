//@ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";

import Table from "@niagads/table";
import { TABLE_DEFINTION as table } from "../../examples/tables/table_large_numeric_values";

const meta: Meta<typeof Table> = {
    title: "NIAGADS-VIZ/Table/Large Table",
    component: Table,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "fullscreen",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
    args: {
        id: table.id,
        columns: table.columns,
        options: table.options,
        data: table.data,
    },
};
