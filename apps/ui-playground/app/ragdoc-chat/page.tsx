"use client";

import { RAGDocChat } from "../../../../packages/AI/src";
import styles from "./ragdoc-chat-playground.module.css";

export default function RAGDocChatPlayground() {
    return (
        <main className={styles.page}>
            <section className={styles.panel}>
                <div className={styles.header}>
                    <h1 className={styles.title}>RAGDoc Chat Playground</h1>
                    <p className={styles.copy}>OpenAI-backed TanStack AI chat stream with mocked RAGDoc retrieval.</p>
                </div>

                <RAGDocChat
                    chatEndpoint="/api/ragdoc-chat"
                    model="gpt-5.2"
                    maxContextResults={3}
                    title="RAGDoc Assistant"
                />
            </section>
        </main>
    );
}
