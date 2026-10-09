import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileMenu } from "@niagads/ui/client";
import Link from "next/link";
import { useState } from "react";

const meta = {
    title: "UI/Client/MobileMenu",
    component: MobileMenu,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    args: {
        isOpen: false,
        onClose: () => {},
        links: [
            { text: "Home", url: "#home", active: true },
            { text: "Browse Datasets", url: "#datasets" },
            { text: "Genome Browser", url: "#browser" },
            { text: "About", url: "#about" },
        ],
    },
    argTypes: {
        search: { control: false },
        footer: { control: false },
        linkComponent: { control: false },
    },
    render: function MenuExample(args) {
        const [open, setOpen] = useState(args.isOpen);
        return (
            <div style={{ padding: "1rem" }}>
                <button type="button" onClick={() => setOpen(true)}>
                    Open mobile menu
                </button>
                <MobileMenu
                    {...args}
                    isOpen={open}
                    onClose={() => {
                        setOpen(false);
                        args.onClose();
                    }}
                />
            </div>
        );
    },
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithSearch: Story = {
    args: {
        search: (
            <input
                type="search"
                aria-label="Search"
                placeholder="Search genes, variants, regions..."
                style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--border-radius)" }}
            />
        ),
    },
};
export const WithFooter: Story = {
    args: { footer: <p>NIAGADS GenomicsDB</p> },
};
export const WithRouterLinks: Story = {
    args: { linkComponent: Link },
};
