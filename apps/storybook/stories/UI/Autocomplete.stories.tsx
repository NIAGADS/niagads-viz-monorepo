import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Autocomplete } from "@niagads/ui/client";

const meta: Meta<typeof Autocomplete> = {
    title: "NIAGADS-VIZ/UI/Autocomplete",
    component: Autocomplete,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;
const suggestions = ["foo", "bar", "baz", "test", "hello", "world"];

export const Display: Story = {
    args: {
        suggestions: suggestions,
        onSearch: (term) => alert(`Searching for ${term}`),
        onValueChange: (value) => console.log(`value set as: ${value}`),
    },
};
