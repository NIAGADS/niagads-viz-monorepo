import React, { FormEvent, useState } from "react";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";

import { Send } from "lucide-react";
import { createChatClientOptions } from "@tanstack/ai-client";

// Inline styles to avoid CSS module resolution issues
const styles = {
    container:
        "flex flex-col gap-4 w-full min-h-[28rem] p-4 border border-[#d6dee6] rounded-lg bg-[#f7fafb] text-[#17202a]",
    header: "flex items-center justify-between gap-4",
    title: "m-0 text-base font-bold",
    status: "text-[#64748b] text-xs",
    messages: "flex flex-1 flex-col gap-3 min-h-[18rem] overflow-y-auto",
    message: "max-w-[82%] p-3 border border-[#dbe3ea] rounded-lg bg-white leading-[1.45]",
    assistant: "self-start",
    user: "self-end border-[#b9d3e8] bg-[#e8f3fb]",
    messageLabel: "mb-1 text-[#4b5563] text-xs font-bold uppercase",
    messageText: "m-0 whitespace-pre-wrap",
    toolEvent:
        "inline-flex w-fit mt-2 px-2 py-1 border border-[#ccd8e2] rounded bg-[#edf4f7] text-[#455866] text-xs font-bold",
    thinkingText: "m-0 text-[#52616f] italic whitespace-pre-wrap",
    form: "flex gap-2",
    input: "flex-1 min-w-0 px-3 py-2.5 border border-[#b8c7d3] rounded font-inherit",
    button: "inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-[#355f7b] rounded bg-[#355f7b] text-white cursor-pointer font-inherit font-bold disabled:border-[#9aa8b2] disabled:bg-[#9aa8b2] disabled:cursor-not-allowed",
};

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
                <h2 className={styles.title}>{title}</h2>
                {/* Display loading state or model name in the header */}
                <span className={styles.status}>{isLoading ? "Thinking" : model}</span>
            </div>

            {/* Messages container with aria-live for accessibility announcements */}
            <div className={styles.messages} aria-live="polite">
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
