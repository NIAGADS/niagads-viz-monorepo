import { NextResponse, type NextRequest } from "next/server";

export async function fetchApiResponse(request: NextRequest): Promise<NextResponse> {
    try {
        const base = new URL(process.env.API_INTERNAL_URL!);
        const path = request.nextUrl.pathname.replace("/api", "");
        const target = new URL(path, base);
        target.search = request.nextUrl.search;

        const response = await fetch(target, {
            cache: "no-store",
            redirect: "error",
            signal: request.signal,
        });

        return new NextResponse(response.body, {
            status: response.status,
            headers: response.headers,
        });
    } catch {
        return NextResponse.json({ detail: "Unable to reach API service." }, { status: 502 });
    }
}
