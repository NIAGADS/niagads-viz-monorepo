"use client";

import { Alert } from "@niagads/ui";
import Link from "next/link";
import { useMemo } from "react";
import { parseEnvelope } from "./contracts";
import RecordSummary, { isSingleRecord } from "./RecordSummary";
import ResultNotices from "./ResultNotices";
import RetrievedData from "./RetrievedData";

export default function ChatResult({ value, dashboardId }: { value: unknown; dashboardId: string | null }) {
    const parsed = useMemo(() => {
        try {
            return { envelope: parseEnvelope(value), error: null };
        } catch (error) {
            return { envelope: null, error: error instanceof Error ? error.message : String(error) };
        }
    }, [value]);
    if (!parsed.envelope)
        return (
            <>
                <Alert
                    variant="error"
                    message="The structured result could not be displayed. Download the original payload below."
                />
                <details>
                    <summary>Response validation details</summary>
                    <pre>{parsed.error}</pre>
                </details>
                <RetrievedData value={value} filename="ask-unrendered-result.json" />
            </>
        );
    const envelope = parsed.envelope;
    const records = envelope.results.filter(isSingleRecord);
    const lists = envelope.results.filter((result) => !isSingleRecord(result));
    return (
        <>
            <ResultNotices envelope={envelope} />
            {records.map((result) => (
                <RecordSummary key={result.id} result={result} />
            ))}
            {lists.length > 0 && dashboardId && (
                <p>
                    <Link href={`/dashboard/${dashboardId}`}>Open dashboard</Link> ·{" "}
                    {lists.reduce((count, result) => count + result.rows.length, 0)} loaded records in this response.
                    Page limits apply.
                </p>
            )}
            {envelope.results.length > 0 && (
                <RetrievedData value={value} filename={`ask-response-${envelope.results[0].id}.json`} />
            )}
        </>
    );
}
