export const runtime = "nodejs";

export async function GET() {
    const base = process.env.API_INTERNAL_URL!;
    console.log(base);
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

        console.log(upstream.status);

        if (!upstream.ok) {
            return new Response(upstream.body, {
                status: upstream.status,
                headers: {
                    "Cache-Control": "no-store",
                    "Content-Type": upstream.headers.get("content-type") ?? "application/json",
                },
            });
        }

        const specification = (await upstream.json()) as Record<string, unknown>;
        const servers = specification.servers as Array<Record<string, unknown>>;

        return Response.json(
            {
                ...specification,
                // Preserve the public API host while routing requests through this app's proxy.
                servers: servers.map((server) => ({
                    ...server,
                    url: `${String(server.url).replace(/\/$/, "")}/api`,
                })),
            },
            {
                status: upstream.status,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch {
        return Response.json({ detail: "Unable to load the OpenAPI document." }, { status: 502 });
    }
}
