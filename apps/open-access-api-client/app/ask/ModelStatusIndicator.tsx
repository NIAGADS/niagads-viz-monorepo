"use client";

import { LoadingSpinner } from "@niagads/ui";
import { useEffect, useState } from "react";
import type { ModelStatus } from "./model-status";

export default function ModelStatusIndicator({ status }: { status: ModelStatus | null }) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (status?.state !== "waiting") return;
        const timer = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(timer);
    }, [status]);
    if (!status || status.state === "failed") return null;
    const seconds = Math.max(
        0,
        Math.ceil((status.receivedAt + status.waitSeconds * 1000 - Math.max(now, status.receivedAt)) / 1000)
    );
    const waitingMessages = [
        `Our models are busy — trying again in ${seconds}s…`,
        `High demand right now — reconnecting in ${seconds}s…`,
        `Still working on it — next attempt in ${seconds}s…`,
    ];
    const message =
        status.state === "waiting"
            ? waitingMessages[Math.min(Math.max(status.attempt - 2, 0), waitingMessages.length - 1)]
            : status.state === "retrying"
              ? `Still working on it... (attempt ${status.attempt} of 5)…`
              : "Consulting the genome…";
    return <LoadingSpinner size="sm" message={message} />;
}
