
import { BlueSkyIcon, SocialFeed, XTwitterIcon } from "@niagads/ui";
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
        <main>
            <div className="content-section content-section-centered">
                <header className="content-header">
                    <div>
                        <h1>News</h1>
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
                        <div className={styles["social-card"]}>
                            <h2 className={styles["social-title"]}>Follow NIAGADS</h2>

                            <p className={styles["social-description"]}>
                                Stay connected for the latest news, data releases, and announcements.
                            </p>

                            <div className={styles["social-links"]}>
                                <a
                                    href="https://bsky.app/profile/niagads.bsky.social"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles["social-link"]}
                                >
                                    <BlueSkyIcon size={18} />
                                    Bluesky ↗
                                </a>

                                <a
                                    href="https://x.com/NIAGADS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles["social-link"]}
                                >
                                    <XTwitterIcon size={17} />
                                    X / Twitter ↗
                                </a>
                            </div>

                            <div className={styles["social-feed-section"]}>
                                {/* <h3 className={styles["feed-title"]}>Latest from Bluesky</h3> */}

                                <Suspense fallback={<p role="status">Loading Bluesky feed…</p>}>
                                    <SocialFeed
                                        className={styles.feed}
                                        platform="Bluesky"
                                        handle="niagads.bsky.social"
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
