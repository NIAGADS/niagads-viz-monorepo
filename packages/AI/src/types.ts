/**
 * @fileoverview TypeScript type definitions for RAG document retrieval
 *
 * These interfaces define the contract between the frontend chat component,
 * backend retrieval service, and TanStack AI tool system.
 */

/**
 * A single document chunk returned by the RAG retrieval service.
 *
 * Each chunk represents a semantic unit (typically a paragraph or section)
 * from a larger document, with metadata for tracking provenance and relevance.
 */
export interface RAGDocRetrievalResult {
    /** Unique identifier for this specific chunk version (for change tracking) */
    chunk_metadata_id: number;
    /** Parent document identifier (links to full document metadata) */
    document_id: number;
    /** Hierarchical section path (e.g., "Chapter 3 > Methods > Data Collection") */
    document_section: string;
    /** Zero-based position of this chunk within the document */
    chunk_index: number;
    /** The actual text content of the chunk (may be null if only metadata is needed) */
    chunk_text?: string | null;
    /** Optional URL to the full document or specific section */
    url?: string | null;
    /** Relevance score from the retrieval algorithm (higher = more relevant; null if unavailable) */
    score?: number | null;
}

/**
 * Request payload for RAG document retrieval.
 *
 * Sent to the retrieval service to fetch relevant document chunks.
 */
export interface RAGDocRetrievalRequest {
    /** Natural language query or question to find relevant documents for */
    query: string;
    /** Optional limit on number of chunks to return (server may enforce maximum) */
    limit?: number;
}

/**
 * Response payload from RAG document retrieval.
 *
 * Contains the original query and the ranked list of matching document chunks.
 */
export interface RAGDocRetrievalResponse {
    /** Echo of the query sent to the service (for request/response matching) */
    query: string;
    /** Array of document chunks ranked by relevance to the query */
    results: RAGDocRetrievalResult[];
}

/**
 * Optional configuration for retrieval requests.
 *
 * Allows customization of HTTP behavior for flexibility in different environments
 * (different auth schemes, request cancellation, etc.).
 */
export interface RAGDocRequestOptions {
    /** Custom HTTP headers (e.g., Authorization, X-Custom-Header) */
    headers?: HeadersInit;
    /** AbortSignal for canceling in-flight requests (React Suspense, cleanup, etc.) */
    signal?: AbortSignal;
}
