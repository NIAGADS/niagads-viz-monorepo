import { APITableResponse } from "@/lib/types";
import { NextRequest } from "next/server";
import { resolveProcessor, TableTypes } from "./processors";

// export const dynamic = 'force-static'

interface routeParams {
    entity: string;
    id: string;
    type: TableTypes;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<routeParams> }
) {
    const { entity, id, type } = await params;
    const queryParams = request.nextUrl.search;

    const tableEndpoint = buildTableEndpoint(entity, id, type, queryParams);

    const processor = resolveProcessor(type);

    const rawTable = await fetchTable(tableEndpoint)

    return Response.json({...rawTable, table: processor(rawTable)});
}

const buildTableEndpoint = (entity: string, id: string, type: string, queryParams: string) => {
    const url = `http://localhost:3001/api-proxy/record/${entity}/${id}/${type}${queryParams}`;
    const view = url.includes("?") ? "&view=table" : "?view=table";
    return `${url}${view}`;
};

const fetchTable = async (endpoint: string) => {
    // "use cache";
    // cacheLife("hours");

    const res = await fetch(endpoint);
    const rawTable = await res.json() as APITableResponse;
    return rawTable;
}
