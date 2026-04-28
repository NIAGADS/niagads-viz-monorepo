import { AlertCircle, Globe, Lock, Zap } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@niagads/ui";
import { RichSelect } from "@niagads/ui/client";
import { useState } from "react";

const meta: Meta<typeof RichSelect> = {
    title: "UI/Client/RichSelect",
    component: RichSelect,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        placeholder: {
            control: "text",
            description: "Placeholder text when no option is selected",
            defaultValue: "Select an option",
        },
        value: {
            control: "text",
            description: "Currently selected option value",
        },
        onChange: {
            action: "changed",
            description: "Callback fired when an option is selected",
        },
        label: { control: "text" },
    },
};

export default meta;
type Story = StoryObj<typeof RichSelect>;

const basicOptions = {
    option1: "Simple option",
    option2: "Another option",
    option3: "Third option",
};

const iconOptions = {
    public: <Globe size={18} color="#3b82f6" />,
    private: <Lock size={18} color="#ef4444" />,
    fast: <Zap size={18} color="#f59e0b" />,
    warning: <AlertCircle size={18} color="#8b5cf6" />,
};

const richOptions = {
    apple: <span style={{ fontSize: "0.75rem", color: "#dc2626", marginLeft: "0.5rem" }}>🍎 Fresh</span>,
    banana: <span style={{ fontSize: "0.75rem", color: "#f59e0b", marginLeft: "0.5rem" }}>🍌 Tropical</span>,
    cherry: <span style={{ fontSize: "0.75rem", color: "#7c3aed", marginLeft: "0.5rem" }}>🍒 Sweet</span>,
    dragon_fruit: <span style={{ fontSize: "0.75rem", color: "#ec4899", marginLeft: "0.5rem" }}>🐉 Exotic</span>,
};

const StatusOptions = {
    active: (
        <Badge
            style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                fontSize: "0.75rem",
                fontWeight: "600",
            }}
        >
            Active
        </Badge>
    ),
    inactive: (
        <Badge
            style={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                fontSize: "0.75rem",
                fontWeight: "600",
            }}
        >
            Inactive
        </Badge>
    ),
    pending: (
        <Badge
            style={{
                backgroundColor: "#fef3c7",
                color: "#92400e",
                fontSize: "0.75rem",
                fontWeight: "600",
            }}
        >
            Pending
        </Badge>
    ),
};

const Interactive = (args: any) => {
    const [selected, setSelected] = useState("");
    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <RichSelect
                {...args}
                value={selected}
                onChange={(value: string) => {
                    setSelected(value);
                    args.onChange?.(value);
                }}
            />
            {selected && <p style={{ marginTop: "1rem" }}>Selected: {selected}</p>}
        </div>
    );
};

export const BasicOptions: Story = {
    render: (args) => <Interactive {...args} />,
    args: {
        options: basicOptions,
        placeholder: "Choose an option",
        label: "Basic",
    },
};

export const WithIcons: Story = {
    render: (args) => <Interactive {...args} />,
    args: {
        options: iconOptions,
        placeholder: "Select an option",
        label: "With Icons",
    },
};

export const WithEmojis: Story = {
    render: (args) => <Interactive {...args} />,
    args: {
        options: richOptions,
        placeholder: "Select a fruit",
        label: "With Emojis",
    },
};

export const WithBadges: Story = {
    render: (args) => <Interactive {...args} />,
    args: {
        options: StatusOptions,
        placeholder: "Select a status",
        label: "With Badges",
    },
};
