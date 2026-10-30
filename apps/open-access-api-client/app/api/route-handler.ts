import { type NextRequest } from "next/server";

export async function fetchApiResponse(request: NextRequest): Promise<Response> {
    const timeout = AbortSignal.timeout(100000);
    try {
        const base = new URL(process.env.API_INTERNAL_URL!);
        const path = request.nextUrl.pathname.replace("/api", "");
        const target = new URL(path, base);
        target.search = request.nextUrl.search;

        return fetch(target, {
            cache: "no-store",
            redirect: "error",
            signal: AbortSignal.any([request.signal, timeout]),
        });
    } catch {
        if (request.signal.aborted) return new Response(null, { status: 499 });
        return Response.json(
            {
                detail: "The NIAGADS Open Access API is down.",
                message:
                    "Please let us know at help@niagads.org with the subject NIAGADS API Systems Error and we will try and resolve the issue as soon as possible.",
            },
            { status: timeout.aborted ? 504 : 502 }
        );
    }
}
