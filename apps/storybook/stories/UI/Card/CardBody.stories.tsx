import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { CardBody } from "@niagads/ui";

const meta: Meta<typeof CardBody> = {
    title: "NIAGADS-VIZ/UI/Card/CardBody",
    component: CardBody,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CardBody>;

export const Default: Story = {
    args: {
        children: (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur.
                </p>

                <a className="ui-link" href="#">More information...</a>
            </div>
        ),
    },
};
