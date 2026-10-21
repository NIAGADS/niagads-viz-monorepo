import assert from "node:assert/strict";
import test from "node:test";
import { parseQueryPlan } from "../app/ask/planning.ts";

test("preserves Boolean concepts and unspecified location parameters", () => {
    const plan = parseQueryPlan({
        intent: "retrieve_data", entity: "track",
        selection: { operator: "and", operands: [
            { category: "annotation", text: "histone modifications" },
            { category: "biosample", text: "brain cells" },
        ] },
        location: { kind: "gene", loc: "APOE" },
        exclusions: ["cancer cells"],
    });
    assert.equal(plan.location?.flank_bp, null);
    assert.equal(plan.location?.assembly, null);
    assert.deepEqual(plan.exclusions, ["cancer cells"]);
});

test("preserves nested population alternatives and clarification", () => {
    const plan = parseQueryPlan({
        intent: "discover_resources",
        selection: { operator: "and", operands: [
            { operator: "or", operands: [
                { category: "population", text: "Korean" },
                { category: "population", text: "Japanese" },
            ] },
            { category: "phenotype", text: "PSP" },
        ] },
        clarifications: [{ field: "selection", question: "What does PSP mean?" }],
    });
    assert.equal(plan.clarifications.length, 1);
});

test("rejects empty Boolean groups, invented intents, negative flanks and executable extras", () => {
    for (const value of [
        { intent: "invented" },
        { intent: "discover_resources", selection: { operator: "and", operands: [] } },
        { intent: "retrieve_data", location: { kind: "gene", loc: "APOE", flank_bp: -1 } },
        { intent: "discover_resources", endpoint: "https://untrusted.example" },
    ]) assert.throws(() => parseQueryPlan(value));
});
