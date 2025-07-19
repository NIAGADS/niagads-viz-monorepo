import type { Meta, StoryObj } from "@storybook/react";

import { Default as NavigationStory } from "../Navigation.stories";
import { RootLayout } from "@niagads/ui/layouts";
import Table from "@niagads/table";
import { Default as TableStory } from "../../Table/FilerTable.stories";

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
        fullWidth: true,
        bannerMsg: "",
        navigationContent: NavigationStory.args?.config,
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

                <Table id={TableStory.args!.id!} data={TableStory.args!.data!} columns={TableStory.args!.columns!} />
            </>
        ),
    },
};
