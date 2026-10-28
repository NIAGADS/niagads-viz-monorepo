import { feedbackSchema } from "../../../ask/contracts.ts";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const base = process.env.API_INTERNAL_URL;
    if (!base) return Response.json({ message: "Feedback is currently unavailable." }, { status: 503 });
    let target: URL;
    try {
        target = new URL(`${base.replace(/\/$/, "")}/ask/feedback`);
        if (!["http:", "https:"].includes(target.protocol)) throw new Error("Unsupported API protocol");
    } catch {
        return Response.json({ message: "Feedback is currently unavailable." }, { status: 503 });
    }
    if (!request.body) return Response.json({ message: "Invalid feedback." }, { status: 422 });
    const timeout = AbortSignal.timeout(15000);
    try {
        const reader = request.body.getReader();
        const decoder = new TextDecoder();
        let body = "";
        let size = 0;
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > 16384) {
                await reader.cancel();
                return Response.json({ message: "Feedback is too long." }, { status: 413 });
            }
            body += decoder.decode(value, { stream: true });
        }
        body += decoder.decode();
        let payload;
        try {
            payload = feedbackSchema.safeParse(JSON.parse(body));
        } catch {
            return Response.json({ message: "Invalid feedback." }, { status: 422 });
        }
        if (!payload.success) return Response.json({ message: "Invalid feedback." }, { status: 422 });
        const headers = new Headers({ "Content-Type": "application/json" });
        for (const name of ["authorization", "cookie"]) {
            const value = request.headers.get(name);
            if (value) headers.set(name, value);
        }
        const upstream = await fetch(target, {
            method: "POST",
            headers,
            body: JSON.stringify(payload.data),
            signal: AbortSignal.any([request.signal, timeout]),
            cache: "no-store",
            redirect: "error",
        });
        await upstream.body?.cancel();
        if (upstream.status === 204) return new Response(null, { status: 204 });
        return Response.json(
            { message: "Feedback could not be submitted. Please try again." },
            { status: upstream.ok ? 502 : upstream.status }
        );
    } catch {
        if (request.signal.aborted) return new Response(null, { status: 499 });
        return Response.json(
            { message: "Feedback could not be submitted. Please try again." },
            { status: timeout.aborted ? 504 : 502 }
        );
    }
}
