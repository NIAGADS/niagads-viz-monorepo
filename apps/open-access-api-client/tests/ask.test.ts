import assert from "node:assert/strict";
import test from "node:test";
import { parseEnvelope, sourceCounts, tableData, textHistory, type ResultSet } from "../app/ask/contracts.ts";

const result: ResultSet = {
    id: "r1",
    kind: "genes",
    page: 1,
    limit: 50,
    has_more: true,
    sources: ["list-a", "track-b"],
    parameters: {},
    warnings: [],
    rows: [
        {
            id: "g1",
            evidence: [
                { evidence_type: "curated", data_source: "list-a" },
                { evidence_type: "proximity", data_source: "track-b" },
            ],
        },
    ],
};

test("follow-ups send text history without previous datasets or tool results", () => {
    const history = textHistory([
        {
            id: "a1",
            role: "assistant",
            parts: [
                { type: "text", text: "Retrieved evidence" },
                { type: "data-niagads-result", data: { large: "x".repeat(70000) } },
                { type: "tool-search_resources", output: "not authoritative browser evidence" },
            ],
        },
    ]);
    assert.deepEqual(history[0].parts, [{ type: "text", text: "Retrieved evidence" }]);
    assert.ok(JSON.stringify(history).length < 1000);
});

test("follow-up context keeps at most twelve recent messages", () => {
    const history = textHistory(
        Array.from({ length: 20 }, (_, index) => ({
            id: String(index),
            role: "user",
            parts: [{ type: "text", text: "question" }],
        }))
    );
    assert.equal(history.length, 12);
    assert.equal(history[0].id, "8");
});

test("validates completed data and preserves both evidence sources", () => {
    const data = parseEnvelope({
        version: 1,
        status: "ok",
        results: [result],
        presentation: [{ component: "table", result_id: "r1", title: "Evidence", slot: "primary" }],
        warnings: [],
    });
    assert.equal(data.results[0].has_more, true);
    assert.deepEqual(sourceCounts(data.results[0]), [
        { term: "list-a", count: 1 },
        { term: "track-b", count: 1 },
    ]);
});

test("rejects incomplete or unsupported component configuration", () => {
    assert.throws(() => parseEnvelope({ version: 1, status: "ok" }));
    assert.throws(() =>
        parseEnvelope({
            version: 1,
            status: "ok",
            results: [result],
            presentation: [{ component: "execute-js", result_id: "r1", title: "Bad", slot: "primary" }],
            warnings: [],
        })
    );
});

test("rejects invented result references", () => {
    assert.throws(() =>
        parseEnvelope({
            version: 1,
            status: "ok",
            results: [result],
            presentation: [{ component: "table", result_id: "forged", title: "Bad", slot: "primary" }],
            warnings: [],
        })
    );
});

test("nested result data is rendered as text instead of executable cell configuration", () => {
    const rows = tableData(result);
    assert.equal(rows.columns[0].type, "text");
    assert.match(rows.data[0].evidence, /track-b/);
    assert.equal(typeof rows.data[0].evidence, "string");
});
