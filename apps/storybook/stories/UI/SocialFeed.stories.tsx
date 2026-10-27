import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialFeed, type SocialFeedProps } from "@niagads/ui";

// Storybook runs in the browser; resolve the async server component for its preview.
function SocialFeedPreview(props: SocialFeedProps) {
    const [content, setContent] = useState<React.ReactNode>(null);
    useEffect(() => {
        let active = true;
        setContent(null);
        SocialFeed(props).then((element) => {
            if (active) setContent(element);
        });
        return () => {
            active = false;
        };
    }, [props.platform, props.handle, props.accessToken, props.className, props.style, props.id]);
    return content ?? <p>Loading feed…</p>;
}

const meta = {
    title: "UI/SocialFeed",
    component: SocialFeed,
    tags: ["autodocs"],
    parameters: { layout: "padded" },
    render: (args) => <SocialFeedPreview {...args} />,
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 336 }}>
                <Story />
            </div>
        ),
    ],
    args: { platform: "Bluesky", handle: "niagads.bsky.social" },
    argTypes: {
        platform: { control: "select", options: ["Bluesky", "X"] },
        accessToken: { control: false },
    },
} satisfies Meta<typeof SocialFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bluesky: Story = {};
export const XWithoutToken: Story = { args: { platform: "X", handle: "NIAGADS" } };
