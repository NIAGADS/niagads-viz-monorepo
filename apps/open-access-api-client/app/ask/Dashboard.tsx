"use client";

import { Alert } from "@niagads/ui";
import Link from "next/link";
import { useAskSession } from "./AskSessionProvider";
import Results from "./Results";
import styles from "./ask.module.css";

export default function Dashboard({ id }: { id: string }) {
    const { dashboardId, messages } = useAskSession();
    if (id !== dashboardId)
        return (
            <div className={styles.app}>
                <h1>Dashboard is no longer available</h1>
                <p>Temporary dashboards are kept in this tab until refresh, close, or a new session.</p>
                <Link href="/ask">Back to chat</Link>
            </div>
        );
    const responses = messages.flatMap((message) =>
        message.parts.flatMap((part, index) =>
            part.type === "data-niagads-result" ? [{ key: `${message.id}-${index}`, value: part.data }] : []
        )
    );
    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Conversation dashboard</h1>
                <Link href="/ask">Back to chat · Ask a follow-up</Link>
            </header>
            <p>
                Follow-up results are added here. Earlier results retain their original retrieval scope and pagination.
            </p>
            <Alert variant="info" message="Temporary dashboard">
                <p>
                    Available in this tab only. Refresh, close, or New session clears these results. Download data to
                    keep a copy.
                </p>
            </Alert>
            {!responses.length && <p>No retrieved results are available yet.</p>}
            {responses.map((response, index) => (
                <section key={response.key} aria-label={`Response ${index + 1}`}>
                    <h2>Response {index + 1}</h2>
                    <Results value={response.value} />
                </section>
            ))}
        </div>
    );
}
