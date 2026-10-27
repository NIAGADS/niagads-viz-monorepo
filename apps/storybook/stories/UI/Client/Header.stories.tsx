import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionMenu, Header } from "@niagads/ui/client";
import { User } from "lucide-react";
import Link from "next/link";

const meta = {
    title: "UI/Client/Header",
    component: Header,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    args: {
        logo: <span style={{ color: "white", fontWeight: 700 }}>NIAGADS</span>,
        links: [
            { text: "Browse Datasets", url: "#datasets", active: true },
            { text: "Genome Browser", url: "#browser" },
            { text: "Tutorials", url: "#tutorials" },
            { text: "About", url: "#about" },
        ],
    },
    argTypes: {
        logo: { control: false },
        search: { control: false },
        userMenu: { control: false },
        children: { control: false },
        mobileMenu: { control: "boolean" },
        mobileMenuConfig: { control: false },
        linkComponent: { control: false },
    },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const search = (
    <input
        type="search"
        aria-label="Search"
        placeholder="Search for genes, tracks, regions..."
        style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--border-radius)" }}
    />
);
const userMenu = (
    <ActionMenu label="Demo User" icon={User}>
        <a href="#profile" style={{ display: "block", padding: "0.5rem" }}>
            Profile
        </a>
        <button type="button" style={{ margin: "0.5rem" }}>
            Sign Out
        </button>
    </ActionMenu>
);

export const Default: Story = {};
export const WithSearch: Story = { args: { search } };
export const WithUserMenu: Story = { args: { userMenu } };
export const WithSearchAndUserMenu: Story = { args: { search, userMenu } };
export const WithRouterLinks: Story = { args: { linkComponent: Link } };

export const MobileMenu: Story = {
    args: { mobileMenu: true },
    render: (args) => (
        <>
            <Header {...args} />
            <p style={{ marginTop: "calc(var(--header-height) + 1rem)", padding: "1rem" }}>
                Resize below 768px to use the mobile menu button.
            </p>
        </>
    ),
};

export const MobileMenuWithSearch: Story = {
    ...MobileMenu,
    args: { search, mobileMenu: true, mobileMenuConfig: { footer: <p>NIAGADS</p> } },
};
