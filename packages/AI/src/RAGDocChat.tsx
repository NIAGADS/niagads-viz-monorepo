import React, { FormEvent, useState } from "react";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";

import { Send } from "lucide-react";
import { createChatClientOptions } from "@tanstack/ai-client";
import styles from "./styles/ragdoc-chat.module.css";

const examplePrompts = [
    "How does RAGDoc ingest documentation?",
    "What happens during retrieval?",
    "How should I deploy the service?",
];

/**
 * Properties for the RAGDocChat component.
 *
 * The component integrates with a backend chat service that handles:
 * - Model selection and inference
 * - Tool execution (RAG document retrieval)
 * - Server-sent event streaming of responses
 */
export interface RAGDocChatProps {
    /** URL endpoint compatible with TanStack AI server-sent events protocol. Must stream model output and tool execution events. */
    chatEndpoint: string;
    /** Model identifier (e.g., "gpt-4", "claude-3") - backend maps this to the appropriate provider configuration. */
    model: string;
    /** Display title for the chat interface. Defaults to "RAG Document Assistant". */
    title?: string;
    /** Placeholder text for the input field. */
    placeholder?: string;
    /** Maximum number of document chunks to retrieve per query. Sent to backend to control context window size. */
    maxContextResults?: number;
    /** Additional CSS class names to apply to the root container. */
    className?: string;
}

/**
 * Safely extracts text content from message parts.
 *
 * Message parts from TanStack AI may have different structures depending on the provider.
 * This helper normalizes access to the actual text content.
 *
 * @param part - The message part object with optional content or text properties
 * @returns The text string, or empty string if no text found
 */
const getTextPartContent = (part: { content?: unknown; text?: unknown }) => {
    if (typeof part.content === "string") {
        return part.content;
    }

    if (typeof part.text === "string") {
        return part.text;
    }

    return "";
};

/**
 * RAGDocChat - A React component for AI-powered document question-answering
 *
 * This component demonstrates TanStack AI integration with:
 * - **useChat hook**: Manages message state, streaming responses, and loading state
 * - **Server-Sent Events**: Real-time streaming of model output and tool execution
 * - **Tool visibility**: Shows when the model retrieves document context
 * - **Thinking output**: Displays model reasoning (if the model supports it)
 *
 * The component handles the full chat lifecycle:
 * 1. User submits a question
 * 2. Backend receives the query and initiates model inference
 * 3. Model may execute the retrieve_ragdoc_context tool to get relevant documents
 * 4. Response is streamed back with separate message parts for text, tools, and thinking
 * 5. UI updates reactively as each part arrives
 */
export const RAGDocChat = ({
    chatEndpoint,
    model,
    title = "RAG Document Assistant",
    placeholder = "Ask a question about the indexed documents",
    maxContextResults = 5,
    className,
}: RAGDocChatProps) => {
    const [input, setInput] = useState("");

    // TanStack AI useChat hook manages:
    // - messages[]: array of all messages with their parts (text, tools, thinking)
    // - sendMessage(): sends a user message and handles the streaming response
    // - isLoading: boolean indicating if a response is currently streaming
    const { messages, sendMessage, isLoading } = useChat(
        createChatClientOptions({
            // fetchServerSentEvents: connects to the backend via SSE for streaming
            connection: fetchServerSentEvents(chatEndpoint),
            // body: data sent with every chat request (model choice and retrieval limits)
            body: {
                model,
                maxContextResults,
            },
        })
    );

    /**
     * Handles form submission when user sends a message.
     *
     * Validation:
     * - Message must be non-empty after trimming
     * - Cannot send while a response is already streaming (isLoading=true)
     *
     * The sendMessage() call triggers the full request-response cycle and TanStack AI
     * handles streaming the response back in real-time.
     */
    const submitMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = input.trim();
        if (!message || isLoading) {
            return;
        }

        // sendMessage appends the user message, sends the request, and initiates streaming
        sendMessage(message);
        setInput("");
    };

    return (
        <section className={`${styles.container} ${className ?? ""}`} aria-label={title}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Document Q&amp;A</p>
                    <h2 className={styles.title}>{title}</h2>
                </div>
                {/* Display loading state or model name in the header */}
                <span className={styles.status} data-loading={isLoading}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    {isLoading ? "Thinking" : model}
                </span>
            </div>

            {/* Messages container with aria-live for accessibility announcements */}
            <div className={styles.messages} aria-live="polite">
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>Start with a RAGDoc question.</p>
                        <p className={styles.emptyCopy}>
                            Ask about ingestion, retrieval, API behavior, or deployment and the assistant will use the
                            mocked document context when relevant.
                        </p>
                        <div className={styles.promptList}>
                            {examplePrompts.map((prompt) => (
                                <button
                                    className={styles.prompt}
                                    key={prompt}
                                    type="button"
                                    onClick={() => setInput(prompt)}
                                    disabled={isLoading}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
                {messages.map((message) => (
                    <article
                        key={message.id}
                        className={`${styles.message} ${message.role === "assistant" ? styles.assistant : styles.user}`}
                    >
                        <div className={styles.messageLabel}>{message.role === "assistant" ? "Assistant" : "You"}</div>

                        {/* Process each part of the message based on its type */}
                        {message.parts.map((part, index) => {
                            // Text parts: Streamed model output or final responses
                            if (part.type === "text") {
                                return (
                                    <p key={index} className={styles.messageText}>
                                        {getTextPartContent(part)}
                                    </p>
                                );
                            }

                            // Tool parts: Indicates when the model calls a tool (e.g., "tool-call: retrieve_ragdoc_context")
                            // Makes the retrieval process visible to the user and validates the integration is working
                            if (part.type.startsWith("tool-")) {
                                return (
                                    <div key={index} className={styles.toolEvent}>
                                        {part.type.replace("tool-", "tool: ")}
                                    </div>
                                );
                            }

                            // Thinking parts: Optional reasoning/intermediate steps from models that support it
                            // (e.g., Claude's extended thinking, OpenAI's o1 reasoning)
                            if (part.type === "thinking") {
                                return (
                                    <p key={index} className={styles.thinkingText}>
                                        {getTextPartContent(part)}
                                    </p>
                                );
                            }

                            // Unknown part types are ignored (future extensibility)
                            return null;
                        })}
                    </article>
                ))}
            </div>

            {/* Chat input form */}
            <form className={styles.form} onSubmit={submitMessage}>
                <input
                    className={styles.input}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                />
                <button className={styles.button} type="submit" disabled={!input.trim() || isLoading}>
                    <Send size={16} aria-hidden="true" />
                    Send
                </button>
            </form>
        </section>
    );
};
