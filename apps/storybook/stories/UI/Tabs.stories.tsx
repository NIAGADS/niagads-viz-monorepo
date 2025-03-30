//@ts-nocheck
// b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Table  from "@niagads/table";
import { Default as TableStory } from "../DataViz/Table/RenderingTestTable.stories";

import { Tabs, TabDef } from "@niagads/ui";

const meta: Meta<typeof Tabs> = {
    title: "NIAGADS-VIZ/UI/Tabs",
    component: Tabs,
    parameters: {
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const tabs: TabDef[] = [
    {
        id: "text",
        label: "Text",
        content: (
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
            </p>
        ),
    },
    { id: "short-text", label: "Short Text", info: "short text", content: <p>test</p> },
    { id: "table", label: "Table", info: "tab with table", content: <Table {...TableStory.args}></Table>},
];

// 
export const Default: Story = {
    args: {
        tabs: tabs,
        sectionId: "tabs",
    },
};
