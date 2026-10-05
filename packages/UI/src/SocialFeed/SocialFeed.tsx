import { BlueSkyIcon, XTwitterIcon } from "@/src/Icons";
import { Card, CardBody, CardHeader } from "@/src/Card";
import { SocialPlatform, SocialPost, fetchSocialPosts } from "./fetch-posts";

import { InlineIcon } from "@/src/InlineIcon";
import React from "react";
import { StylingProps } from "../types";
import styles from "./social-feed.module.css";

export interface SocialFeedProps extends StylingProps {
    platform: SocialPlatform;
    handle: string;
    accessToken?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
});

/** Render on the server so access tokens are not sent to the browser. */
export const SocialFeed = async ({ platform, handle, accessToken, className, style, id }: SocialFeedProps) => {
    const account = handle.replace(/^@/, "");
    const Logo = platform === "X" ? XTwitterIcon : BlueSkyIcon;
    const profileUrl = platform === "X" ? `https://x.com/${account}` : `https://bsky.app/profile/${account}`;
    let posts: SocialPost[] | undefined;
    let error: string | undefined;
    try {
        posts = await fetchSocialPosts(platform, account, accessToken);
    } catch {
        error =
            platform === "X" && !accessToken
                ? "An access token is required for X feeds."
                : "Unable to load recent posts.";
    }

    return (
        <Card
            id={id}
            style={style}
            className={className ? `${styles.feed} ${className}` : styles.feed}
            layout="flex"
            role="region"
            aria-label={`${platform} feed`}
        >
            <CardHeader className={styles.header}>
                <h2>
                    <InlineIcon
                        icon={
                            <span aria-hidden="true">
                                <Logo size={18} />
                            </span>
                        }
                    >
                        {platform === "X" ? "X/Twitter" : platform}
                    </InlineIcon>
                </h2>
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                    View feed ↗
                </a>
            </CardHeader>
            {error || posts?.length === 0 ? (
                <CardBody className={styles.postBody}>
                    <p className={styles.empty}>{error || "No recent posts available."}</p>
                </CardBody>
            ) : (
                posts?.map((post, index) => (
                    <article key={index} className={styles.post}>
                        <CardBody className={styles.postBody}>
                            <div className={styles.meta}>
                                <span>{post.author}</span>
                                <span aria-hidden="true">·</span>
                                <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
                            </div>
                            <p className={styles.text}>{post.text}</p>
                            <a className={styles.postLink} href={post.url} target="_blank" rel="noopener noreferrer">
                                View post ↗
                            </a>
                        </CardBody>
                    </article>
                ))
            )}
        </Card>
    );
};
