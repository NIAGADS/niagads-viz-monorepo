import { NextRequest, NextResponse } from "next/server";

import { fetchRecordAnnotationTable } from "@/lib/route-handlers";

// for client-side fetching from the API w/ioredis caching

// This dynamic route matches /api/record/[id]/...subpath
export async function GET(req: NextRequest) {
    // Get the full pathname from the request
    // remove the /annotation subpath

    let endpoint = req.nextUrl.pathname;
    endpoint = endpoint.replace("/annotation", "");

    // add api prefix
    endpoint = `/api${endpoint}`;

    // Append query parameters if present
    const search = req.nextUrl.search;
    if (search) {
        endpoint += search;
    }

    const response = await fetchRecordAnnotationTable(endpoint);
    return NextResponse.json(response);
}

// then in client componet use the useSWR
// see RecordTable for example
