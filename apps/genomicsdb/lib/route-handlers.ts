import { APIError, APIErrorResponse, APIResponse, backendFetch, isAPIError } from "@niagads/common";
import { APITableResponse, AssociationTraitCategory, AssociationTraitSource, RecordType } from "./types";
import { getBasePath, getPublicUrl } from "./utils";

import { notFound } from "next/navigation";

type ResponseContent = "brief" | "full" | "counts" | "urls";
type ResponseFormat = "summary" | "table" | "default";

export async function fetchRecord(recordType: RecordType, id: string, brief: boolean = true) {
    // fetch record and handle error response
    const response = await _fetch(`/record/${recordType}/${id}`, brief ? "brief" : "full");

    if (isAPIError(response)) {
        if (response.status === 404) {
            notFound();
        } else if (response.status === 429) {
            throw new APIError("Too Many Requests", response);
        } else if (response.status >= 500) {
            throw new APIError("Internal Server Error", response);
        } else {
            throw new APIError("Unexpected Error", response);
        }
    }
    const record = (response as APIResponse).data[0]; // records are lists of one item
    Object.assign(record, { record_type: recordType });
    return record;
}

export async function fetchTable(endpoint: string): Promise<APITableResponse> {
    const view = endpoint.includes("?") ? "&view=table" : "?view=table";
    return await _fetch(`${endpoint}${view}`) as unknown as APITableResponse;
}

export async function fetchRecordAssociations(
    recordType: RecordType,
    id: string,
    category: AssociationTraitCategory = "all",
    source: AssociationTraitSource = "all",
    format: ResponseFormat = "default"
) {
    const endpoint = `record/${recordType}/${id}/associations?category=${category}&source=${source}&view=${format === "table" ? "table" : "default"}`;
    return await _fetch(endpoint, format === "summary" ? "counts" : "full");
}

export async function _fetch(endpoint: string, content: ResponseContent = "full", dataOnly: boolean = false) {
    const basePath = `${getBasePath()}/api`;
    let query = `${basePath}${endpoint}`;

    // fetch from backend
    const response: APIResponse | APIErrorResponse = await backendFetch(query, getPublicUrl());

    const isError = isAPIError(response);

    // do not catch errors here; deal with them w/in calling block so they can be
    // handled inline when necessary
    return isError || !dataOnly ? response : response.data;
}
