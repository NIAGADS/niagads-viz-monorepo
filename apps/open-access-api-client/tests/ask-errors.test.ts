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

test("raw SDK or malformed upstream errors are never displayed", () => {
    const message = errorMessage(new Error("secret-response-body"));
    assert.doesNotMatch(message, /secret/);
    assert.match(message, /response/);
});
