import { FilterChip, FilterChipProps } from "@niagads/ui";
import React, { useState } from "react";

const Template = (args: FilterChipProps) => <FilterChip {...args} />;

export default {
    title: "UI/FilterChip",
    component: FilterChip,
    argTypes: {
        label: { control: "text" },
        selected: { control: "boolean" },
        disabled: { control: "boolean" },
        onRemove: { action: "removed" },
    },
};

export const Default = Template.bind({});
Default.args = {
    label: "Example Chip",
    selected: false,
    disabled: false,
};

export const Removable = (args: FilterChipProps) => {
    const [visible, setVisible] = useState(true);
    return visible ? <FilterChip {...args} onRemove={() => setVisible(false)} /> : null;
};
Removable.args = {
    label: "Removable Chip",
    selected: false,
    disabled: false,
};

export const Selected = Template.bind({});
Selected.args = {
    label: "Selected Chip",
    selected: true,
    disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
    label: "Disabled Chip",
    selected: false,
    disabled: true,
};
