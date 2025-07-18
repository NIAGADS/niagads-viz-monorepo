"use client";

import "./error-page.css";

import { _isJSON, formatMultiline, linkify, safeHtml } from "@niagads/common";

import { APIError } from "@/lib/errors";
import { Alert } from "@niagads/ui";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: APIError & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    const issueTrackerMsg = `An unexpected error occurred. Please submit a GitHub (bug) issue containing this full error response at: ${process.env.NEXT_PUBLIC_ISSUE_TRACKER}`;

    const errorJSON = _isJSON(error.message) ? JSON.parse(error.message) : null;

    return errorJSON ? (
        <div className="error-page">
            <Alert variant="danger" message={`${errorJSON.status} - ${errorJSON.detail}`}>
                <div>{errorJSON.message && <div>{safeHtml(linkify(errorJSON.message))}</div>}</div>
            </Alert>
            <div>
                {errorJSON.stack_trace && (
                    <div className="mb-15">
                        <h3 className="error-page-section-header">Stack Trace</h3>
                        <div className="error-page-code-block">{formatMultiline(errorJSON.stack_trace)}</div>
                    </div>
                )}
                {errorJSON.request && (
                    <p>
                        <strong>Originating Request</strong>: {errorJSON.request}
                    </p>
                )}
            </div>
        </div>
    ) : (
        <div className="error-page">
            <Alert variant="danger" message={`Runtime Error - ${error.message}`}>
                <div className="mb-15">{safeHtml(linkify(issueTrackerMsg))}</div>
            </Alert>
            <div>
                <h3 className="error-page-section-header">Stack Trace</h3>
                <div className="error-page-code-block">{formatMultiline(error.stack!)}</div>
            </div>
        </div>
    );
}
