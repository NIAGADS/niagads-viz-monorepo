import { httpIssue } from "../../ask/errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
    // Bound connection/header setup; the backend bounds active work while
    // excluding announced retry waits from its deadline.
    const timeout = new AbortController();
    const connectionTimer = setTimeout(() => timeout.abort(), 100000);
    try {
        const chunks: Uint8Array[] = [];
        let size = 0;
        if (!request.body) return Response.json(httpIssue(422), { status: 422 });
        const reader = request.body.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > 65536) {
                await reader.cancel();
                return Response.json(httpIssue(413), { status: 413 });
            }
            chunks.push(value);
        }
        const body = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) {
            body.set(chunk, offset);
            offset += chunk.byteLength;
        }
        const upstream = await fetch(`${process.env.API_INTERNAL_URL}/ask`, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.any([request.signal, timeout.signal]),
            cache: "no-store",
            redirect: "error",
        });
        clearTimeout(connectionTimer);
        if (!upstream.ok) return upstream;
        const upstreamId = upstream.headers.get("x-request-id");
        if (!upstream.body || !upstream.headers.get("content-type")?.startsWith("text/event-stream")) {
            console.error("ASK API returned an invalid stream", { upstreamId });
            await upstream.body?.cancel();
            return Response.json(
                {
                    ...httpIssue(502),
                    request_id: upstreamId,
                    code: "malformed_response",
                    request: new TextDecoder().decode(body),
                    message:
                        "An unexpected error occurred.  Please reload the page or try your request again.  If the problem persists, please submit a GitHub issue containing this full error response to https://github.com/NIAGADS/niagads-open-access-client/issues",
                },
                { status: 502 }
            );
        }
        const responseHeaders = new Headers(upstream.headers);
        responseHeaders.set("Content-Type", "text/event-stream");
        responseHeaders.set("Cache-Control", "no-cache");
        responseHeaders.set("x-vercel-ai-ui-message-stream", "v1");
        return new Response(upstream.body, {
            status: upstream.status,
            headers: responseHeaders,
        });
    } catch (error) {
        if (request.signal.aborted) return new Response(null, { status: 499 });
        const status = timeout.signal.aborted ? 504 : 502;
        console.error("ASK proxy request failed", {
            status,
            exceptionType: error instanceof Error ? error.name : "Unknown",
        });
        return Response.json(
            {
                detail: "The NIAGADS API service is unavailable.",
                message:
                    "Please email this error response to help@niagads.org with the subject NIAGADS API Systems Error.",
            },
            { status }
        );
    } finally {
        clearTimeout(connectionTimer);
    }
}
