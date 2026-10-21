import { safeRequestId } from "../../ask/errors.ts";
import { trackSelectionSchema, trackResponseSchema, type TrackDataBatch } from "../../ask/track-data.ts";
import { validateRows } from "../../ask/translators/registry.ts";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Fetch fixed track-data paths only; data never passes through a model. */
export async function POST(request: Request) {
    const requestId = safeRequestId(request.headers.get("x-request-id")) ?? crypto.randomUUID();
    let selection;
    try {
        selection = trackSelectionSchema.parse(await request.json());
    } catch (error) {
        return Response.json(
            { message: error instanceof Error ? error.message : "Invalid track selection" },
            { status: 422 }
        );
    }
    const base = process.env.ASK_API_URL;
    if (!base) return Response.json({ message: "ASK_API_URL is not configured" }, { status: 503 });
    try {
        if (!["http:", "https:"].includes(new URL(base).protocol))
            throw new Error("ASK_API_URL must use HTTP or HTTPS");
    } catch {
        return Response.json({ message: "ASK_API_URL must be a valid HTTP or HTTPS URL" }, { status: 503 });
    }
    const headers = new Headers({ accept: "application/json", "x-request-id": requestId });
    for (const name of ["authorization", "cookie"]) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    }
    const timeout = AbortSignal.timeout(100000);
    const signal = AbortSignal.any([request.signal, timeout]);
    const tracks = await Promise.all(
        selection.track_ids.map(async (track_id): Promise<TrackDataBatch["tracks"][number]> => {
            let upstreamId: string | null = requestId;
            let httpStatus: number | null = null;
            try {
                const target = `${base.replace(/\/$/, "")}/track/${encodeURIComponent(track_id)}/data`;
                const upstream = await fetch(target, { headers, signal, cache: "no-store", redirect: "error" });
                upstreamId = safeRequestId(upstream.headers.get("x-request-id")) ?? requestId;
                httpStatus = upstream.status;
                if (!upstream.ok)
                    throw new Error((await upstream.text()) || `Track data request failed (HTTP ${upstream.status})`);
                const response = trackResponseSchema.parse(await upstream.json());
                validateRows({ rows: response.data }, "associations_table");
                return { track_id, status: "ok", request_id: upstreamId, response };
            } catch (error) {
                return {
                    track_id,
                    status: "error",
                    request_id: upstreamId,
                    http_status: httpStatus,
                    message: error instanceof Error ? error.message : "Track data request failed",
                };
            }
        })
    );
    if (request.signal.aborted) return new Response(null, { status: 499 });
    return Response.json({ tracks }, { headers: { "Cache-Control": "no-store", "x-request-id": requestId } });
}
