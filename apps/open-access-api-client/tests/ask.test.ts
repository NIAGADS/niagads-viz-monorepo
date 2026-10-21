import assert from "node:assert/strict";
import test from "node:test";
import { parseEnvelope, textHistory, type ResultSet } from "../app/ask/contracts.ts";
import { resolvePresentation } from "../app/ask/translators/presentation.ts";

const result: ResultSet = {
    id: "r1",
    entity: "gene",
    annotation: "associations",
    content: "summary",
    page: 1,
    limit: 50,
    has_more: true,
    sources: ["track-a"],
    parameters: {},
    warnings: [],
    rows: [{ track: "track-a", num_associations: 1200 }],
};
const envelope = {
    version: 4,
    status: "ok",
    results: [result],
    presentation: [{ view: "table", result_id: "r1", title: "Evidence" }],
    warnings: [],
};

test("follow-ups send text history without previous datasets or tool results", () => {
    const history = textHistory([
        {
            id: "a1",
            role: "assistant",
            parts: [
                { type: "text", text: "Retrieved evidence" },
                { type: "data-niagads-result", data: { large: "x".repeat(70000) } },
                { type: "tool-search_resources", output: "not browser evidence" },
            ],
        },
    ]);
    assert.deepEqual(history[0].parts, [{ type: "text", text: "Retrieved evidence" }]);
    assert.ok(JSON.stringify(history).length < 1000);
});

test("follow-up context keeps at most twelve recent messages", () => {
    const history = textHistory(
        Array.from({ length: 20 }, (_, i) => ({
            id: String(i),
            role: "user",
            parts: [{ type: "text", text: "question" }],
        }))
    );
    assert.equal(history.length, 12);
    assert.equal(history[0].id, "8");
});

test("preserves authoritative data, query scope and partial pagination", () => {
    const parsed = parseEnvelope(envelope);
    assert.equal(parsed.results[0].rows[0].num_associations, 1200);
    assert.equal(parsed.results[0].has_more, true);
    assert.deepEqual(parsed.results[0].sources, ["track-a"]);
});

test("rejects forged references, executable props and old component contracts", () => {
    assert.throws(() => parseEnvelope({ version: 4, status: "ok" }));
    assert.throws(() => parseEnvelope({ ...envelope, presentation: [{ result_id: "forged", view: "table" }] }));
    assert.throws(() =>
        parseEnvelope({ ...envelope, presentation: [{ result_id: "r1", view: "table", onClick: "run()" }] })
    );
    assert.throws(() => parseEnvelope({ ...envelope, version: 3 }));
    assert.throws(() =>
        parseEnvelope({ ...envelope, presentation: [{ result_id: "r1", translator: "association_counts_table" }] })
    );
});

test("incompatible chart data remains inspectable with a UI explanation", () => {
    const parsed = parseEnvelope({
        ...envelope,
        results: [{ ...result, rows: [{ track: "a", num_associations: -1 }] }],
        presentation: [{ view: "plot", plot_type: "bar", result_id: "r1" }],
    });
    const view = resolvePresentation(parsed.results[0], parsed.presentation[0], 7);
    assert.equal(view.kind, "unsupported");
    assert.equal(parsed.results[0].rows[0].num_associations, -1);
});

test("operation failures remain distinct from successful empty results", () => {
    const parsed = parseEnvelope({
        version: 4,
        status: "retrieval_error",
        results: [],
        presentation: [],
        warnings: [],
        issues: [
            {
                code: "unsupported",
                operation: "gene",
                message: "Unavailable",
                request_id: "r1",
                provider_request_id: null,
            },
        ],
    });
    assert.equal(parsed.issues[0].code, "unsupported");
    assert.notEqual(parsed.status, "empty");
});
