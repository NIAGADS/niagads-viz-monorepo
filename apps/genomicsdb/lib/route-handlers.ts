import { APIErrorResponse, APIResponse, AssociationTraitCategory, AssociationTraitSource, RecordType } from "./types";
import { get_public_url, is_error_response } from "./utils";

import { APIError } from "./errors";
import { backendFetch } from "@niagads/common";
import { notFound } from "next/navigation";

type ResponseContent = "brief" | "full" | "counts" | "urls";
type ResponseFormat = "summary" | "table" | "default";

export async function fetchRecord(endpoint: string, brief: boolean = true) {
    const response = await _fetch(endpoint, brief ? "brief" : "full");

    if (is_error_response(response)) {
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

export async function fetchRecordAssocations(
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
    let query = endpoint;

    if (endpoint.includes("/service/")) {
        // always want data only response for services
        dataOnly = true;
    } else {
        const operator = endpoint.includes("?") ? "&" : "?";
        query = `${endpoint}${operator}content=${content}`;
    }
    const response: APIResponse | APIErrorResponse = await backendFetch(query, get_public_url());

    // do not catch errors here; deal with them w/in calling block so they can be
    // handled inline when necessary
    return is_error_response(response) || !dataOnly ? response : response.data;
}
