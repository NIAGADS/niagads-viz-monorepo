import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { Autocomplete } from "@niagads/ui/client";

const meta: Meta<typeof Autocomplete> = {
    title: "UI/Autocomplete",
    component: Autocomplete,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    argTypes: {
        suggestions: { control: "object", description: "Array of suggestion strings" },
        onSearch: { action: "searched", description: "Callback for search action" },
        onValueChange: { action: "valueChanged", description: "Callback for value change" },
    },
    args: {
        suggestions: ["foo", "bar", "baz", "test", "hello", "world"],
    },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const Playground: Story = {
    args: {
        // suggestions is set in meta.args
    },
};
