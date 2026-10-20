"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import Results from "./Results";
import { errorMessage, fetchAsk } from "./errors";
import { textHistory, type AskEnvelope } from "./contracts";
import styles from "./ask.module.css";

type Message = UIMessage<unknown, { "niagads-result": AskEnvelope }>;

export default function Chat() {
    const [input, setInput] = useState("");
    const transport = useMemo(
        () =>
            new DefaultChatTransport<Message>({
                api: "/api/ask",
                fetch: fetchAsk,
                prepareSendMessagesRequest: ({ messages }) => ({ body: { messages: textHistory(messages) } }),
            }),
        []
    );
    const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat<Message>({ transport });
    const busy = status === "submitted" || status === "streaming";

    async function submit(event: FormEvent) {
        event.preventDefault();
        const text = input.trim();
        if (!text || busy) return;
        clearError();
        setInput("");
        await sendMessage({ text });
    }

    return (
        <main className={styles.app}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>NIAGADS Open Access · Prototype</p>
                    <h1>ASK NIAGADS</h1>
                </div>
                <Link href="/docs">API documentation</Link>
            </header>
            <p>
                Explore datasets, genes, and the evidence behind associations. Ask about an API endpoint or request a
                table or source summary.
            </p>
            <p className={styles.notice}>
                Conversation history lasts for this session only. Some retrieval capabilities are not yet available in
                this prototype.
            </p>
            {!messages.length && (
                <section aria-label="Example questions" className={styles.examples}>
                    {[
                        "Find datasets related to Alzheimer Disease",
                        "Show the available annotations for APOE",
                        "Which endpoint retrieves associations in a region?",
                    ].map((text) => (
                        <button key={text} type="button" onClick={() => setInput(text)}>
                            {text}
                        </button>
                    ))}
                </section>
            )}
            <div className={styles.conversation} aria-label="Conversation" aria-busy={busy}>
                {messages.map((message) => (
                    <article key={message.id} className={styles.message}>
                        <h2>{message.role === "user" ? "You" : "ASK NIAGADS"}</h2>
                        {message.parts.map((part, index) => {
                            if (part.type === "text")
                                return (
                                    <p className={styles.prose} key={index}>
                                        {part.text}
                                    </p>
                                );
                            if (part.type === "data-niagads-result") return <Results key={index} value={part.data} />;
                            if (part.type.startsWith("tool-") && "state" in part)
                                return (
                                    <p key={index} className={styles.progress}>
                                        {part.type.slice(5).replaceAll("_", " ")}:{" "}
                                        {String(part.state).replaceAll("-", " ")}
                                    </p>
                                );
                            return null;
                        })}
                    </article>
                ))}
            </div>
            <p role="status" aria-live="polite">
                {status === "submitted"
                    ? "Submitting question…"
                    : status === "streaming"
                      ? "Retrieving evidence and preparing a response…"
                      : ""}
            </p>
            {error && (
                <p role="alert" className={styles.error}>
                    {errorMessage(error)}
                </p>
            )}
            <form onSubmit={submit} className={styles.composer}>
                <label htmlFor="ask-question">Your question</label>
                <textarea
                    id="ask-question"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={3}
                    maxLength={8000}
                    placeholder="Ask a research question or explore the API…"
                />
                <div className={styles.actions}>
                    <button type="submit" disabled={busy || !input.trim()}>
                        Ask NIAGADS
                    </button>
                    {busy && (
                        <button type="button" onClick={() => void stop()}>
                            Stop response
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={async () => {
                            await stop();
                            setMessages([]);
                            clearError();
                            setInput("");
                        }}
                    >
                        New session
                    </button>
                </div>
            </form>
        </main>
    );
}
