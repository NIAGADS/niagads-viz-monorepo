import { NextRequest, NextResponse } from "next/server";
import { _fetch, fetchRecordAnnotationTable } from "@/lib/route-handlers";

// for client-side fetching from the API w/ioredis caching

// This dynamic route matches /api/record/[id]/...subpath
export async function GET(req: NextRequest) {
    // Get the full pathname from the request
    let endpoint = req.nextUrl.pathname;
    // remove the /annotation subpath
    endpoint = endpoint.replace("/annotation", "");
    // add api prefix if missing
    if (!endpoint.startsWith("/api")) {
        endpoint = `/api${endpoint}`;
    }
    // Append query parameters if present
    const search = req.nextUrl.search;
    if (search) {
        endpoint += search;
    }

    const response = await fetchRecordAnnotationTable(endpoint);
    return NextResponse.json(response);
}

// then in client componet use the useSWR
// e.g.

/*
"use client";
import useSWR from "swr";
import { Table } from "../Table"; // client component

function RecordTableClient({ id, ...props }) {
    
    const { data, error, isLoading } = useSWR(`${table.endpoint}`, url =>
        fetch(url).then(res => res.json())
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading table</div>;

    return <Table {...props} table={data.table} />;
}

export default RecordTableClient;
*/
