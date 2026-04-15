/**
 * @fileoverview TanStack AI Tool Definition for RAG Document Retrieval
 *
 * This module defines a TanStack AI tool that allows language models to retrieve
 * relevant document chunks during inference. The tool includes:
 * - JSON schema for inputs (query, optional limit)
 * - Output schema describing the document chunk structure
 * - Server-side implementation helper
 *
 * Tools enable the model to take actions and access external data during generation,
 * creating a feedback loop where the model can retrieve context, reason about it,
 * and incorporate it into responses.
 */

import { RAGDocRequestOptions } from "./types";
import { retrieveRAGDocContext } from "./retrieval";
import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export interface RAGDocRetrievalServerToolOptions extends RAGDocRequestOptions {
    defaultLimit?: number;
}

/**
 * TanStack AI Tool definition for RAG document retrieval.
 *
 * This tool makes the retrieve_ragdoc_context function available to the language model.
 * When the model determines that it needs context to answer a question, it will invoke
 * this tool with a query, triggering retrieval of relevant document chunks.
 *
 * **About Zod Schemas:**
 * The inputSchema and outputSchema use Zod, a TypeScript-first validation library.
 * Zod schemas serve three purposes:
 * 1. **Type Definition**: Tells the model what inputs it can send (query: string, limit?: number)
 * 2. **Runtime Validation**: Catches malformed data from the model before it reaches your code
 * 3. **Documentation**: The .describe() calls become model-visible documentation
 *
 * When the model calls this tool, Zod validates the data matches the schema.
 * If data is invalid, you get a clear error immediately instead of runtime failures downstream.
 *
 * **Input Schema:**
 * - query (required): Natural language question or search term
 * - limit (optional): Maximum chunks to return (bounded by server defaults)
 *
 * **Output Schema:**
 * - query: Echo of the input query
 * - results: Array of document chunks with metadata
 *   - chunk_metadata_id: Unique identifier for chunk version tracking
 *   - document_id: Parent document identifier
 *   - document_section: Hierarchical section (chapter, subsection, etc.)
 *   - chunk_index: Position within the document
 *   - chunk_text: The actual document text content
 *   - url: Optional link to the full document
 *   - score: Relevance score from retrieval algorithm (null if unavailable)
 *
 * **Usage in Backend:**
 * ```typescript
 * const tool = ragdocRetrievalToolDefinition.server(
 *   (input) => retrieveRAGDocContext(endpoint, input)
 * );
 * // Pass 'tool' to your model/inference API
 * ```
 */
export const ragdocRetrievalToolDefinition = toolDefinition({
    name: "retrieve_ragdoc_context",
    description:
        "Retrieve relevant RAG document chunks for a user question. Use this before answering questions that require indexed NIAGADS document context.",
    // Input schema: Validates that the model sends { query: string, limit?: number }
    inputSchema: z.object({
        // The query the user asked - pass directly to retrieval
        query: z.string().describe("The natural-language question or search phrase to retrieve context for."),
        // Optional limit to override defaults; let the server enforce maximum bounds
        limit: z.number().optional().describe("Maximum number of context chunks to retrieve."),
    }),
    // Output schema: Defines what this tool returns to the model
    outputSchema: z.object({
        // Echo the query for traceability
        query: z.string(),
        // Array of document chunks ranked by relevance
        results: z.array(
            z.object({
                chunk_metadata_id: z.number(),
                document_id: z.number(),
                document_section: z.string(),
                chunk_index: z.number(),
                chunk_text: z.string().nullable().optional(),
                url: z.string().nullable().optional(),
                score: z.number().nullable().optional(),
            })
        ),
    }),
});

/**
 * Factory function to create a server-side implementation of the RAG retrieval tool.
 *
 * This helper wires together the tool definition with an actual backend endpoint.
 * It handles the model→tool→server request-response cycle:
 * 1. Model generates tool call with query/limit
 * 2. This function receives the input
 * 3. Calls retrieveRAGDocContext to fetch chunks
 * 4. Returns results to the model
 *
 * **Example Backend Integration:**
 * ```typescript
 * // In your chat handler
 * const retrievalTool = createRAGDocRetrievalServerTool(
 *   "https://api.example.com/ragdoc/retrieve",
 *   { headers: { "Authorization": `Bearer ${token}` } }
 * );
 * // Pass to your inference API along with other tools
 * ```
 *
 * @param endpoint - Full URL to the RAG retrieval service
 * @param options - Optional fetch options (headers, signal for cancellation)
 * @returns Configured tool ready to be passed to model/inference APIs
 */
export const createRAGDocRetrievalServerTool = (endpoint: string, options: RAGDocRetrievalServerToolOptions = {}) =>
    ragdocRetrievalToolDefinition.server((input: unknown) => {
        // Type guard: validate that input has the expected shape
        const typedInput = input as { query: string; limit?: number };
        return retrieveRAGDocContext(
            endpoint,
            {
                query: typedInput.query,
                limit: typedInput.limit ?? options.defaultLimit,
            },
            options
        );
    });
