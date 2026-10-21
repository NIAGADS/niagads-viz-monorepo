import assert from "node:assert/strict";
import test from "node:test";
import { type ResultSet } from "../app/ask/contracts.ts";
import { translateTable, translateBar, comparePvalues } from "../app/ask/translators/index.ts";

const result: ResultSet = {
    id: "r1",
    entity: "track",
    annotation: "report",
    content: "full",
    page: 2,
    limit: 50,
    has_more: true,
    sources: ["t1"],
    parameters: {},
    warnings: [],
    rows: [{ id: "t1", name: "Study", is_download_only: false, provenance: { data_source: "ENCODE" } }],
};

test("frontend record adapters retain booleans, nested categories and nulls", () => {
    const table = translateTable(result);
    assert.equal(table.data[0].is_download_only, false);
    assert.equal(table.data[0].data_source, "ENCODE");
    assert.equal(table.data[0].description, null);
    assert.equal(table.columns.find((c) => c.id === "is_download_only")?.type, "boolean");
    assert.equal(result.page, 2);
});

test("numeric fields retain zero and p-value strings without histogram controls", () => {
    const table = translateTable({
        ...result,
        entity: "gene",
        annotation: "associations",
        rows: [
            {
                variant: "v1",
                chromosome: "19",
                position: 0,
                pvalue: "1.2e-500",
                neg_log10_pvalue: 499.92,
                traits: {},
                track: "t1",
            },
        ],
    });
    for (const col of table.columns.filter((c) => ["integer", "float", "pvalue"].includes(c.type!)))
        assert.equal(col.disableColumnFilter, true);
    assert.equal(table.data[0].pvalue, "1.2e-500");
    assert.equal(table.data[0].position, 0);
});

test("search adapters distinguish matched text, rank and semantic score", () => {
    const table = translateTable({
        ...result,
        entity: "gene",
        annotation: null,
        rows: [{ id: "g1", label: "Gene", rank: 1, score: 0, matched_text: "reported match" }],
    });
    assert.equal(table.data[0].score, 0);
    assert.equal(table.data[0].matched_text, "reported match");
    assert.match(table.columns.find((c) => c.id === "score")!.header!, /Semantic/);
});

test("loaded-row bars distinguish missing categories from a real missing label", () => {
    const source = {
        ...result,
        rows: [
            { id: "a", provenance: { data_source: "Missing" } },
            { id: "b" },
            { id: "c", provenance: { data_source: "Missing" } },
        ],
    };
    const bar = translateBar(source, "data_source", 7);
    assert.deepEqual(bar.data.map((row) => row.count).sort(), [1, 2]);
    assert.equal(new Set(bar.data.map((row) => row.term)).size, 2);
    assert.match(bar.scope, /loaded/);
});

test("API aggregate bars preserve all counts when cardinality prevents plotting", () => {
    const source = {
        ...result,
        rows: Array.from({ length: 8 }, (_, i) => ({ track: `t${i}`, num_associations: i })),
        entity: "gene" as const,
        annotation: "associations" as const,
        content: "summary" as const,
    };
    const bar = translateBar(source, null, 7);
    assert.equal(bar.data.length, 8);
    assert.equal(bar.showChart, false);
});

test("p-values sort below floating-point range without becoming zero", () => {
    assert.ok(comparePvalues("1e-500", "1e-400") < 0);
    assert.equal(comparePvalues("0.01", "1e-2"), 0);
    assert.ok(comparePvalues("0", "1e-500") < 0);
    assert.ok(comparePvalues(null, "1e-500") > 0);
});
