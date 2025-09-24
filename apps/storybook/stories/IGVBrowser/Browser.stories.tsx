//@ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";

import { IGVBrowser } from "@niagads/igv";

const meta: Meta<typeof Table> = {
    title: "IGVBrowser/Browser",
    component: MemoIGVBrowser,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MemoIGVBrowser>;

export const Default: Story = {
    args: {
        genome: "APOE",
        featureSearchURI: "",
    },
};
