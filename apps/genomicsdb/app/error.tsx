"use client";
import "./error-page.css";
import { APIError } from "@/lib/errors";
import { formatMultiline, linkify, safeHtml } from "@niagads/common";
import { Alert } from "@niagads/ui";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: APIError & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    const errorResponse = error.message;

    return (
        <div className="error-page">
            <Alert variant="danger" message={`${errorResponse.status} - ${errorResponse.detail}`}>
                <div>{errorResponse.message && <div>{safeHtml(linkify(errorResponse.message))}</div>}</div>
            </Alert>
            <div>
                {errorResponse.stack_trace && (
                    <div className="mb-15">
                        <h3 className="error-page-section-header">Stack Trace</h3>
                        <div className="error-page-code-block">{formatMultiline(errorResponse.stack_trace)}</div>
                    </div>
                )}
                {errorResponse.request && (
                    <p>
                        <strong>Originating Request</strong>: {errorResponse.request}
                    </p>
                )}
            </div>
        </div>
    );
}
