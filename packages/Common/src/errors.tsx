import { APIErrorResponse } from "./types";

export class APIError extends Error {
    constructor(message: string, response: APIErrorResponse) {
        Object.assign(response, { error: message });
        super(JSON.stringify(response));
        this.name = "Service Error";
    }
}

// check to see if a response is an error response
export function isAPIError(obj: any): obj is APIErrorResponse {
    return obj && typeof obj === "object" && typeof obj.status === "number" && typeof obj.detail === "string";
}
