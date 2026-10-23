"use client";

import { ActionButton, Button } from "@niagads/ui";
import { useId, useRef, useState, type FormEvent } from "react";
import ErrorAlert from "./ErrorAlert";
import { fetchAsk } from "./errors";
import styles from "./ask.module.css";

export default function Feedback({ reference }: { reference: string }) {
    const commentId = useId();
    const submitting = useRef(false);
    const [rating, setRating] = useState<0 | 1 | null>(null);
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [failure, setFailure] = useState<Error | null>(null);

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (rating === null || submitting.current || status === "sent") return;
        submitting.current = true;
        setStatus("sending");
        setFailure(null);
        try {
            await fetchAsk("/api/ask/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference, rating, comment: comment.trim() || null }),
            });
            setStatus("sent");
        } catch (error) {
            setFailure(error instanceof Error ? error : new Error(String(error)));
            setStatus("error");
        } finally {
            submitting.current = false;
        }
    }

    return (
        <section className={styles.feedback} aria-label="Answer feedback">
            {status !== "sent" && (
                <>
                    <p>Was this answer helpful?</p>
                    <div className={styles.actions}>
                        <ActionButton
                            aria-label="Helpful"
                            aria-pressed={rating === 1}
                            disabled={status === "sending"}
                            onClick={() => setRating(1)}
                        >
                            <span aria-hidden="true">👍</span>
                        </ActionButton>
                        <ActionButton
                            aria-label="Not helpful"
                            aria-pressed={rating === 0}
                            disabled={status === "sending"}
                            onClick={() => setRating(0)}
                        >
                            <span aria-hidden="true">👎</span>
                        </ActionButton>
                    </div>
                    {rating !== null && (
                        <form onSubmit={submit} className={styles.feedbackForm}>
                            <label htmlFor={commentId}>Comment (optional)</label>
                            <textarea
                                id={commentId}
                                rows={3}
                                maxLength={2000}
                                value={comment}
                                disabled={status === "sending"}
                                onChange={(event) => setComment(event.target.value)}
                            />
                            <div>
                                <Button color="primary" disabled={status === "sending"}>
                                    {status === "sending" ? "Submitting…" : "Submit feedback"}
                                </Button>
                            </div>
                        </form>
                    )}
                </>
            )}
            <p role="status" aria-live="polite">
                {status === "sent" && "Thank you for your feedback."}
            </p>
            {failure && <ErrorAlert error={failure} />}
        </section>
    );
}
