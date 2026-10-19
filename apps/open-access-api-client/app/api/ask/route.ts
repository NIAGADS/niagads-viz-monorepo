export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
    const base = process.env.ASK_API_URL;
    if (!base)
        return Response.json(
            { error: "Configure ASK_API_URL server-side to connect the existing Open Access API." },
            { status: 503 }
        );
    let target: URL;
    try {
        target = new URL(`${base.replace(/\/$/, "")}/ask`);
        if (!["http:", "https:"].includes(target.protocol)) throw new Error("Unsupported API protocol");
    } catch {
        return Response.json({ error: "Invalid server API configuration." }, { status: 503 });
    }
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (!request.body) return Response.json({ error: "A question is required." }, { status: 422 });
    const reader = request.body.getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 65536) {
            await reader.cancel();
            return Response.json({ error: "Conversation exceeds 64 KiB." }, { status: 413 });
        }
        chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
    }
    const headers = new Headers({ "Content-Type": "application/json" });
    for (const name of ["authorization", "cookie", "x-request-id"]) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    }
    try {
        const upstream = await fetch(target, {
            method: "POST",
            body,
            headers,
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(100000)]),
            cache: "no-store",
        });
        if (!upstream.ok)
            return Response.json(
                {
                    error:
                        upstream.status === 503
                            ? "The assistant is not configured or is unavailable. Check server-side provider settings."
                            : "The API could not accept this conversation. Retry with a shorter question.",
                },
                { status: upstream.status }
            );
        return new Response(upstream.body, {
            status: upstream.status,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "x-vercel-ai-ui-message-stream": "v1",
            },
        });
    } catch {
        return Response.json(
            { error: "The Open Access API could not be reached or the request was cancelled." },
            { status: 502 }
        );
    }
}
