import * as path from "path"

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
    if (!skipErrorCheck && !response.ok) {
        throw new Error(`Fetch from ${requestUri} failed with status ${response.status}: ${response.statusText}`);
    }
    const data = asText ? await response.text() : await response.json();
    return data;
}

export async function backendFetchFromRequest(
    request: NextRequest,
    apiBaseUrl: string | undefined = process.env.API_INTERAL_URL,
    asText = false
) {
    if (!apiBaseUrl) {
        throw new Error("`apiBaseUrl` cannot be null.  Please specify explicitly or set API_INTERAL_URL in .env.local");
    }
    const incomingRequestUrl = new URL(request.url);
    const pathname = incomingRequestUrl.pathname;
    const queryParams = incomingRequestUrl.search;
    const baseUrl = (apiBaseUrl.startsWith('http')) ? apiBaseUrl : new URL(apiBaseUrl, incomingRequestUrl.origin).toString()
    const requestUri: string = new URL(path.join(pathname, queryParams), baseUrl).toString();
    return await __fetch(requestUri, asText);
}

export async function backendFetch(
    pathname: string,
    apiBaseUrl: string | undefined = process.env.API_INTERAL_URL,
    relative: boolean = false
) {
    if (!apiBaseUrl) {
        throw new Error("`apiBaseUrl` cannot be null.  Please specify explicitly or set API_INTERAL_URL in .env.local");
    }
    const requestUri: string = new URL(pathname, apiBaseUrl).toString()
    return await __fetch(requestUri);
}
