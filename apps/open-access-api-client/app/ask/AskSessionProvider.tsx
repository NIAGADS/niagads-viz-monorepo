"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { textHistory, type AskEnvelope } from "./contracts";
import { fetchAsk } from "./errors";
import type { QueryPlan } from "./planning";
import type { TrackDataBatch } from "./track-data";
import { modelStatusSchema, type ModelStatus } from "./model-status";

export type AskMessage = UIMessage<
    unknown,
    { "niagads-result": AskEnvelope; "niagads-plan": QueryPlan; "niagads-model-status": unknown }
>;
type TrackBatch = { id: string; batch: TrackDataBatch };

function useSession() {
    const [dashboardId, setDashboardId] = useState<string | null>(null);
    const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
    const [input, setInput] = useState("");
    const [trackBatches, setTrackBatches] = useState<Record<string, TrackBatch[]>>({});
    const transport = useMemo(
        () =>
            new DefaultChatTransport<AskMessage>({
                api: "/api/ask",
                fetch: fetchAsk,
                prepareSendMessagesRequest: ({ messages }) => ({ body: { messages: textHistory(messages) } }),
            }),
        []
    );
    const chat = useChat<AskMessage>({
        transport,
        onData: (part) => {
            if (part.type === "data-niagads-model-status") {
                setModelStatus(
                    part.data === null ? null : { ...modelStatusSchema.parse(part.data), receivedAt: Date.now() }
                );
            }
        },
        onFinish: () => setModelStatus((previous) => (previous?.state === "failed" ? previous : null)),
        onError: () => setModelStatus((previous) => (previous?.state === "failed" ? previous : null)),
    });
    const addTrackBatch = useCallback((resultId: string, batch: TrackDataBatch) => {
        const item = { id: crypto.randomUUID(), batch };
        setTrackBatches((previous) => ({ ...previous, [resultId]: [...(previous[resultId] ?? []), item] }));
    }, []);

    async function ask(text: string) {
        chat.clearError();
        setModelStatus({ state: "requesting", attempt: 1, waitSeconds: 0, receivedAt: Date.now() });
        setDashboardId((previous) => previous ?? crypto.randomUUID());
        setInput("");
        await chat.sendMessage({ text });
    }

    async function stop() {
        setModelStatus(null);
        await chat.stop();
    }

    async function retry() {
        const previous = chat.messages
            .findLast((message) => message.role === "user")
            ?.parts.flatMap((part) => (part.type === "text" ? [part.text] : []))
            .join("\n\n");
        if (previous) await ask(previous);
    }

    async function newSession() {
        await stop();
        chat.setMessages([]);
        chat.clearError();
        setInput("");
        setDashboardId(null);
        setTrackBatches({});
    }

    return {
        ...chat,
        stop,
        retry,
        modelStatus,
        dashboardId,
        input,
        setInput,
        ask,
        newSession,
        trackBatches,
        addTrackBatch,
    };
}

const AskSessionContext = createContext<ReturnType<typeof useSession> | null>(null);

/** In-memory only: shared layout navigation preserves chat and dashboard data. */
export default function AskSessionProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    return <AskSessionContext.Provider value={session}>{children}</AskSessionContext.Provider>;
}

export function useAskSession() {
    const session = useContext(AskSessionContext);
    if (!session) throw new Error("ASK session provider is missing");
    return session;
}
