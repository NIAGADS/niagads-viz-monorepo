import { httpIssue, safeRequestId } from "../../ask/errors";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
    const requestId = safeRequestId(request.headers.get("x-request-id")) ?? crypto.randomUUID();
    const base = process.env.API_INTERNAL_URL;
    if (!base) {
        console.error("ASK proxy configuration missing", { requestId });
        return Response.json(httpIssue(503, requestId), { status: 503 });
    }
    let target: URL;
    try {
        target = new URL(`${base.replace(/\/$/, "")}/ask`);
        if (!["http:", "https:"].includes(target.protocol)) throw new Error("Unsupported API protocol");
    } catch {
        console.error("ASK proxy configuration invalid", { requestId });
        return Response.json(httpIssue(503, requestId), { status: 503 });
    }
    const timeout = AbortSignal.timeout(100000);
    try {
        const chunks: Uint8Array[] = [];
        let size = 0;
        if (!request.body) return Response.json(httpIssue(422, requestId), { status: 422 });
        const reader = request.body.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > 65536) {
                await reader.cancel();
                return Response.json(httpIssue(413, requestId), { status: 413 });
            }
            chunks.push(value);
        }
        const body = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) {
            body.set(chunk, offset);
            offset += chunk.byteLength;
        }
        const headers = new Headers({ "Content-Type": "application/json", "x-request-id": requestId });
        for (const name of ["authorization", "cookie"]) {
            const value = request.headers.get(name);
            if (value) headers.set(name, value);
        }
        const upstream = await fetch(target, {
            method: "POST",
            body,
            headers,
            signal: AbortSignal.any([request.signal, timeout]),
            cache: "no-store",
            redirect: "error",
        });
        const upstreamId = safeRequestId(upstream.headers.get("x-request-id")) ?? requestId;
        if (!upstream.ok) {
            console.warn("ASK API rejected conversation", { requestId, upstreamId, status: upstream.status });
            const responseHeaders = new Headers({ "x-request-id": upstreamId });
            const retryAfter = upstream.headers.get("retry-after");
            if (upstream.status === 429 && retryAfter && /^\d{1,8}$/.test(retryAfter)) {
                responseHeaders.set("retry-after", retryAfter);
            }
            responseHeaders.set("Content-Type", upstream.headers.get("content-type") ?? "application/json");
            return new Response(upstream.body, {
                status: upstream.status,
                headers: responseHeaders,
            });
        }
        if (!upstream.body || !upstream.headers.get("content-type")?.startsWith("text/event-stream")) {
            console.error("ASK API returned an invalid stream", { requestId, upstreamId });
            await upstream.body?.cancel();
            return Response.json(
                {
                    ...httpIssue(502, upstreamId),
                    code: "malformed_response",
                    message: "ASK NIAGADS returned an invalid response. Contact support if the problem continues.",
                },
                { status: 502 }
            );
        }
        return new Response(upstream.body, {
            status: upstream.status,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "x-vercel-ai-ui-message-stream": "v1",
                "x-request-id": upstreamId,
            },
        });
    } catch (error) {
        if (request.signal.aborted) return new Response(null, { status: 499 });
        const status = timeout.aborted ? 504 : 502;
        console.error("ASK proxy request failed", {
            requestId,
            status,
            exceptionType: error instanceof Error ? error.name : "Unknown",
        });
        return Response.json(httpIssue(status, requestId), { status });
    }
}
