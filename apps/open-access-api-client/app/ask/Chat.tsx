"use client";

import { ActionButton, Alert, Badge, Button, Card, CardBody, CardHeader, CardGrid } from "@niagads/ui";
import type { FormEvent } from "react";
import Feedback from "./Feedback";
import { errorDetails, errorMessage } from "./errors";
import { useAskSession } from "./AskSessionProvider";
import ChatResult from "./ChatResult";
import MarkdownSummary from "./MarkdownSummary";
import ModelStatusIndicator from "./ModelStatusIndicator";
import { MODEL_BUSY_MESSAGE } from "./model-status";
import styles from "./ask.module.css";

export default function Chat() {
    const { messages, status, error, stop, input, setInput, ask, newSession, dashboardId, modelStatus, retry } =
        useAskSession();
    const busy = status === "submitted" || status === "streaming";
    const diagnostics = error ? errorDetails(error) : null;

    const diagnosticDetails = error && (
        <details>
            <summary>Error details to include in your report</summary>
            <pre className={styles.errorDetails}>{diagnostics?.response}</pre>
            {diagnostics?.stackTrace && (
                <details>
                    <summary>Stack trace</summary>
                    <pre className={styles.errorDetails}>{diagnostics.stackTrace}</pre>
                </details>
            )}
        </details>
    );

    async function submit(event: FormEvent) {
        event.preventDefault();
        const text = input.trim();
        if (!text || busy) return;
        await ask(text);
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
                <p>ASK NIAGADS is under active development and is still brittle.</p>
                <p>
                    This prototype supports a select range of NIAGADS Open Access resources and query capabilities on a
                    reduced data snapshot. Additional data access and functionality will roll out throughout November
                    2026. Check back for updates.
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
                            "Show Alzheimer's disease associations for rs429358 with a +/-10kb flank",
                            "Fetch all ADSP variants in and near TREM2",
                            "Plot all variant associations reported for the BIN1 locus.  Group by population and disease or neruopathology.",
                        ].map((text) => (
                            <Card key={text} span={4} onClick={() => setInput(text)} className={styles.example}>
                                <CardBody>{text}</CardBody>
                            </Card>
                        ))}
                    </CardGrid>
                </section>
            )}
            <section aria-label="Conversation" aria-busy={busy}>
                {messages.map((message, messageIndex) => (
                    <article key={message.id} className={styles.message}>
                        <Card>
                            <CardHeader>
                                <h2>{message.role === "user" ? "You" : "ASK NIAGADS"}</h2>
                            </CardHeader>
                            <CardBody>
                                {message.parts.map((part, index) =>
                                    part.type === "data-niagads-result" ? (
                                        <ChatResult key={index} value={part.data} dashboardId={dashboardId} />
                                    ) : null
                                )}
                                {message.role === "user" ? (
                                    <p className={styles.prose}>
                                        {message.parts
                                            .filter((part) => part.type === "text")
                                            .map((part) => part.text)
                                            .join("\n\n")}
                                    </p>
                                ) : (
                                    <MarkdownSummary
                                        trackIds={message.parts.flatMap((part) =>
                                            part.type === "data-niagads-result"
                                                ? part.data.results
                                                      .filter((result) => result.entity === "track")
                                                      .flatMap((result) =>
                                                          result.rows.flatMap((row) =>
                                                              typeof row.id === "string" ? [row.id] : []
                                                          )
                                                      )
                                                : []
                                        )}
                                        text={message.parts
                                            .filter((part) => part.type === "text")
                                            .map((part) => part.text)
                                            .join("\n\n")}
                                    />
                                )}
                                {message.parts.map((part, index) => {
                                    if (part.type !== "data-niagads-result") return null;
                                    return (
                                        <div key={index}>
                                            {message.role === "assistant" &&
                                                part.data.feedback_reference &&
                                                (messageIndex < messages.length - 1 || !busy) && (
                                                    <Feedback reference={part.data.feedback_reference} />
                                                )}
                                        </div>
                                    );
                                })}
                                {message.parts.some((part) => part.type.startsWith("tool-")) && (
                                    <details>
                                        <summary>Retrieval details</summary>
                                        {message.parts.map((part, index) =>
                                            part.type.startsWith("tool-") && "state" in part ? (
                                                <p key={index} className={styles.progress}>
                                                    {part.type.slice(5).replaceAll("_", " ")}:{" "}
                                                    {String(part.state).replaceAll("-", " ")}
                                                </p>
                                            ) : null
                                        )}
                                    </details>
                                )}
                            </CardBody>
                        </Card>
                    </article>
                ))}
            </section>
            <div role="status" aria-live="polite">
                {busy && <ModelStatusIndicator status={modelStatus} />}
            </div>
            {error && modelStatus?.state === "failed" && (
                <Alert variant="info" message={MODEL_BUSY_MESSAGE}>
                    <ActionButton disabled={busy} onClick={() => void retry()}>
                        Retry
                    </ActionButton>
                </Alert>
            )}
            {error && modelStatus?.state !== "failed" && (
                <Alert variant="error" message={errorMessage(error)}>
                    <p>
                        Please contact <a href="mailto:help@niagads.org">help@niagads.org</a> or{" "}
                        <a
                            href="https://github.com/NIAGADS/niagads-api/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            report an issue on GitHub
                        </a>
                        . Include the error details below and the request reference, if shown, so we can investigate.
                    </p>
                    {diagnosticDetails}
                </Alert>
            )}
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
                        onClick={() => {
                            void newSession();
                        }}
                    >
                        New session
                    </ActionButton>
                </div>
            </form>
            <p id="session-notice" className={styles.sessionNotice}>
                Conversation and dashboard data are kept in this tab only. Refresh, close, or New session clears them.
            </p>
        </div>
    );
}
