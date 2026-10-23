import assert from "node:assert/strict";
import test from "node:test";
import { parseQueryPlan } from "../app/ask/planning.ts";

const interpretation = {
    intent: "retrieve_data",
    goal: "Retrieve requested data using evidence to resolve dependent inputs",
    concepts: [{ category: "source", text: "ADSP" }],
    constraints: ["Use the requested source; do not replace variants with associations"],
    location: { kind: "gene", loc: "TREM2" },
};

test("compact interpretation keeps intent and unresolved scope without requiring steps", () => {
    const parsed = parseQueryPlan(interpretation);
    assert.equal(parsed.intent, interpretation.intent);
    assert.equal(parsed.goal, interpretation.goal);
    assert.deepEqual(parsed.concepts, interpretation.concepts);
    assert.deepEqual(parsed.constraints, interpretation.constraints);
    assert.equal(parsed.location?.loc, "TREM2");
    assert.equal(parsed.location?.flank_bp, null);
    assert.deepEqual(parsed.clarifications, []);
    assert.deepEqual(parsed.gene_evidence, []);
});

test("flat schema rejects recursive plans, workflows and oversized interpretations", () => {
    for (const extra of [
        { goal: "x".repeat(321) },
        { concepts: Array(7).fill({ category: "source", text: "source" }) },
        { constraints: Array(7).fill("constraint") },
        { clarifications: Array(3).fill({ field: "scope", question: "Which scope?" }) },
        { selection: { operator: "and", operands: [] } },
        { steps: ["Invent a complete workflow"] },
    ]) {
        assert.throws(() => parseQueryPlan({ ...interpretation, ...extra }));
    }
});

test("material clarifications, exclusions and compound meaning survive interpretation", () => {
    const parsed = parseQueryPlan({
        ...interpretation,
        constraints: ["brain OR blood; retain the source constraint"],
        clarifications: [{ field: "transcript", question: "Which transcript should I use?" }],
        exclusions: ["cancer"],
        gene_evidence: ["transcripts"],
    });
    assert.deepEqual(parsed.constraints, ["brain OR blood; retain the source constraint"]);
    assert.equal(parsed.clarifications[0].field, "transcript");
    assert.deepEqual(parsed.exclusions, ["cancer"]);
    assert.deepEqual(parsed.gene_evidence, ["transcripts"]);
});
