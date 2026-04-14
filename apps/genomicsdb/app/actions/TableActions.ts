"use server";

import { APITableResponse, ProcessedTableResponse, TableType } from "@/lib/types";
import { resolveProcessor } from "./processors";

export async function getTable(
    tableType: TableType | undefined,
    recordType: string,
    recordId: string,
    endpoint: string
): Promise<ProcessedTableResponse> {
    const tableEndpoint = buildTableEndpoint(recordType, recordId, endpoint);

    const rawTable = await fetchTable(tableEndpoint);

    const processor = resolveProcessor(tableType);

    return processor(rawTable);
}

const buildTableEndpoint = (entity: string, id: string, endpoint: string) => {
    const url = `${process.env.INTERNAL_BACKEND_SERVICE_URL}/record/${entity}/${id}/${endpoint}`;
    const view = url.includes("?") ? "&view=table" : "?view=table";
    return `${url}${view}`;
};

const fetchTable = async (endpoint: string) => {
    const res = await fetch(endpoint);
    const rawTable = (await res.json()) as APITableResponse;
    return rawTable;
};
