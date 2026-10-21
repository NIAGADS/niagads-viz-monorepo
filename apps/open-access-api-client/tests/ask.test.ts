import assert from "node:assert/strict";
import test from "node:test";
import { parseEnvelope, textHistory, type ResultSet } from "../app/ask/contracts.ts";

const result: ResultSet = {
    id: "r1",
    entity: "gene",
    annotation: "associations",
    content: "summary",
    page: 1,
    limit: 50,
    has_more: true,
    sources: ["track-a", "track-b"],
    parameters: {},
    warnings: [],
    rows: [
        { track: "track-a", traits: {}, num_associations: 1200 },
        { track: "track-b", traits: { phenotype: [{ id: "trait-1" }] }, num_associations: 35 },
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

test("preserves association counts supplied by the API summary", () => {
    const data = parseEnvelope({
        version: 3,
        status: "ok",
        results: [result],
        presentation: [{ translator: "association_counts_table", result_id: "r1", title: "Evidence", slot: "primary" }],
        warnings: [],
    });
    assert.equal(data.results[0].has_more, true);
    assert.equal(data.results[0].rows[0].num_associations, 1200);
});

test("rejects incomplete or unsupported component configuration", () => {
    assert.throws(() => parseEnvelope({ version: 3, status: "ok" }));
    assert.throws(() =>
        parseEnvelope({
            version: 3,
            status: "ok",
            results: [result],
            presentation: [{ translator: "execute-js", result_id: "r1", title: "Bad", slot: "primary" }],
            warnings: [],
        })
    );
});

test("rejects invented result references", () => {
    assert.throws(() =>
        parseEnvelope({
            version: 3,
            status: "ok",
            results: [result],
            presentation: [
                { translator: "association_counts_table", result_id: "forged", title: "Bad", slot: "primary" },
            ],
            warnings: [],
        })
    );
});

test("accepts variant record tables and rejects association charts for variant annotations", () => {
    const envelope = {
        version: 3,
        status: "ok",
        results: [{ ...result, entity: "variant", annotation: "report", content: "full", rows: [{ id: "rs7412" }] }],
        presentation: [{ translator: "variant_records_table", result_id: "r1", title: "Variant", slot: "primary" }],
        warnings: [],
    };
    assert.equal(parseEnvelope(envelope).results[0].entity, "variant");
    assert.throws(() =>
        parseEnvelope({
            ...envelope,
            presentation: [{ ...envelope.presentation[0], translator: "association_counts_bar" }],
        })
    );
});

test("distinguishes association annotations from reports and search candidates", () => {
    const envelope = {
        version: 3,
        status: "ok",
        results: [{ ...result, entity: "variant", annotation: "associations" }],
        presentation: [{ translator: "association_counts_bar", result_id: "r1", title: "Sources", slot: "primary" }],
        warnings: [],
    };
    assert.equal(parseEnvelope(envelope).results[0].annotation, "associations");
    for (const annotation of ["report", "structure", null, "unknown"]) {
        assert.throws(() =>
            parseEnvelope({
                ...envelope,
                results: [{ ...result, entity: "variant", annotation }],
            })
        );
    }
    assert.throws(() => parseEnvelope({ ...envelope, version: 1 }));
});

test("rejects charts from full association rows and malformed summary counts", () => {
    const envelope = {
        version: 3,
        status: "ok",
        results: [result],
        warnings: [],
        presentation: [
            { translator: "association_counts_bar", result_id: "r1", title: "Associations", slot: "primary" },
        ],
    };
    for (const invalidResult of [
        { ...result, content: "full" },
        { ...result, rows: [{ track: "track-a" }] },
        { ...result, rows: [{ track: "track-a", num_associations: -1 }] },
        { ...result, rows: [{ track: "track-a", num_associations: "1200" }] },
        { ...result, rows: [{ track: "track-a", num_associations: 1.5 }] },
    ]) {
        assert.throws(() => parseEnvelope({ ...envelope, results: [invalidResult] }));
    }
});

test("operation failures remain distinct from successful empty results", () => {
    const envelope = parseEnvelope({
        version: 3,
        status: "retrieval_error",
        results: [],
        presentation: [],
        warnings: [],
        issues: [
            {
                code: "unsupported",
                operation: "gene",
                message: "Gene lookup failed. Check its identifier.",
                request_id: "request-123",
                provider_request_id: null,
            },
        ],
    });
    assert.equal(envelope.issues[0].code, "unsupported");
    assert.notEqual(envelope.status, "empty");
});
