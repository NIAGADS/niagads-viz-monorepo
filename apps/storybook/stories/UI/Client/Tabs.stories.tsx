import type { Meta, StoryObj } from "@storybook/react";
import { TabDef, Tabs } from "@niagads/ui/client";

import Table from "@niagads/table";
import { TABLE_DEFINTION as table } from "../../../examples/tables/table_rendering_test";

//@ts-nocheck
// b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children

const meta: Meta<typeof Tabs> = {
    title: "UI/Client/Tabs",
    component: Tabs,
    parameters: {},
    tags: ["autodocs"],
    argTypes: {
        width: { control: "text", description: "Tailwind width class for the tab container" },
        tabs: { control: false, description: "Tab definitions (array of TabDef objects)" },
    },
    args: {
        width: "full",
        tabs: [
            {
                id: "text",
                label: "Text",
                content: (
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                ),
            },
            { id: "short-text", label: "Short Text", info: "short text", content: <p>test</p> },
            {
                id: "table",
                label: "Table",
                info: "tab with table",
                content: (
                    <Table id={table.id} columns={table.columns} options={table.options} data={table.data}></Table>
                ),
            },
        ],
    },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {
    args: {
        // Controls for width and sectionId are available in the Storybook UI
    },
};
