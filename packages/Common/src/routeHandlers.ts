import { NextRequest } from "next/server";
import { pathJoin } from "./utils";

export function userAgentIsBrowser(userAgent: string): boolean {
    // checks if the user-agent for the request was a web browser
    const browsers = ["Mozilla", "Safari", "Edge", "Chrome"];
    return userAgent !== null && browsers.some((value) => userAgent.includes(value));
}

async function __fetch(requestUri: string, asText: boolean = false) {
    const response = await fetch(requestUri);
    if (!response.ok) {
        throw new Error(`Fetch from ${requestUri} failed with status ${response.status}: ${response.statusText}`);
    }
    const data = asText ? await response.text() : await response.json();
    return data;
}

export async function backendFetchFromRequest(
    request: NextRequest,
    apiBaseUrl: string | undefined = process.env.API_PUBLIC_URL,
    asText = false
) {
    if (!apiBaseUrl) {
        throw new Error("`apiBaseUrl` cannot be null.  Please specify explicitly or set API_PUBLIC_URL in .env.local");
    }
    const incomingRequestUrl = new URL(request.url);
    const pathname = incomingRequestUrl.pathname;
    const queryParams = incomingRequestUrl.search;
    const requestUri: string = pathJoin(apiBaseUrl, pathname, queryParams);
    return await __fetch(requestUri, asText);
}

export async function backendFetch(
    pathname: string,
    apiBaseUrl: string | undefined = process.env.API_PUBLIC_URL,
    relative: boolean = false
) {
    if (!apiBaseUrl) {
        throw new Error("`apiBaseUrl` cannot be null.  Please specify explicitly or set API_PUBLIC_URL in .env.local");
    }
    const requestUri: string = pathJoin(apiBaseUrl, pathname);
    return await __fetch(requestUri);
}
