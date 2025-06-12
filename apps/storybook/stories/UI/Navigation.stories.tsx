//@ts-nocheck
// b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { NAV_DEFINTION as menuConfig } from "../../examples/navigation/basic_nav_menu";
import { Navigation } from "@niagads/ui";

const meta: Meta<typeof Navigation> = {
    title: "NIAGADS-VIZ/UI/Navigation",
    component: Navigation,
    parameters: {},
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
    name: "Templated Navigation: Content defined by NavigationConfig",
    args: {
        variant: "dark",
        config: menuConfig,
        bannerMsg: "Site message or alert",
    },
};

export const CustomNavigation: Story = {
    name: "Custom Navigation: Content defined by {children} ReactNode",
    args: {
        variant: "primary",
        children: (
            <>
                <div>Content TBA Later</div>
            </>
        ),
        bannerMsg: "",
    },
};
