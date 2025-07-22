"use server";

import { APIErrorResponse, APIResponse, AssociationTraitCategory, AssociationTraitSource, RecordType } from "./types";
import { getCache, setCache } from "./cache";
import { getPublicUrl, isErrorAPIResponse } from "./utils";

import { APIError } from "./errors";
import { backendFetch } from "@niagads/common";
import { notFound } from "next/navigation";

type ResponseContent = "brief" | "full" | "counts" | "urls";
type ResponseFormat = "summary" | "table" | "default";

export async function fetchRecord(endpoint: string, brief: boolean = true) {
    const response = await _fetch(endpoint, brief ? "brief" : "full");

    if (isErrorAPIResponse(response)) {
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

export async function fetchRecordAnnotationTable(endpoint: string) {
    // we are going to fetch twice, once for the raw data for caching and once for the view
    // the second fetch will be quick b/c the API will have already cached the raw
    let query = `${endpoint}`;

    // fetch but this response gets thrown away, just need to cache it
    // errors are handled in export function
    await _fetch(query);

    // now fetch the table; will be quick b/c API cached the raw response
    // and just needs to reformat it
    const view = endpoint.includes("?") ? "&view=table" : "?view=table";
    query = `${query}${view}`;

    // errors are handled in the component
    return await _fetch(query);
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
    if (!endpoint.startsWith("/api/")) {
        throw Error("Runtime Error: _fetch wrapper is for querying /api endpoints only.");
    }
    let query = endpoint;
    let namespace: string = "";
    if (endpoint.includes("/service/")) {
        // search endpoint does not return data object
        // dataOnly = true;
        namespace = "service";
    } else {
        const operator = endpoint.includes("?") ? "&" : "?";
        query = `${endpoint}${operator}content=${content}`;

        if (endpoint.includes("record")) {
            namespace = "record";
        } else {
            namespace = "query";
        }
    }

    // Try to get from cache
    const cached = await getCache(namespace, endpoint);
    if (cached) {
        return JSON.parse(cached);
    }

    // Not cached, fetch from backend
    const response: APIResponse | APIErrorResponse = await backendFetch(query, getPublicUrl());

    const isError = isErrorAPIResponse(response);
    if (!isError) {
        // don't cache errors; they may go away
        await setCache(namespace, endpoint, JSON.stringify(response));
    }

    // do not catch errors here; deal with them w/in calling block so they can be
    // handled inline when necessary
    return isError || !dataOnly ? response : response.data;
}
