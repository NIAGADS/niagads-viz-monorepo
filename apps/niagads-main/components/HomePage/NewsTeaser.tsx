import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./home-page.module.css";

export const NewsTeaser = () => (
    <article className={styles["home-page-news-teaser"]}>
        <div className={styles["home-page-news-label"]}>Latest news</div>
        <h2>Important Update: NIAGADS DSS Login Changes</h2>
        <time dateTime="2025-06-17">June 17, 2025</time>
        <p>
            NIAGADS is introducing an updated login experience to support stronger identity proofing requirements for
            controlled-access data repositories... <Link href="/news">Read more</Link>
        </p>

        <div className={styles["home-page-news-footer"]}>
            <Link href="/news" className={styles["home-page-news-all-link"]}>
                View All News
                <ArrowRight size={16} aria-hidden="true" />
            </Link>
        </div>
    </article>
);
