import { APIError, APIErrorResponse, APIResponse, backendFetch, isAPIError } from "@niagads/common";
import { AssociationTraitCategory, AssociationTraitSource, RecordType } from "./types";
import { getBasePath, getPublicUrl } from "./utils";

import { notFound } from "next/navigation";

type ResponseContent = "brief" | "full" | "counts" | "urls";
type ResponseFormat = "summary" | "table" | "default";

export async function fetchRecord(endpoint: string, brief: boolean = true) {
    // fetch record and handle error response
    const response = await _fetch(endpoint, brief ? "brief" : "full");

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

    return (response as APIResponse).data[0]; // record is a list of one item
}

export async function fetchTable(endpoint: string) {
    const view = endpoint.includes("?") ? "&view=table" : "?view=table";
    return await _fetch(`${endpoint}${view}`);
}

export async function fetchRecordAssociations(
    recordType: RecordType,
    id: string,
    category: AssociationTraitCategory = "all",
    source: AssociationTraitSource = "all",
    format: ResponseFormat = "default"
) {
    const endpoint = `/api/record/${recordType}/${id}/associations?category=${category}&source=${source}&view=${format === "table" ? "table" : "default"}`;
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
