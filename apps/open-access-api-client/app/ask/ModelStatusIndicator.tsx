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
    const message =
        status.state === "waiting"
            ? `The free models are busy — brewing another attempt in ${seconds}s…`
            : status.state === "retrying"
              ? `Percolating again (attempt ${status.attempt} of 5)…`
              : "Percolating…";
    return <LoadingSpinner size="sm" message={message} />;
}
