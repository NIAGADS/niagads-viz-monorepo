"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ask.module.css";

export default function MarkdownSummary({ text, trackIds = [] }: { text: string; trackIds?: string[] }) {
    return (
        <div className={styles.prose}>
            <Markdown
                skipHtml
                remarkPlugins={[remarkGfm]}
                components={{
                    code: ({ children, className }) => {
                        const identifier = String(children);
                        return (
                            <>
                                <code className={className}>{children}</code>
                                {trackIds.includes(identifier) && (
                                    <span className={styles.trackApiLinks}>
                                        {" ("}
                                        <a
                                            href={`/api/record/track/${encodeURIComponent(identifier)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Metadata API
                                        </a>
                                        {" · "}
                                        <a
                                            href={`/api/record/track/${encodeURIComponent(identifier)}/data?format=json&content=full`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Data API
                                        </a>
                                        {")"}
                                    </span>
                                )}
                            </>
                        );
                    },
                    a: ({ href, children }) => (
                        <a href={href} rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    table: () => null,
                }}
            >
                {text}
            </Markdown>
        </div>
    );
}
