import assert from "node:assert/strict";
import test from "node:test";
import { limitRowSelection } from "../../../packages/Table/src/utils/selection.ts";
import { assembleTrackData, trackSelectionSchema, trackBatchSchema } from "../app/ask/track-data.ts";

const response = (track_id: string, rows: Record<string, unknown>[], page = 1, total_pages = 1) => ({
    track_id,
    status: "ok" as const,
    request_id: null,
    response: {
        data: rows,
        pagination: { page, total_pages },
        request: { endpoint: `/record/track/${track_id}/data` },
    },
});

test("table limit rejects sixth selection but permits deselection and unlimited callers", () => {
    const previous = { a: true, b: true, c: true, d: true, e: true };
    assert.equal(limitRowSelection(previous, { ...previous, f: true }, 5), previous);
    assert.deepEqual(limitRowSelection(previous, { ...previous, b: false }, 5), { ...previous, b: false });
    assert.equal(Object.keys(limitRowSelection(previous, { ...previous, f: true })).length, 6);
    assert.deepEqual(limitRowSelection({ a: true, b: true }, { a: true }, 1), { a: true });
});

test("track selection accepts one to five unique path identifiers", () => {
    assert.equal(trackSelectionSchema.parse({ track_ids: ["t1", "t2"] }).track_ids.length, 2);
    for (const track_ids of [[], ["t1", "t1"], [".."], ["a/b"], Array.from({ length: 6 }, (_, i) => `t${i}`)]) {
        assert.throws(() => trackSelectionSchema.parse({ track_ids }));
    }
});

test("combined table preserves requested and reported tracks, p-values and per-track metadata", () => {
    const batch = trackBatchSchema.parse({
        tracks: [
            response("requested-a", [{ variant: "v1", track: "reported-a", pvalue: "1e-500" }], 2, 3),
            response("requested-b", [{ variant: "v2", track: null }]),
        ],
    });
    const table = assembleTrackData(batch, "combined-1");
    assert.equal(table.data.length, 2);
    assert.equal(table.data[0].requested_track, "requested-a");
    assert.equal(table.data[0].track, "reported-a");
    assert.equal(table.data[0].pvalue, "1e-500");
    assert.equal(table.data[1].track, null);
    assert.equal(batch.tracks[0].status === "ok" && batch.tracks[0].response.pagination?.total_pages, 3);
});

test("partial failure and successful empty tracks remain distinct without losing successful rows", () => {
    const batch = trackBatchSchema.parse({
        tracks: [
            response("ok", [{ variant: "v1" }]),
            response("empty", []),
            {
                track_id: "failed",
                status: "error",
                http_status: 501,
                message: "Track data is not implemented",
                request_id: "r1",
            },
        ],
    });
    assert.equal(assembleTrackData(batch, "partial").data.length, 1);
    assert.equal(batch.tracks[1].status, "ok");
    assert.equal(batch.tracks[2].status, "error");
});

test("malformed track rows are not treated as successful empty data", () => {
    assert.throws(() => trackBatchSchema.parse({ tracks: [{ ...response("t1", []), response: {} }] }));
});

test("proxy calls only fixed track paths and preserves partial outcomes", async (t) => {
    const { POST } = await import("../app/api/track-data/route.ts");
    const prior = process.env.API_INTERNAL_URL;
    process.env.API_INTERNAL_URL = "https://api.example.test";
    const calls: string[] = [];
    t.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
        const url = String(input);
        calls.push(url);
        return url.includes("/failed/")
            ? new Response("Track is unavailable", { status: 501 })
            : Response.json({
                  data: [{ variant: "v1", pvalue: "1e-500" }],
                  pagination: { page: 1, total_pages: 2 },
                  request: { request_id: "upstream" },
              });
    });
    try {
        const response = await POST(
            new Request("http://localhost/api/track-data", {
                method: "POST",
                body: JSON.stringify({ track_ids: ["t1", "failed"] }),
            })
        );
        const batch = trackBatchSchema.parse(await response.json());
        assert.deepEqual(calls, [
            "https://api.example.test/record/track/t1/data",
            "https://api.example.test/record/track/failed/data",
        ]);
        assert.equal(batch.tracks[0].status, "ok");
        assert.equal(batch.tracks[1].status, "error");
        assert.equal(batch.tracks[1].status === "error" && batch.tracks[1].http_status, 501);
    } finally {
        if (prior === undefined) delete process.env.API_INTERNAL_URL;
        else process.env.API_INTERNAL_URL = prior;
    }
});
