import assert from "node:assert/strict";
import test from "node:test";
import { errorMessage, httpIssue } from "../app/ask/errors.ts";

test("HTTP failures give appropriate actions without exposing server settings", () => {
    assert.match(httpIssue(401).message, /Sign in/);
    assert.match(httpIssue(403).message, /access/);
    assert.match(httpIssue(429).message, /Wait/);
    assert.match(httpIssue(413).message, /shorter/);
    assert.doesNotMatch(httpIssue(501).message, /embedding|retry|shorter/i);
    assert.doesNotMatch(httpIssue(503).message, /ASK_API_URL|configuration|shorter/);
});

test("safe stream errors retain request references", () => {
    const issue = httpIssue(504, "request-123");
    assert.match(errorMessage(new Error(JSON.stringify(issue))), /request-123/);
    assert.match(errorMessage(new Error(JSON.stringify(issue))), /time/);
});

test("stream errors retain their original diagnostic message", () => {
    const message = "API retrieval failed: database unavailable. Reference: request-123.";
    assert.equal(errorMessage(new Error(message)), message);
});

test("FastAPI runtime errors retain detail and request reference", () => {
    const payload = {
        detail: "ASK configuration failed: ASK_MODEL is missing",
        message: "Please report this error.",
        request_id: "request-123",
    };
    assert.equal(
        errorMessage(new Error(JSON.stringify(payload))),
        "ASK configuration failed: ASK_MODEL is missing Reference: request-123."
    );
});
