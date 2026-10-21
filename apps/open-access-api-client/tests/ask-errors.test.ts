import assert from "node:assert/strict";
import test from "node:test";
import { errorDetails, errorMessage, httpIssue } from "../app/ask/errors.ts";

test("HTTP failures give appropriate actions without exposing server settings", () => {
    assert.match(httpIssue(401).message, /Sign in/);
    assert.match(httpIssue(403).message, /access/);
    assert.match(httpIssue(429).message, /Wait/);
    assert.match(httpIssue(413).message, /shorter/);
    assert.doesNotMatch(httpIssue(501).message, /embedding|retry|shorter/i);
    assert.doesNotMatch(httpIssue(503).message, /API_INTERNAL_URL|configuration|shorter/);
});

test("safe stream errors retain request references", () => {
    const issue = httpIssue(504, "request-123");
    assert.match(errorMessage(new Error(JSON.stringify(issue))), /request-123/);
    assert.match(errorMessage(new Error(JSON.stringify(issue))), /time/);
});

test("stream diagnostics stay in details instead of the alert heading", () => {
    const message = "API retrieval failed: database unavailable. Reference: request-123.";
    assert.equal(errorMessage(new Error(message)), "An unexpected error occurred while processing your request.");
    assert.equal(errorDetails(new Error(message)).response, message);
});

test("FastAPI runtime errors retain detail, reporting instructions and request reference", () => {
    const payload = {
        detail: "ASK configuration failed: ASK_MODEL is missing",
        message: "Please submit a bug report at https://github.com/NIAGADS/niagads-api/issues.",
        request_id: "request-123",
    };
    assert.equal(
        errorMessage(new Error(JSON.stringify(payload))),
        `${payload.message} Request reference: request-123.`
    );
    assert.match(errorDetails(new Error(JSON.stringify(payload))).response, /ASK_MODEL is missing/);
});

test("FastAPI service errors retain administrator contact instructions", () => {
    const payload = {
        detail: "Database connection unavailable",
        message: "Please email this error response to help@niagads.org with the subject NIAGADS API Systems Error.",
        stack_trace: ["database connection trace"],
        request_id: "request-db",
    };
    const message = errorMessage(new Error(JSON.stringify(payload)));

    assert.doesNotMatch(message, /Database connection unavailable/);
    assert.match(errorDetails(new Error(JSON.stringify(payload))).response, /Database connection unavailable/);
    assert.match(message, /help@niagads.org/);
    assert.match(message, /NIAGADS API Systems Error/);
    assert.match(message, /Request reference: request-db/);
});

test("SDK validation diagnostics cannot become a wall of text in the alert heading", () => {
    const message =
        'Type validation failed: Value: {"type":"data-niagads-result","id":null}. ' +
        'Error message: [{"code":"invalid_union","message":"Invalid input"}]';
    const error = new Error(message);

    assert.equal(errorMessage(error), "An unexpected error occurred while processing your request.");
    assert.equal(errorDetails(error).response, message);
});

test("error details separate readable stack frames from formatted response metadata", () => {
    const payload = {
        detail: "Database connection unavailable",
        request_id: "request-db",
        stack_trace: ["frame one", "frame two"],
    };
    const details = errorDetails(new Error(JSON.stringify(payload)));

    assert.equal(details.stackTrace, "frame one\nframe two");
    assert.equal(
        details.response,
        JSON.stringify({ detail: payload.detail, request_id: payload.request_id }, null, 2)
    );
});

test("errors without a backend trace retain their details without inventing a trace", () => {
    const message = "ASK NIAGADS could not be reached.";
    assert.deepEqual(errorDetails(new Error(message)), { response: message, stackTrace: null });

    const payload = httpIssue(502, "proxy-request");
    assert.deepEqual(errorDetails(new Error(JSON.stringify(payload))), {
        response: JSON.stringify(payload, null, 2),
        stackTrace: null,
    });
});
