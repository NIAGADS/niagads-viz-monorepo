import type { Meta, StoryObj } from "@storybook/react";
import { Tab, Tabs } from "@niagads/ui/client";

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
            <Tab id="tab1" title="Tab 1">This is tab 1</Tab>,
            <Tab id="tab2" title="Tab 2">This is tab 2</Tab>,
            <Tab id="tab3" title="Tab 3">This is tab 3</Tab>,
            <Tab id="tab4" title="Tab 4">This is tab 4</Tab>,
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
