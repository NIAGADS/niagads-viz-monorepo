import { z } from "zod";

export const issueSchema = z
    .object({
        code: z.enum([
            "invalid_input",
            "not_found",
            "unsupported",
            "authentication",
            "authorization",
            "rate_limit",
            "timeout",
            "provider_error",
            "malformed_response",
            "response_too_large",
            "usage_limit",
            "internal_error",
        ]),
        operation: z.string().max(80),
        message: z.string().max(600),
        request_id: z
            .string()
            .regex(/^[A-Za-z0-9._:-]{1,128}$/)
            .nullable(),
        provider_request_id: z
            .string()
            .regex(/^[A-Za-z0-9._:-]{1,128}$/)
            .nullable(),
    })
    .strict();

export type AskIssue = z.infer<typeof issueSchema>;

export function safeRequestId(value: string | null): string | null {
    return value && /^[A-Za-z0-9._:-]{1,128}$/.test(value) ? value : null;
}

export function httpIssue(status: number, requestId: string | null = null): AskIssue {
    const failures: Record<number, [AskIssue["code"], string]> = {
        400: ["invalid_input", "The question could not be accepted. Check your input or start a new session."],
        422: ["invalid_input", "The conversation is invalid. Send a text question or start a new session."],
        413: ["invalid_input", "The conversation is too long. Start a new session with a shorter question."],
        401: ["authentication", "Sign in before asking this question."],
        403: ["authorization", "Your account does not have access. Contact support if access is expected."],
        404: ["not_found", "ASK NIAGADS could not be found. Contact support."],
        405: ["unsupported", "This operation is not available. Ask about another supported operation."],
        501: ["unsupported", "This operation is not available. Ask about another supported operation."],
        429: ["rate_limit", "Too many questions were submitted. Wait before trying again."],
        408: ["timeout", "The question could not be completed in time. Try again later."],
        504: ["timeout", "The question could not be completed in time. Try again later."],
        502: ["provider_error", "ASK NIAGADS could not be reached."],
        503: ["provider_error", "ASK NIAGADS is unavailable. Contact support if the problem continues."],
    };
    const [code, message] = failures[status] ?? [
        "internal_error",
        "The question could not be completed. Contact support with the request reference.",
    ];
    return { code, operation: "assistant", message, request_id: safeRequestId(requestId), provider_request_id: null };
}

export function errorMessage(error: Error): string {
    const unexpected = "An unexpected error occurred while processing your request.";
    try {
        const payload = JSON.parse(error.message);
        const text =
            typeof payload.message === "string" && payload.message.length <= 600 ? payload.message : unexpected;
        const reference = typeof payload.request_id === "string" ? safeRequestId(payload.request_id) : null;
        return text + (reference ? ` Request reference: ${reference}.` : "");
    } catch {
        return unexpected;
    }
}

export function errorDetails(error: Error): { response: string; stackTrace: string | null } {
    try {
        const { stack_trace, ...response } = JSON.parse(error.message);
        return {
            response: JSON.stringify(response, null, 2),
            stackTrace: Array.isArray(stack_trace)
                ? stack_trace.join("\n")
                : typeof stack_trace === "string"
                  ? stack_trace
                  : null,
        };
    } catch {
        return { response: error.message, stackTrace: null };
    }
}

export async function fetchAsk(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, init);
    if (!response.ok) throw new Error(await response.text());
    return response;
}
