import assert from "node:assert/strict";
import test from "node:test";
import { parseEnvelope, presentationSchema, type ResultSet } from "../app/ask/contracts.ts";
import { resolvePresentation } from "../app/ask/translators/presentation.ts";

const result: ResultSet = {
    id: "r1",
    entity: "gene",
    annotation: "associations",
    content: "summary",
    rows: [{ track: "t1", num_associations: 100 }],
    page: 1,
    limit: 50,
    has_more: true,
    sources: ["t1"],
    parameters: {},
    warnings: [],
};

test("explicit table intent remains a table even when a plot is possible", () => {
    const view = resolvePresentation(result, presentationSchema.parse({ result_id: "r1", view: "table" }), 7);
    assert.equal(view.kind, "table");
});

test("explicit bar intent uses a frontend adapter and preserves API counts", () => {
    const view = resolvePresentation(
        result,
        presentationSchema.parse({ result_id: "r1", view: "plot", plot_type: "bar" }),
        7
    );
    assert.equal(view.kind, "bar");
    if (view.kind === "bar") assert.equal(view.config.data[0].count, 100);
});

test("unknown plots and positional axes are explained rather than substituted", () => {
    for (const preferences of [{ plot_type: "future_plot" }, { x: "position", y: "neg_log10_pvalue" }]) {
        const view = resolvePresentation(
            result,
            presentationSchema.parse({ result_id: "r1", view: "plot", ...preferences }),
            7
        );
        assert.equal(view.kind, "unsupported");
        if (view.kind === "unsupported") assert.ok(view.message);
    }
});

test("wire validation does not require a UI adapter registry", () => {
    const envelope = {
        version: 4,
        status: "ok",
        results: [result],
        presentation: [{ result_id: "r1", view: "plot", plot_type: "future_plot" }],
        warnings: [],
    };
    assert.equal(parseEnvelope(envelope).presentation[0].plot_type, "future_plot");
    assert.throws(() => parseEnvelope({ ...envelope, presentation: [{ result_id: "forged", view: "table" }] }));
    assert.throws(() =>
        parseEnvelope({ ...envelope, presentation: [{ result_id: "r1", view: "table", onClick: "run()" }] })
    );
});

test("nested source-field hints are resolved by the frontend adapter", () => {
    const tracks: ResultSet = {
        ...result,
        entity: "track",
        annotation: "report",
        content: "full",
        rows: [{ id: "t1", provenance: { data_source: "ENCODE" } }],
    };
    const view = resolvePresentation(
        tracks,
        presentationSchema.parse({
            result_id: "r1",
            view: "plot",
            plot_type: "bar",
            group_by: "provenance.data_source",
        }),
        7
    );
    assert.equal(view.kind, "bar");
    if (view.kind === "bar") assert.deepEqual(view.config.data, [{ term: "ENCODE", count: 1 }]);
});

test("auto intent retains an explicit unsupported plot preference", () => {
    const view = resolvePresentation(
        result,
        presentationSchema.parse({ result_id: "r1", plot_type: "future_plot" }),
        7
    );
    assert.equal(view.kind, "unsupported");
});

test("explicit bar axes must match the supported horizontal orientation", () => {
    const reversed = resolvePresentation(
        result,
        presentationSchema.parse({
            result_id: "r1",
            view: "plot",
            plot_type: "bar",
            x: "track",
            y: "num_associations",
        }),
        7
    );
    assert.equal(reversed.kind, "unsupported");
    const horizontal = resolvePresentation(
        result,
        presentationSchema.parse({
            result_id: "r1",
            view: "plot",
            plot_type: "bar",
            x: "num_associations",
            y: "track",
        }),
        7
    );
    assert.equal(horizontal.kind, "bar");
});
