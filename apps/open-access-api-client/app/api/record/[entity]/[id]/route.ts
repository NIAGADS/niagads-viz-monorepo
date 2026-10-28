import { safeRequestId } from "../../../../ask/errors";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Fetch full JSON from a fixed API record route; never accept an upstream URL. */
export async function GET(request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
    const { entity, id } = await params;
    if (!["gene", "variant", "track"].includes(entity) || !id || id === "." || id === ".." || id.includes("/"))
        return Response.json({ detail: "Unsupported record identifier" }, { status: 422 });
    const base = process.env.API_INTERNAL_URL;
    if (!base) return Response.json({ detail: "Record API is unavailable" }, { status: 503 });
    const requestId = safeRequestId(request.headers.get("x-request-id")) ?? crypto.randomUUID();
    const headers = new Headers({ "x-request-id": requestId });
    for (const name of ["authorization", "cookie"]) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    }
    const timeout = AbortSignal.timeout(100000);
    try {
        const upstream = await fetch(
            `${base.replace(/\/$/, "")}/record/${entity}/${encodeURIComponent(id)}?content=full&format=json`,
            {
                headers,
                signal: AbortSignal.any([request.signal, timeout]),
                cache: "no-store",
                redirect: "error",
            }
        );
        return new Response(upstream.body, {
            status: upstream.status,
            headers: {
                "Content-Type": upstream.headers.get("content-type") ?? "application/json",
                "Cache-Control": "no-store",
                "x-request-id": safeRequestId(upstream.headers.get("x-request-id")) ?? requestId,
            },
        });
    } catch {
        if (request.signal.aborted) return new Response(null, { status: 499 });
        return Response.json(
            { detail: "Full record retrieval failed", request_id: requestId },
            { status: timeout.aborted ? 504 : 502 }
        );
    }
}
