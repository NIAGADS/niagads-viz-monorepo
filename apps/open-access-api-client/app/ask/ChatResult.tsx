"use client";

import { Button } from "@niagads/ui";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { parseEnvelope } from "./contracts";
import RecordSummary, { isSingleRecord } from "./RecordSummary";
import ResultNotices from "./ResultNotices";
import RetrievedData from "./RetrievedData";
import ErrorAlert from "./ErrorAlert";
import styles from "./ask.module.css";

export default function ChatResult({ value, dashboardId }: { value: unknown; dashboardId: string | null }) {
    const router = useRouter();
    const parsed = useMemo(() => {
        try {
            return { envelope: parseEnvelope(value), error: null };
        } catch (error) {
            return { envelope: null, error: error instanceof Error ? error : new Error(String(error)) };
        }
    }, [value]);
    if (!parsed.envelope)
        return (
            <>
                <ErrorAlert
                    error={parsed.error!}
                    message="The structured result could not be displayed. Download the original payload below."
                />
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
                <div className={styles.dashboardAction}>
                    <Button color="primary" onClick={() => router.push(`/dashboard/${dashboardId}`)}>
                        Open dashboard
                    </Button>
                    <span>
                        {lists.reduce((count, result) => count + result.rows.length, 0)} loaded records in this
                        response.
                    </span>
                </div>
            )}
        </>
    );
}
