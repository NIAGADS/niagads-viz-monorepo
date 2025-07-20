import React, { useState } from "react";

import { Toggle } from "@niagads/ui";

export default {
    title: "UI/Toggle",
    component: Toggle,
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        label: { control: "text" },
        variant: {
            control: { type: "radio" },
            options: ["default", "primary"],
        },
        className: { control: false },
        style: { control: false },
        onChange: { action: "changed" },
    },
    args: {
        checked: false,
        disabled: false,
        label: "Toggle label",
        variant: "default",
    },
};

export const Default = (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
        <Toggle
            {...args}
            checked={checked}
            onChange={(val) => {
                setChecked(val);
                args.onChange?.(val);
            }}
        />
    );
};
