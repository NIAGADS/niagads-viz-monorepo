//@ts-nocheck
// b/c of https://github.com/storybookjs/storybook/issues/23170 issue w/subcomponets w/children
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Default as NavigationStory } from "../Navigation.stories";
import { Default as TableStory } from "../../DataViz/Table/FilerTable.stories";

import { RootLayout } from "@niagads/ui/layouts";
import Table from "@niagads/table";

const meta: Meta<typeof RootLayout> = {
    title: "NIAGADS-VIZ/UI/Layouts/RootLayout",
    component: RootLayout,
    parameters: {},
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RootLayout>;

export const Default: Story = {
    args: {
        theme: "light",
        navigationContent: NavigationStory.args?.config,
        fullWidth: true,
        children: (
            <>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur.
                </p>

                <a className="ui-link" href="#">
                    More information...
                </a>

                <Table {...TableStory.args} />
            </>
        ),
    },
};
