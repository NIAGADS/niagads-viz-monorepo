import { Card, CardBody, CardGrid, CardHeader, FeatureCard } from "@niagads/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Search } from "lucide-react";

const meta: Meta<typeof Card> = {
    title: "UI/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Card>;

const exampleBody = (
    <div>
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
        </div>
        <a className="ui-link" href="#">
            More information...
        </a>
    </div>
);

const spanValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const spanRows = buildSpanRows(spanValues, 12);

function buildSpanRows<T extends number>(spans: readonly T[], width: number) {
    const rows: T[][] = [];
    const remaining = [...spans].sort((a, b) => b - a) as T[];

    while (remaining.length) {
        const span = remaining.shift()!;

        if (span === width) {
            rows.push([span]);
            continue;
        }

        const complement = (width - span) as T;
        const matchIndex = remaining.indexOf(complement);

        if (matchIndex !== -1) {
            rows.push([span, remaining.splice(matchIndex, 1)[0]]);
            continue;
        }

        if (span * 2 === width) {
            rows.push([span, span]);
            continue;
        }

        rows.push([span]);
    }

    return rows as readonly (readonly T[])[];
}

export const Default: Story = {
    name: "Default Card",
    render: (args) => (
        <Card {...args}>
            <CardBody>{exampleBody}</CardBody>
        </Card>
    ),
    args: {
        //hover: fals,
    },
};

export const PressableCard: Story = {
    ...Default,
    name: "Pressable Card",
    args: {
        hover: true,
        onClick: () => alert("Card clicked!"),
    },
};

export const Feature: Story = {
    name: "FeatureCard",
    render: (args) => (
        <FeatureCard
            {...args}
            icon={Search}
            title="Explore something interesting"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
        />
    ),
    args: {
        hover: true,
        onClick: () => alert("Off you go!"),
    },
};

export const CardWithHeader: Story = {
    name: "Card with header",
    render: (args) => (
        <Card {...args}>
            <CardHeader>Example Card Header</CardHeader>
            <CardBody>{exampleBody}</CardBody>
        </Card>
    ),
    args: {
        hover: false,
    },
};

export const CardAsLink: Story = {
    name: "Card as link",
    render: (args) => (
        <Card {...args}>
            <CardBody>
                <div>This card is rendered as a link. It behaves like an anchor when clicked.</div>
            </CardBody>
        </Card>
    ),
    args: {
        href: "https://example.com",
        hover: true,
    },
};

export const ResponsiveSpanGrid: Story = {
    name: "Responsive span grid",
    render: () => (
        <div style={{ display: "grid", gap: "1rem", width: "100%" }}>
            {spanRows.map((row, rowIndex) => (
                <CardGrid key={rowIndex}>
                    {row.map((span, index) => (
                        <Card key={`${rowIndex}-${index}`} span={span} hover>
                            <CardHeader>{`span ${span}`}</CardHeader>
                            <CardBody>
                                <div style={{ fontSize: "0.9rem" }}>Row total: 12</div>
                            </CardBody>
                        </Card>
                    ))}
                </CardGrid>
            ))}
        </div>
    ),
};
