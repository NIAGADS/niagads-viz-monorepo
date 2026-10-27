import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/ask/feedback/route.ts";
import { feedbackSchema } from "../app/ask/contracts.ts";

const reference = `00-${"1".repeat(32)}-${"2".repeat(16)}-01.${"a".repeat(64)}`;

test("feedback accepts either rating and an optional bounded comment", () => {
    assert.ok(feedbackSchema.safeParse({ reference, rating: 1 }).success);
    assert.ok(feedbackSchema.safeParse({ reference, rating: 0, comment: "More evidence, please" }).success);
    assert.equal(feedbackSchema.safeParse({ reference, rating: 2 }).success, false);
    assert.equal(feedbackSchema.safeParse({ reference, rating: 0, comment: "x".repeat(2001) }).success, false);
    assert.equal(feedbackSchema.safeParse({ reference: "forged", rating: 1 }).success, false);
});

test("feedback proxy forwards only feedback and preserves acceptance", async (t) => {
    const originalBase = process.env.API_INTERNAL_URL;
    process.env.API_INTERNAL_URL = "https://api.example.test";
    let submitted: unknown;
    t.mock.method(globalThis, "fetch", async (url: URL, init: RequestInit) => {
        assert.equal(url.pathname, "/ask/feedback");
        submitted = JSON.parse(String(init.body));
        return new Response(null, { status: 204 });
    });
    try {
        const response = await POST(
            new Request("https://client.example.test/api/ask/feedback", {
                method: "POST",
                body: JSON.stringify({ reference, rating: 1, comment: null }),
            })
        );
        assert.equal(response.status, 204);
        assert.deepEqual(submitted, { reference, rating: 1, comment: null });
    } finally {
        if (originalBase === undefined) delete process.env.API_INTERNAL_URL;
        else process.env.API_INTERNAL_URL = originalBase;
    }
});

test("feedback proxy reports submission failures so the UI can retry", async (t) => {
    const originalBase = process.env.API_INTERNAL_URL;
    process.env.API_INTERNAL_URL = "https://api.example.test";
    t.mock.method(globalThis, "fetch", async () => {
        throw new Error("Connection failed");
    });
    try {
        const response = await POST(
            new Request("https://client.example.test/api/ask/feedback", {
                method: "POST",
                body: JSON.stringify({ reference, rating: 0 }),
            })
        );
        assert.equal(response.status, 502);
        assert.match((await response.json()).message, /try again/);
    } finally {
        if (originalBase === undefined) delete process.env.API_INTERNAL_URL;
        else process.env.API_INTERNAL_URL = originalBase;
    }
});
