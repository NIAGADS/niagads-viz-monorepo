import { APIError } from "./errors";
import { APIErrorResponse, APIResponse } from "./types";
import { get_public_url, is_error_response } from "./utils";

import { backendFetch } from "@niagads/common";
import { notFound } from "next/navigation";

export async function fetchRecord(endpoint: string) {
    const response: APIResponse | APIErrorResponse = await backendFetch(endpoint, get_public_url());

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

    return response.data[0]; // record is a list of one item
}

export async function fetchRecordAttribute(endpoint: string, dataOnly: boolean = false) {
    const response: APIResponse | APIErrorResponse = await backendFetch(endpoint, get_public_url());

    // errors have to be handled in-line
    return is_error_response(response) || !dataOnly ? response : response.data;
}
