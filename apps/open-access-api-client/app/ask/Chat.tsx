"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ActionButton, Alert, Badge, Button, Card, CardBody, CardGrid, LoadingSpinner } from "@niagads/ui";
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
        <div className={styles.app}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>NIAGADS Open Access API</p>
                    <h1>ASK NIAGADS</h1>
                </div>
                <Badge variant="pill" className={styles.prototype}>
                    Prototype
                </Badge>
            </header>
            <p>
                <strong>Explore Alzheimer&apos;s disease genomics through natural-language questions.</strong>
            </p>
            <p>
                ASK NIAGADS provides a conversational interface to NIAGADS Open Access, helping researchers discover
                datasets, explore genes and genomic associations, and retrieve supporting evidence. Responses can
                include summaries, structured data, and visualizations.
            </p>
            <Alert variant="info" message="Prototype — Limited Availability">
                <p>
                    ASK NIAGADS is under active development. This prototype supports a select range of NIAGADS Open
                    Access resources and query capabilities. Additional data access and functionality will roll out
                    throughout November 2026. Check back for updates.
                </p>
            </Alert>
            {!messages.length && (
                <section aria-label="Example questions" className={styles.examples}>
                    <h2>Start with a question</h2>
                    <CardGrid>
                        {[
                            "Find datasets related to Alzheimer Disease",
                            "Show the available annotations for APOE",
                            "Which endpoint retrieves associations in a region?",
                        ].map((text) => (
                            <Card key={text} span={4} onClick={() => setInput(text)} className={styles.example}>
                                <CardBody>{text}</CardBody>
                            </Card>
                        ))}
                    </CardGrid>
                </section>
            )}
            <section aria-label="Conversation" aria-busy={busy}>
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
            </section>
            <div role="status" aria-live="polite">
                {busy && (
                    <LoadingSpinner
                        size="sm"
                        message={
                            status === "submitted"
                                ? "Submitting question…"
                                : "Retrieving evidence and preparing a response…"
                        }
                    />
                )}
            </div>
            {error && <Alert variant="error" message={errorMessage(error)} />}
            <form onSubmit={submit} className={styles.composer}>
                <label htmlFor="ask-question">Your question</label>
                <textarea
                    id="ask-question"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={3}
                    maxLength={8000}
                    aria-describedby="session-notice"
                    placeholder="Ask a research question or explore the API…"
                />
                <div className={styles.actions}>
                    <Button color="primary" disabled={busy || !input.trim()}>
                        Ask NIAGADS
                    </Button>
                    {busy && <ActionButton onClick={() => void stop()}>Stop response</ActionButton>}
                    <ActionButton
                        onClick={async () => {
                            await stop();
                            setMessages([]);
                            clearError();
                            setInput("");
                        }}
                    >
                        New session
                    </ActionButton>
                </div>
            </form>
            <p id="session-notice" className={styles.sessionNotice}>
                Conversation history is retained for the current session only.
            </p>
        </div>
    );
}
