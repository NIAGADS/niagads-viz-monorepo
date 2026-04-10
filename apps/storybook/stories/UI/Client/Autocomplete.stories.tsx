import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Autocomplete } from "@niagads/ui/client";

const suggestions = [
    "banana",
    "apple",
    "grapes",
    "watermelon",
    "avocado",
    "tangerine",
    "orange",
    "mandarin",
    "lemon",
    "pineapple",
    "peach",
    "cherry",
    "kiwi",
    "lime",
    "grapefruit",
    "pomegranate",
    "strawberry",
    "blueberry",
    "raspberry",
    "blackberry",
];

const AutocompleteDemo = () => {
    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Autocomplete suggestions={suggestions} onSelect={(s) => alert("you have selected: " + s)} />
        </div>
    );
};

const meta: Meta<typeof Autocomplete> = {
    title: "UI/Client/Autocomplete",
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

export const NormalAutocomplete = () => <AutocompleteDemo />;
