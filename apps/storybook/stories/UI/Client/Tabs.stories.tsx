import type { Meta, StoryObj } from "@storybook/react";
import { TabHeader, TabBody, Tabs, Tab } from "@niagads/ui/client";

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
            <Tab id="tab1">
                <TabHeader>Tab 1</TabHeader>
                <TabBody>This is tab 1</TabBody>
            </Tab>,
            <Tab id="tab2">
                <TabHeader>Tab 2</TabHeader>
                <TabBody>This is tab 2</TabBody>
            </Tab>,
            <Tab id="tab3">
                <TabHeader>Tab 3</TabHeader>
                <TabBody>This is tab 3</TabBody>
            </Tab>,
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
