/**
 * @fileoverview RAG Document Retrieval Client
 *
 * This module provides utilities for fetching relevant document chunks from the RAG service.
 * It can be used:
 * - Server-side: in tool implementations to fetch context
 * - Client-side: directly in the browser (if CORS allows)
 */

import { RAGDocRequestOptions, RAGDocRetrievalRequest, RAGDocRetrievalResponse } from "./types";

/**
 * Custom error class for RAG document retrieval failures.
 *
 * Extends the standard Error class to include HTTP status information,
 * allowing callers to distinguish between network errors, auth failures, etc.
 */
export class RAGDocRetrievalError extends Error {
    /** HTTP status code from the failed retrieval request */
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "RAGDocRetrievalError";
        this.status = status;
    }
}

/**
 * Retrieves relevant document context from the RAG service.
 *
 * This function makes a POST request to the RAG retrieval endpoint with a user query
 * and returns matching document chunks ranked by relevance.
 *
 * **Usage Example:**
 * ```typescript
 * const response = await retrieveRAGDocContext(
 *   "https://api.example.com/ragdoc/retrieve",
 *   { query: "What is the genetic basis of Alzheimer's?", limit: 10 }
 * );
 * console.log(response.results); // Array of relevant document chunks
 * ```
 *
 * **Integration with TanStack AI Tools:**
 * This function is typically called from within a tool handler:
 * ```typescript
 * const tool = ragdocRetrievalToolDefinition.server((input) =>
 *   retrieveRAGDocContext(endpoint, input, options)
 * );
 * ```
 *
 * @param endpoint - Full URL of the RAG retrieval service endpoint (e.g., /ragdoc/retrieve)
 * @param request - Query and optional limit parameters
 * @param options - Optional configuration (headers, AbortSignal for cancellation)
 * @returns Promise resolving to the retrieval response with matching document chunks
 * @throws RAGDocRetrievalError - If the request fails (non-2xx status code)
 */
export async function retrieveRAGDocContext(
    endpoint: string,
    request: RAGDocRetrievalRequest,
    options: RAGDocRequestOptions = {}
): Promise<RAGDocRetrievalResponse> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(request),
        signal: options.signal,
    });

    if (!response.ok) {
        throw new RAGDocRetrievalError(`RAG document retrieval failed with status ${response.status}`, response.status);
    }

    return response.json() as Promise<RAGDocRetrievalResponse>;
}
