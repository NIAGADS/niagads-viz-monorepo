import { Alert } from "@niagads/ui";
import type { AskEnvelope } from "./contracts";
import styles from "./ask.module.css";

export default function ResultNotices({ envelope }: { envelope: AskEnvelope }) {
    return (
        <>
            {envelope.status !== "ok" &&
                envelope.status !== "token_limit" &&
                !envelope.issues.length &&
                !envelope.warnings.length && (
                    <Alert
                        variant={envelope.status === "empty" || envelope.status === "clarification" ? "info" : "error"}
                        message={
                            envelope.status === "empty"
                                ? "No matching records were returned."
                                : envelope.status === "clarification"
                                  ? "More information is needed to complete this request."
                                  : "Part of this request could not be completed."
                        }
                    />
                )}
            {Array.from(new Map(envelope.issues.map((issue) => [JSON.stringify(issue), issue])).values())
                .filter((issue) => issue.code !== "usage_limit")
                .map((issue, i) => (
                    <Alert
                        key={`issue-${i}`}
                        variant="error"
                        message={`${issue.message}${issue.request_id ? ` Reference: ${issue.request_id}.` : ""}`}
                    />
                ))}
            {[...new Set(envelope.warnings)]
                .filter((warning) => !envelope.issues.some((issue) => issue.message === warning))
                .map((warning, i) => (
                    <p key={i} className={styles.notice}>
                        {warning}
                    </p>
                ))}
        </>
    );
}
