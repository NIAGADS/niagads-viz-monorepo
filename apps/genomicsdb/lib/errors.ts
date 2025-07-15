import { APIErrorResponse } from "./types";

export class APIError extends Error {
    constructor(message: string, response: APIErrorResponse) {
        Object.assign(response, { error: message });
        super(JSON.stringify(response));
        this.name = "Service Error";
    }
}
