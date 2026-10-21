"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ask.module.css";

export default function MarkdownSummary({ text }: { text: string }) {
    return (
        <div className={styles.prose}>
            <Markdown
                skipHtml
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children }) => (
                        <a href={href} rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    table: () => <p>Tabular results belong on the dashboard.</p>,
                }}
            >
                {text}
            </Markdown>
        </div>
    );
}
