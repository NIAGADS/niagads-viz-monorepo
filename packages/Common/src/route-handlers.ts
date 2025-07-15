import * as path from "path";

import { NextRequest } from "next/server";

export function userAgentIsBrowser(userAgent: string): boolean {
    // checks if the user-agent for the request was a web browser
    const browsers = ["Mozilla", "Safari", "Edge", "Chrome"];
    return userAgent !== null && browsers.some((value) => userAgent.includes(value));
}

/**
 *
 * @param requestUri
 * @param asText - if 'true' returns text response else returns jso response
 * @param skipErrorCheck  - defaults to 'true' b/c NIAGADS API calls will handle errors and return a JSON message
 * @returns - the response
 */
async function __fetch(requestUri: string, asText: boolean = false, skipErrorCheck: boolean = true) {
    const response = await fetch(requestUri);
    if (!response.ok) {
        if (skipErrorCheck) {
            const error = await response.json();
            return Object.assign({}, error, { status: response.status });
        } else {
            throw new Error(`Fetch from ${requestUri} failed with status ${response.status}: ${response.statusText}`);
        }
    }
    const data = asText ? await response.text() : await response.json();
    return data;
}

export async function backendFetchFromRequest(request: NextRequest, base: string, asText = false) {
    const incomingRequestUrl = new URL(request.url);
    const pathname = incomingRequestUrl.pathname;
    const queryParams = incomingRequestUrl.search;
    const baseUrl = base.startsWith("http") ? base : new URL(base, incomingRequestUrl.origin).toString();
    const requestUri: string = new URL(path.join(pathname, queryParams), baseUrl).toString();
    return await __fetch(requestUri, asText);
}

export async function backendFetch(pathname: string, base: string | undefined, skipErrorCheck: boolean = true) {
    const requestUri: string = base ? new URL(pathname, base).toString() : new URL(pathname).toString();
    return await __fetch(requestUri, false, skipErrorCheck);
}
