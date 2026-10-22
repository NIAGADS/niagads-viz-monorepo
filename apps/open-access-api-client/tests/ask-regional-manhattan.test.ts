import assert from "node:assert/strict";
import test from "node:test";
import { presentationSchema } from "../app/ask/contracts.ts";
import { resolvePresentation } from "../app/ask/translators/presentation.ts";

const association = {
    variant: "2:127100000:A:T",
    chromosome: "chr2",
    position: 127100000,
    neg_log10_pvalue: 400,
    pvalue: "1e-400",
    track: "study-1",
    traits: {
        population: [{ term: "European ancestry" }],
        disease: [{ term: "Alzheimer disease" }],
        neuropathology: [],
    },
};
const result = {
    id: "bin1-associations",
    entity: "gene" as const,
    annotation: "associations" as const,
    content: "full" as const,
    rows: [association],
};

test("gene association plots use reported scores with phenotype colors and population symbols", () => {
    const intent = presentationSchema.parse({
        result_id: result.id,
        view: "plot",
        group_by: ["population", "disease_or_neuropathology"],
    });
    const resolved = resolvePresentation(result, intent, 7);
    assert.equal(resolved.kind, "regional_manhattan");
    if (resolved.kind !== "regional_manhattan") return;
    const point = resolved.config.data.points[0];
    assert.equal(point.position, 127.1);
    assert.equal(point.score, 400);
    assert.equal(point.colorCategory, "Alzheimer disease");
    assert.equal(point.symbolCategory, "European ancestry");
    assert.deepEqual(point.tooltipInfo, [
        { label: "Reported p-value", value: "1e-400" },
        { label: "Source track", value: "study-1" },
    ]);
});

test("regional plots retain separate studies and include neuropathology phenotypes", () => {
    const records = {
        ...result,
        entity: "region" as const,
        rows: [
            association,
            {
                ...association,
                track: "study-2",
                traits: { ...association.traits, disease: [], neuropathology: [{ term: "Amyloid plaques" }] },
            },
        ],
    };
    const resolved = resolvePresentation(records, presentationSchema.parse({ result_id: result.id, view: "plot" }), 7);
    assert.equal(resolved.kind, "regional_manhattan");
    if (resolved.kind !== "regional_manhattan") return;
    assert.equal(resolved.config.data.points.length, 2);
    assert.equal(resolved.config.data.points[1].colorCategory, "Amyloid plaques");
});

test("invalid regional data is reported instead of silently dropped", () => {
    for (const rows of [
        [{ ...association, position: null }],
        [{ ...association, neg_log10_pvalue: null }],
        [association, { ...association, chromosome: "chr19" }],
    ]) {
        const intent = presentationSchema.parse({ result_id: result.id, view: "plot" });
        assert.equal(resolvePresentation({ ...result, rows }, intent, 7).kind, "unsupported");
    }
});

test("table preferences and summary-count bar plots retain their behavior", () => {
    const table = presentationSchema.parse({ result_id: result.id, view: "table" });
    assert.equal(resolvePresentation(result, table, 7).kind, "table");
    const summary = { ...result, content: "summary" as const, rows: [{ track: "study-1", num_associations: 42 }] };
    const plot = presentationSchema.parse({ result_id: result.id, view: "plot", group_by: "track" });
    assert.equal(resolvePresentation(summary, plot, 7).kind, "bar");
});
