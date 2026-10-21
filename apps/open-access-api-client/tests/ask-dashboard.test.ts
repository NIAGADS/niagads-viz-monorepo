import assert from "node:assert/strict";
import test from "node:test";
import { parseEnvelope, type ResultSet } from "../app/ask/contracts.ts";
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

test("typed tables retain booleans, nested categories, nulls and provenance", () => {
    const table = translateTable(result, {
        translator: "track_records_table",
        result_id: "r1",
        title: "Tracks",
        slot: "primary",
        parameters: {},
    });
    assert.equal(table.data[0].is_download_only, false);
    assert.equal(table.data[0].data_source, "ENCODE");
    assert.equal(table.data[0].description, null);
    assert.equal(table.columns.find((c) => c.id === "is_download_only")?.type, "boolean");
    assert.equal(result.page, 2);
    assert.equal(result.has_more, true);
});

test("numeric fields do not enable buggy histogram controls", () => {
    const association: ResultSet = {
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
    };
    const table = translateTable(association, {
        translator: "associations_table",
        result_id: "r1",
        title: "Associations",
        slot: "primary",
        parameters: {},
    });
    for (const column of table.columns.filter((c) => ["integer", "float", "pvalue"].includes(c.type!)))
        assert.equal(column.disableColumnFilter, true);
    assert.equal(table.data[0].pvalue, "1.2e-500");
    assert.equal(table.data[0].position, 0);
});

test("bars count loaded records and distinguish missing from a real missing label", () => {
    const source = {
        ...result,
        rows: [
            { id: "a", provenance: { data_source: "Missing" } },
            { id: "b" },
            { id: "c", provenance: { data_source: "Missing" } },
        ],
    };
    const bar = translateBar(
        source,
        {
            translator: "category_counts_bar",
            result_id: "r1",
            title: "Sources",
            slot: "primary",
            parameters: { group_by: "data_source" },
        },
        7
    );
    assert.deepEqual(bar.data.map((row) => row.count).sort(), [1, 2]);
    assert.equal(new Set(bar.data.map((row) => row.term)).size, 2);
    assert.match(bar.scope, /loaded/);
});

test("too many categories keeps the table without truncating or fabricating Other", () => {
    const source = {
        ...result,
        rows: Array.from({ length: 8 }, (_, i) => ({ track: `t${i}`, num_associations: i })),
        entity: "gene" as const,
        annotation: "associations" as const,
        content: "summary" as const,
    };
    const bar = translateBar(
        source,
        { translator: "association_counts_bar", result_id: "r1", title: "Counts", slot: "primary", parameters: {} },
        7
    );
    assert.equal(bar.data.length, 8);
    assert.equal(bar.showChart, false);
});

test("v3 rejects executable props, incompatible mappings and hidden identifiers", () => {
    const envelope = {
        version: 3,
        max_bar_categories: 7,
        status: "ok",
        results: [result],
        warnings: [],
        presentation: [
            { translator: "track_records_table", result_id: "r1", title: "Tracks", slot: "primary", parameters: {} },
        ],
    };
    assert.equal(parseEnvelope(envelope).version, 3);
    for (const parameters of [{ columns: ["name"] }, { columns: ["id", "eval"] }, { onClick: "run()" }])
        assert.throws(() =>
            parseEnvelope({ ...envelope, presentation: [{ ...envelope.presentation[0], parameters }] })
        );
    assert.throws(() => parseEnvelope({ ...envelope, version: 2 }));
    assert.throws(() =>
        parseEnvelope({
            ...envelope,
            presentation: [{ ...envelope.presentation[0], translator: "gene_records_table" }],
        })
    );
});

test("reported p-values sort below floating-point range without becoming zero", () => {
    assert.ok(comparePvalues("1e-500", "1e-400") < 0);
    assert.equal(comparePvalues("0.01", "1e-2"), 0);
    assert.ok(comparePvalues("0", "1e-500") < 0);
    assert.ok(comparePvalues(null, "1e-500") > 0);
});
