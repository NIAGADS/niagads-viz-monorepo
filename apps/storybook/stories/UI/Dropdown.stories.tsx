import { Dropdown } from "@niagads/ui/client";
import React from "react";

const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
];

export default {
    title: "UI/Dropdown",
    component: Dropdown,
    argTypes: {
        value: {
            control: { type: "select" },
            options: ["", ...options.map((o) => o.value)],
        },
        placeholder: { control: "text" },
        options: { control: false },
        onChange: { action: "changed" },
    },
    args: {
        value: "",
        placeholder: "Select an option...",
        options,
    },
};

export const Default = (args) => (
    <div style={{ width: 240 }}>
        <Dropdown {...args} />
    </div>
);

export const WithPreselected = (args) => (
    <div style={{ width: 240 }}>
        <Dropdown {...args} value="2" />
    </div>
);

export const Disabled = (args) => (
    <div style={{ width: 240, opacity: 0.5 }}>
        <Dropdown {...args} value="" onChange={() => {}} placeholder="Disabled..." /* disabled */ />
    </div>
);
