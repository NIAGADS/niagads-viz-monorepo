import assert from "node:assert/strict";
import test from "node:test";
import { parseEnvelope } from "../app/ask/contracts.ts";

test("token exhaustion accepts incomplete results and retains the native diagnostic", () => {
    // Empty planner failure exercises the wire contract, not biological evidence.
    const response = parseEnvelope({
        version: 4,
        status: "token_limit",
        results: [],
        presentation: [],
        warnings: [],
        issues: [
            {
                code: "usage_limit",
                operation: "assistant",
                message: "UsageLimitExceeded: Exceeded the input_tokens_limit",
                request_id: "protocol-request",
                provider_request_id: null,
            },
        ],
    });
    assert.equal(response.status, "token_limit");
    assert.match(response.issues[0].message, /UsageLimitExceeded/);
    assert.equal(response.issues[0].request_id, "protocol-request");
});
