import type { Meta, StoryObj } from "@storybook/react";
import { TabHeader, TabBody, Tabs } from "@niagads/ui/client";

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
        children: { control: false, description: "Tab components" },
    },
    args: {
        width: "full",
        children: [
            <TabHeader id="tab1">Tab 1</TabHeader>,
            <TabHeader id="tab2">Tab 2</TabHeader>,
            <TabHeader id="tab3">Tab 3</TabHeader>,
            <TabBody id="tab1">This is tab 1</TabBody>,
            <TabBody id="tab2">This is tab 2</TabBody>,
            <TabBody id="tab3">This is tab 3</TabBody>,
        ]
    },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {
    args: {
        // Controls for width and sectionId are available in the Storybook UI
    },
};
