import { SocialFeed, XTwitterIcon } from "@niagads/ui";

import type { Metadata } from "next";
import { NewsArchive } from "@/components/News/NewsArchive";
import { Suspense } from "react";
import styles from "./news-page.module.css";

export const metadata: Metadata = {
    title: "News | NIAGADS",
    description: "Data releases, announcements, and events from the NIAGADS community.",
};

export default function NewsPage() {
    return (
        <div className="content-section content-section-centered">
            <header className="content-header">
                <div>
                    <h1 className="content-title">News</h1>
                    <p className="content-subtitle">
                        Data releases, announcements, and events from the NIAGADS community.
                    </p>
                </div>
            </header>

            <div className={styles.highlights}>
                <div className={styles.archive}>
                    <NewsArchive groups={process.env.NEWS_GROUPS || ""} />
                </div>
                <aside className={styles.social} aria-label="NIAGADS social updates">
                    <Suspense fallback={<p role="status">Loading Bluesky feed…</p>}>
                        <SocialFeed className={styles.feed} platform="Bluesky" handle="niagads.bsky.social" />
                    </Suspense>
                    <a
                        className={styles.twitterLink}
                        href="https://x.com/NIAGADS"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span aria-hidden="true">
                            <XTwitterIcon size={16} />
                        </span>
                        NIAGADS on X/Twitter ↗
                    </a>
                </aside>
            </div>
        </div>
    );
}
