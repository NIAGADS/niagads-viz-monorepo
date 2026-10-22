import assert from "node:assert/strict";
import test from "node:test";
import { presentationSchema } from "../app/ask/contracts.ts";
import { resolvePresentation } from "../app/ask/translators/presentation.ts";

const result = {
    id: "regional-variants",
    entity: "variant" as const,
    annotation: "report" as const,
    content: "full" as const,
    rows: [
        { id: "6:100:A:T", is_adsp_variant: true },
        { id: "6:101:C:T", is_adsp_variant: false },
        { id: "6:102:G:T", is_adsp_variant: null },
    ],
};

test("ADSP intent filters the loaded table without changing original rows", () => {
    const intent = presentationSchema.parse({
        result_id: result.id,
        filters: [{ field: "is_adsp_variant", value: true }],
    });
    const resolved = resolvePresentation(result, intent, 20);
    assert.equal(resolved.kind, "table");
    if (resolved.kind !== "table") return;
    assert.equal(resolved.config.data.length, 1);
    assert.equal(result.rows.length, 3);
});

test("a valid filter with no matches produces an empty table", () => {
    const intent = presentationSchema.parse({
        result_id: result.id,
        filters: [{ field: "id", value: "absent" }],
    });
    const resolved = resolvePresentation(result, intent, 20);
    assert.equal(resolved.kind, "table");
    if (resolved.kind === "table") assert.equal(resolved.config.data.length, 0);
});

test("unknown fields and incompatible filter values are not silently ignored", () => {
    for (const filter of [
        { field: "invented", value: true },
        { field: "is_adsp_variant", value: "true" },
    ]) {
        const intent = presentationSchema.parse({ result_id: result.id, filters: [filter] });
        assert.equal(resolvePresentation(result, intent, 20).kind, "unsupported");
    }
});

test("existing presentation intents default to no filters", () => {
    assert.deepEqual(presentationSchema.parse({ result_id: result.id }).filters, []);
});
