export const runtime = "nodejs";

export async function GET() {
    const base = process.env.API_INTERNAL_URL!;
    let target: URL;
    try {
        target = new URL(`${base.replace(/\/$/, "")}/openapi.json`);
    } catch {
        return new Response("Not Found", { status: 404 });
    }

    try {
        const upstream = await fetch(target, {
            cache: "no-store",
            redirect: "error",
            signal: AbortSignal.timeout(10000),
        });

        return new Response(upstream.body, {
            status: upstream.status,
            headers: {
                "Cache-Control": "no-store",
                "Content-Type": upstream.headers.get("content-type") ?? "application/json",
            },
        });
    } catch {
        return Response.json({ detail: "Unable to load the OpenAPI document." }, { status: 502 });
    }
}
